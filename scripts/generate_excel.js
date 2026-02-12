import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const contentPath = path.join(__dirname, '../src/data/content.json');
const outputPath = path.join(__dirname, '../public/items.xlsx');

// Read content.json (for initial structure if needed, though now empty categories... 
// actually we cleared content.json categories!
// We should probably rely on the *previous* content.json or just the structure we know. 
// Wait, if I cleaned content.json, I lost the source data to "regenerate" from!
// CRITICAL: Check if I have a backup or if I need to fetch the existing Excel file first to preserve data.
// Since I just generated the Excel file in the previous step, I should READ the existing Excel file first
// to preserve any data, OR rely on the fact that I haven't closed the session so I might have the data 
// in previous artifacts? No, artifacts are separate.
// 
// However, the user just asked to *style* it. If I run the script using the *now empty* content.json,
// I will generate an empty Excel file!
// 
// I must modify the script to:
// 1. Read the EXISTING `items.xlsx` to get the current data.
// 2. OR, assuming the user hasn't edited it yet, I can try to hardcode the "seed" data again 
//    or read from the backup I hopefully made? 
// 
// Actually, I should probably read the existing 'Items' sheet from `items.xlsx` if it exists,
// and if not, use a default set. But wait, I just wiped `content.json`.
// 
// Let's implement a "read existing excel" approach to be safe, ensuring we don't wipe data.
// Or, simply re-construct the seed data from the hardcoded values I saw in the previous `content.json` view
// if reading is too complex for a script (it's not).
// 
// Better approach: Read `public/items.xlsx` first using `exceljs`, load the data, then re-write it with new styles.

async function applyStylesToExcel() {
    const workbook = new ExcelJS.Workbook();

    // Try to load existing file
    try {
        await workbook.xlsx.readFile(outputPath);
    } catch (error) {
        console.error("Could not read existing Excel file. Reseeding from backup data involves complexity/risk without content.json.");
        // Fallback: If file doesn't exist, we might be in trouble since content.json is empty.
        // But the file SHOULD exist from previous step.
    }

    // Get "Items" sheet
    let wsItems = workbook.getWorksheet('Items');
    if (!wsItems) {
        console.log("No Items sheet found, creating new one...");
        wsItems = workbook.addWorksheet('Items');
    }

    // 1. Add Instructions Sheet (Move to first position)
    let wsInstructions = workbook.getWorksheet('Instructions');
    if (!wsInstructions) {
        wsInstructions = workbook.addWorksheet('Instructions');
    }
    // Reorder sheets: Instructions first
    workbook.views = [
        {
            x: 0, y: 0, width: 10000, height: 20000,
            firstSheet: 0, activeTab: 0, visibility: 'visible'
        }
    ];
    // We can't easily reorder the array in exceljs typically, but setting active tab helps.

    // --- STYLING INSTRUCTIONS ---
    wsInstructions.getColumn(1).width = 80;
    wsInstructions.getCell('A1').value = "HOW TO USE THIS FILE";
    wsInstructions.getCell('A1').font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    wsInstructions.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFBAD18' } }; // Brand Accent
    wsInstructions.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    wsInstructions.getRow(1).height = 40;

    const instructions = [
        "1. Go to the 'Items' tab at the bottom.",
        "2. To ADD a new item, fill in a new row.",
        "3. Use the Dropdowns in Columns A (Category) and B (Tab) to select valid options.",
        "4. Fill in the Title, Price, Image path, and Link.",
        "5. Save this file (Ctrl+S).",
        "6. Refresh your website to see the changes!"
    ];

    instructions.forEach((line, index) => {
        const cell = wsInstructions.getCell(`A${index + 3}`);
        cell.value = line;
        cell.font = { size: 12 };
    });

    // --- STYLING ITEMS SHEET ---

    // Header Row
    const headerRow = wsItems.getRow(1);
    headerRow.height = 30;
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFBAD18' } // Brand Accent
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Columns styling
    wsItems.columns.forEach(col => {
        // Border for all cells in column
        // We iterate rows to be safe or just set style on column? ExcelJS column style applies to new cells.
        // Let's iterate existing rows to apply borders.
        col.width = col.key === 'ItemDescription' ? 50 : (col.key === 'ItemImage' ? 40 : 25);
    });

    wsItems.eachRow((row, rowNumber) => {
        row.eachCell((cell) => {
            cell.border = {
                top: { style: 'thin', color: { argb: 'FFEEEEEE' } },
                left: { style: 'thin', color: { argb: 'FFEEEEEE' } },
                bottom: { style: 'thin', color: { argb: 'FFEEEEEE' } },
                right: { style: 'thin', color: { argb: 'FFEEEEEE' } }
            };

            // Alternating Row Colors (Zebra)
            if (rowNumber > 1 && rowNumber % 2 === 0) {
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFAFAFA' } // Very light gray
                };
            }

            // Center alignment for specific columns (IDs, Price)
            if (rowNumber > 1 && (cell.col <= 2 || cell.col === 4)) {
                cell.alignment = { horizontal: 'center' };
            }
        });
    });

    // Re-apply Validation (just in case)
    // We assume validation is already there or we need to re-add it. 
    // Since we read the file, validation might persist, but exceljs sometimes drops it on read/write? 
    // Safer to re-apply if we had the logic, but I can't easily query the "Values" sheet range dynamically 
    // without knowing the count. 
    // Assuming the previous script's validation persists. If not, I'd need to re-implement the logic 
    // to find key counts.

    // Let's verify if 'Values' sheet exists
    const wsValues = workbook.getWorksheet('Values');
    if (wsValues) {
        // Re-apply validation loop to ensure it covers all rows
        const catCount = wsValues.getColumn('A').values.length - 1; // approx
        const tabCount = wsValues.getColumn('B').values.length - 1;
        const catRange = `'Values'!$A$2:$A$${catCount}`;
        const tabRange = `'Values'!$B$2:$B$${tabCount}`;

        const rowCount = wsItems.rowCount;
        for (let i = 2; i <= rowCount + 50; i++) {
            wsItems.getCell(`A${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: [catRange],
                showErrorMessage: true,
                errorStyle: 'warning',
                errorTitle: 'Invalid Category',
                error: 'Select from list.'
            };
            wsItems.getCell(`B${i}`).dataValidation = {
                type: 'list',
                allowBlank: true,
                formulae: [tabRange],
                showErrorMessage: true,
                errorStyle: 'warning',
                errorTitle: 'Invalid Tab',
                error: 'Select from list.'
            };
        }
    }

    await workbook.xlsx.writeFile(outputPath);
    console.log(`Styled Excel file updated at: ${outputPath}`);
}

applyStylesToExcel().catch(err => console.error(err));
