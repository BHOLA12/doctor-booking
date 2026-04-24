import "server-only";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];
const PUBLIC_DIR = path.join(process.cwd(), "public");

export async function saveUploadedFile(input: {
  file: File;
  folder: string;
}) {
  const extension = path.extname(input.file.name).toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    throw new Error("Unsupported file type");
  }

  const safeFolder = path.join(PUBLIC_DIR, input.folder);
  await mkdir(safeFolder, { recursive: true });

  const fileName = `${randomUUID()}${extension}`;
  const absolutePath = path.join(safeFolder, fileName);
  const bytes = await input.file.arrayBuffer();

  await writeFile(absolutePath, Buffer.from(bytes));

  return {
    fileName: input.file.name,
    fileUrl: `/${input.folder}/${fileName}`.replace(/\\/g, "/"),
  };
}
