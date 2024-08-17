// utils/parseFile.ts

import fs from "fs";
import path from "path";
import { read, utils } from "xlsx";
import { parse as parseCSV } from "csv-parse/sync";

export async function parseFile(filePath: string) {
  const extname = path.extname(filePath);

  const fileContent = fs.readFileSync(`./public/uploads${filePath}`);

  let data: any[];

  if (extname === ".xlsx" || extname === ".xlsm") {
    const workbook = read(fileContent, { type: "buffer" });
    const sheetNames = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetNames[0]]; // assuming first sheet
    data = utils.sheet_to_json(sheet);
  } else if (extname === ".csv") {
    data = parseCSV(fileContent, { columns: true });
  } else {
    throw new Error("Unsupported file type");
  }

  return data;
}
