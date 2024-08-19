import * as XLSX from "xlsx";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function saveResTitles(
  titles: { callerId: string; status: string }[],
  userDirectory: any,
  filename: any
): Promise<any | null> {
  try {
    const worksheetData = [
      ["callerIDs", "status"],
      ...titles.map((title) => [title.callerId, title.status]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Results");

    const filePathRes = join(userDirectory, `${filename}_Completed.xlsx`);
    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    console.log(filePathRes);
    await writeFile(filePathRes, buffer);

    return filePathRes;
  } catch (error) {
    console.error("Error saving file:", error);
    return null;
  }
}
