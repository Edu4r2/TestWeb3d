import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import contentData from '../data/content.json';

export function useExcelData() {
    const [categories, setCategories] = useState(contentData.categories);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExcel = async () => {
            try {
                // Fetch the Excel file from the public folder
                const response = await fetch('/TestWeb3d/items.xlsx');
                if (!response.ok) throw new Error('Failed to fetch Excel file');

                const arrayBuffer = await response.arrayBuffer();
                const workbook = XLSX.read(arrayBuffer, { type: 'array' });

                // Find sheet with "Item" in the name, or default to the second sheet (index 1) if Instructions is first
                // or just look for 'Items' specifically.
                let sheetName = workbook.SheetNames.find(name => name.toLowerCase().includes('item'));
                if (!sheetName) {
                    // Fallback: If instructions is index 0, items might be index 1
                    sheetName = workbook.SheetNames[1] || workbook.SheetNames[0];
                }
                const worksheet = workbook.Sheets[sheetName];

                // Convert to JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                // Transform flat data back to nested structure
                const nestedCategories = transformData(jsonData);
                setCategories(nestedCategories);
            } catch (error) {
                console.error('Error loading Excel data:', error);
                // Fallback to static JSON content is already set as initial state
            } finally {
                setLoading(false);
            }
        };

        fetchExcel();
    }, []);

    return { categories, loading };
}

function transformData(rows) {
    const categoryMap = new Map();

    rows.forEach(row => {
        const catID = row['CategoryID'];
        const tabID = row['TabID'];

        if (!catID) return; // Skip empty rows

        // Create or get Category
        if (!categoryMap.has(catID)) {
            categoryMap.set(catID, {
                id: catID,
                title: row['CategoryTitle (Ref)'] || catID,
                description: row['CategoryDesc'] || '',
                img: row['CategoryImg'] || row['ItemImage'] || '',
                banner: row['CategoryBanner'] || '',
                tabs: new Map()
            });
        }
        const category = categoryMap.get(catID);

        // Create or get Tab
        if (!category.tabs.has(tabID)) {
            category.tabs.set(tabID, {
                id: tabID,
                label: row['TabLabel (Ref)'] || tabID,
                items: []
            });
        }
        const tab = category.tabs.get(tabID);

        // Add Item
        const itemTitle = row['ItemTitle'];
        if (itemTitle) {
            tab.items.push({
                title: itemTitle,
                price: row['ItemPrice'],
                src: row['ItemImage'],
                link: row['ItemLink'],
                description: row['ItemDescription'] || ''
            });
        }
    });

    // Convert Maps to Arrays
    return Array.from(categoryMap.values()).map(cat => ({
        ...cat,
        tabs: Array.from(cat.tabs.values())
    }));
}
