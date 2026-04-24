import "server-only";

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { PrescriptionMedicine } from "@/types";

function escapePdfText(text: string) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

export async function generatePrescriptionPdf(input: {
  doctorName: string;
  patientName: string;
  diagnosis: string;
  symptoms: string;
  precautions?: string;
  medicines: PrescriptionMedicine[];
}) {
  const lines = [
    "DocBook Prescription",
    `Doctor: ${input.doctorName}`,
    `Patient: ${input.patientName}`,
    `Diagnosis: ${input.diagnosis}`,
    `Symptoms: ${input.symptoms}`,
    "Medicines:",
    ...input.medicines.map(
      (medicine, index) =>
        `${index + 1}. ${medicine.name} | ${medicine.dosage} | ${medicine.frequency} | ${medicine.duration}${medicine.instructions ? ` | ${medicine.instructions}` : ""}`
    ),
    `Precautions: ${input.precautions || "As advised by the doctor"}`,
  ];

  const content = lines
    .map((line, index) => `BT /F1 12 Tf 50 ${760 - index * 18} Td (${escapePdfText(line)}) Tj ET`)
    .join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Count 1 /Kids [3 0 R] >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}\nendstream`,
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefStart = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Root 1 0 R /Size ${objects.length + 1} >>\nstartxref\n${xrefStart}\n%%EOF`;

  const directory = path.join(process.cwd(), "public", "uploads", "prescriptions");
  await mkdir(directory, { recursive: true });
  const fileName = `${randomUUID()}.pdf`;
  const filePath = path.join(directory, fileName);
  await writeFile(filePath, pdf, "utf8");

  return `/uploads/prescriptions/${fileName}`;
}
