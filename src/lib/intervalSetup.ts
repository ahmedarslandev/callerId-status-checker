import { fileModel } from "@/models/file.model";
import { processFile } from "@/lib/fileProcessing";

class FileProcessor {
  private processingInterval: NodeJS.Timeout | null = null;
  private filesAtATime: number;
  private isIntervalRunning: boolean = false;

  constructor() {
    this.filesAtATime = parseInt(
      process.env.FILES_CHECK_AT_A_TIME as string,
      10
    );
  }

  public async startProcessingInterval(
    dbFileId: any,
    filePath: any,
    userDirectory: any,
    filename: any
  ) {

    this.isIntervalRunning = Boolean(
      process.env.IS_INTERVAL_RUNNING
    ) as boolean;

    if (this.processingInterval || this.isIntervalRunning) {
      console.log("Interval already running.");
      return; // Interval already running
    }

    this.processingInterval = setInterval(async () => {
      process.env.IS_INTERVAL_RUNNING = "true";
      try {
        const processingFiles: Array<any> = await fileModel.find({
          status: "processing",
        });

        if (processingFiles.length >= this.filesAtATime) {
          console.log("Limit reached. Skipping processing.");
          return; // Limit reached
        }

        const pendingFile = await fileModel.findOne({ _id: dbFileId });
        if (!pendingFile) {
          console.log("No pending file found.");
          return;
        }

        if (pendingFile.status === "pending") {
          pendingFile.status = "processing";
          await pendingFile.save();

          console.log(`Processing file: ${filename}`);
          await processFile(dbFileId, filePath, userDirectory, filename);

          // Clear the interval after processing is done
          this.clearProcessingInterval();
          console.log(
            `Processing complete and interval cleared for file: ${filename}`
          );
        }
      } catch (error) {
        console.error("Error during file processing:", error);
        this.clearProcessingInterval();
      }

      console.log("Checking for pending files...");
    }, 1000 * 5);

    console.log("Processing interval started.");
  }

  private clearProcessingInterval() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
    }
  }
}

// Example usage
const fileProcessor = new FileProcessor();
export default fileProcessor;
