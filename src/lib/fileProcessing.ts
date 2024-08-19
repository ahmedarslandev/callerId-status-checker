import { fileModel } from "@/models/file.model";
import { readXlsxFile } from "./readFile";
import { handleDidsRes } from "./handel.checking.ids";
import { saveResTitles } from "./writeResFile";

export async function processFile(
  dbFileId: any,
  filePath: string,
  userDirectory: string,
  filename: string
) {
  try {
    const filesAtATime = parseInt(process.env.FILES_CHECK_AT_A_TIME as any);
    const batchSize = parseInt(process.env.BATCH_SIZE as any);

    const dbFile = await fileModel.findOne({ _id: dbFileId });
    const filesInProcessing = await fileModel.find({ status: "processing" });

    if (filesInProcessing.length >= filesAtATime) {
      return "limit reached";
    }

    if (dbFile.status == "pending") {
      dbFile.status = "processing";
      await dbFile.save();

      const callerIds = readXlsxFile(filePath);
      if (!callerIds) {
        dbFile.status = "failed";
        await dbFile.save();
        return "failed";
      }

      const batchTitles = await handleDidsRes(callerIds);
      await Promise.all(batchTitles);
      await saveResTitles(batchTitles, userDirectory, filename);
      dbFile.status = "completed";
      await dbFile.save();
      return "success";
    }

    return "File already checked";
  } catch (error: any) {
    console.log("PATH ERROR",error.message);
    return null;
  }
}
