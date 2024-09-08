import axios from "axios";

export async function uploadToS3(file: File | any, walletId: string) {
  try {
    const url: any = process.env.WHATSAPP_MESSAGE_SENDER_URL;
    console.log(file, walletId);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("walletId", walletId);
    const res = await axios.post(url, formData);

    return { success: true, message: res };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return { success: false, message: "Upload failed" };
  }
}
