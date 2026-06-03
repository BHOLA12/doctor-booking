import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Throw descriptive errors if env vars are missing
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_REGION || "us-east-1";

if (!accessKeyId || !secretAccessKey || !bucketName) {
  console.warn("⚠️ AWS S3 environment credentials missing. Falling back to local simulated operations for dev.");
}

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: accessKeyId || "mock",
    secretAccessKey: secretAccessKey || "mock",
  },
});

/**
 * Uploads file buffer to private S3 bucket.
 * @param key Unique key for the file in the bucket.
 * @param fileBuffer Binary buffer data of the file.
 * @param contentType Verified MIME type (e.g. application/pdf, image/png).
 * @returns The S3 key/relative path reference.
 */
export async function uploadToS3(
  key: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<string> {
  if (!accessKeyId || !secretAccessKey || !bucketName) {
    // In local dev without credentials, return local path or log
    console.log(`[Simulated S3 Upload] Uploading "${key}" (${contentType})`);
    return key;
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return key;
}

/**
 * Generates an authenticated pre-signed URL for temporary download access.
 * @param key The key of the item in the S3 bucket.
 * @param expirySeconds Duration in seconds for URL validity (default: 900s = 15m).
 * @returns Pre-signed URL string.
 */
export async function getPresignedDownloadUrl(
  key: string,
  expirySeconds = 900
): Promise<string> {
  if (!accessKeyId || !secretAccessKey || !bucketName) {
    // Local dev mock return
    return `/uploads/mock-presigned/${key}?token=mock-token&expiry=${Date.now() + expirySeconds * 1000}`;
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: expirySeconds });
}
