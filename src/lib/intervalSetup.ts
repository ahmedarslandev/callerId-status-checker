import { fileModel } from "@/models/file.model";
import { processFile } from "@/lib/fileProcessing";
import { join } from "path";

// Global variables
let hasRun = false;
let processingInterval: NodeJS.Timeout | null = null;
const filesAtATime = parseInt(process.env.FILES_CHECK_AT_A_TIME as string, 10);

const processPendingFiles = async () => {
  try {
    const processingFiles = await fileModel.find({ status: "processing" });

    if (processingFiles.length >= filesAtATime) {
      console.log("Limit reached. Skipping processing.");
      return; // Limit reached
    }

    const pendingFile = await fileModel.findOne({ status: "pending" });

    if (!pendingFile) {
      console.log("No pending file found.");
      return;
    }

    const userDirectory = join(
      "./public/uploads",
      pendingFile.owner.toString()
    );

    console.log(`Processing file: ${pendingFile.filename}`);
    await processFile(
      pendingFile._id,
      pendingFile.filePath,
      userDirectory,
      pendingFile.filename,
      pendingFile.extentionName
    );

    console.log(`Processing complete for file: ${pendingFile.filename , pendingFile.extentionName}`);
  } catch (error) {
    console.error("Error during file processing:", error);
  }
};

const startProcessingInterval = () => {
  if (hasRun) {
    console.log("Processing function has already been executed.");
    return; // Prevent further execution
  }

  hasRun = true;

  if (processingInterval) {
    console.log("Processing interval already running.");
    return; // Interval already running
  }

  processingInterval = setInterval(() => {
    console.log("Checking for pending files...");
    processPendingFiles();
  }, 1000 * 30); // Check every 30 seconds

  console.log("Processing interval started.");
};

// Example usage
export  { startProcessingInterval };
