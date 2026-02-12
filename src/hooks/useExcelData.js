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

                // Assume items are in the first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

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
        // Create or get Category
        if (!categoryMap.has(row.CategoryID)) {
            categoryMap.set(row.CategoryID, {
                id: row.CategoryID,
                title: row.CategoryTitle,
                description: row.CategoryDesc,
                img: row.CategoryImg,
                banner: row.CategoryBanner,
                tabs: new Map() // Use map to deduplicate tabs
            });
        }
        const category = categoryMap.get(row.CategoryID);

        // Create or get Tab
        if (!category.tabs.has(row.TabID)) {
            category.tabs.set(row.TabID, {
                id: row.TabID,
                label: row.TabLabel,
                items: []
            });
        }
        const tab = category.tabs.get(row.TabID);

        // Add Item
        tab.items.push({
            title: row.ItemTitle,
            price: row.ItemPrice,
            src: row.ItemImage,
            link: row.ItemLink,
            description: row.ItemDescription
        });
    });

    // Convert Maps to Arrays
    return Array.from(categoryMap.values()).map(cat => ({
        ...cat,
        tabs: Array.from(cat.tabs.values())
    }));
}
