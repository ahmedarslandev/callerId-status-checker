import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

export function readXlsxFile(filePath: string): string[] {
  try {
    const fullPath = path.resolve(filePath);

    // Read the file as a buffer
    const fileBuffer = fs.readFileSync(fullPath);

    // Parse the .xlsx file
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });

    // Assuming the caller IDs are in the first sheet and first column
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convert the sheet to JSON
    const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Extract caller IDs from the first column (assuming caller IDs are in the first column)
    const callerIds = jsonSheet
      .splice(1)
      .map((row: any, i) => String(row[0]))
      .filter(Boolean);

    return callerIds;
  } catch (error: any) {
    console.log(error.message);
    return null as any;
  }
}
