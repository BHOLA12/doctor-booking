import "server-only";
import { randomUUID } from "crypto";
import { uploadToS3 } from "@/lib/s3";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB hard limit

export async function saveUploadedFile(input: {
  file: File;
  folder: string;
}) {
  // Validate file size before parsing buffers
  if (input.file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File size exceeds the 10MB safety limit");
  }

  const bytes = await input.file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Dynamic import of file-type to support ESM package inside Next.js node environments
  const { fileTypeFromBuffer } = await import("file-type");
  const verifiedType = await fileTypeFromBuffer(buffer);

  if (!verifiedType || !ALLOWED_MIME_TYPES.includes(verifiedType.mime)) {
    throw new Error("Unsupported file type. Only JPEG, PNG, and PDF files are allowed.");
  }

  // Generate safe server-side UUID filename (ignore original client file naming vectors)
  const uniqueKey = `${input.folder}/${randomUUID()}.${verifiedType.ext}`.replace(/\\/g, "/");

  // Stream binary buffer to secure private S3 store
  await uploadToS3(uniqueKey, buffer, verifiedType.mime);

  return {
    fileName: input.file.name, // Keep the original name for metadata display
    fileUrl: uniqueKey,        // Save the unique S3 Key as url pointer in DB
  };
}
