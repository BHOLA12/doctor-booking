import "server-only";
import { randomUUID } from "crypto";
import PDFDocument from "pdfkit";
import { uploadToS3 } from "@/lib/s3";
import { PrescriptionMedicine } from "@/types";

/**
 * Pipes a PDFKit document stream into a single compiled Buffer.
 */
function streamToBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const buffers: Buffer[] = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));
    // Finalize the PDF stream
    doc.end();
  });
}

/**
 * Compiles prescription data into a styled PDF document using PDFKit,
 * and streams it directly to the private S3 store.
 * @returns The unique S3 file key.
 */
export async function generatePrescriptionPdf(input: {
  doctorName: string;
  patientName: string;
  diagnosis: string;
  symptoms: string;
  precautions?: string;
  medicines: PrescriptionMedicine[];
}) {
  const doc = new PDFDocument({ margin: 50 });

  // Add document header
  doc.fontSize(22).fillColor("#1e293b").text("ClinikBook Medical Prescription", { align: "center" });
  doc.moveDown(1.5);

  // Add Metadata section
  doc.fontSize(12).fillColor("#475569").text(`Date: ${new Date().toLocaleDateString()}`);
  doc.text(`Doctor: ${input.doctorName}`);
  doc.text(`Patient: ${input.patientName}`);
  doc.moveDown(1);

  // Divider line
  doc.strokeColor("#cbd5e1").lineWidth(1).moveTo(50, doc.y).lineTo(562, doc.y).stroke();
  doc.moveDown(1.5);

  // Add Clinical Details
  doc.fontSize(14).fillColor("#1e293b").text("Clinical Assessment", { underline: true });
  doc.fontSize(12).fillColor("#334155").text(`Symptoms: ${input.symptoms}`);
  doc.text(`Diagnosis: ${input.diagnosis}`);
  doc.moveDown(1.5);

  // Add Medicines Table header
  doc.fontSize(14).fillColor("#1e293b").text("Prescribed Medications", { underline: true });
  doc.moveDown(0.5);

  input.medicines.forEach((medicine, index) => {
    const medText = `${index + 1}. ${medicine.name} — ${medicine.dosage} (${medicine.frequency} for ${medicine.duration})`;
    doc.fontSize(12).fillColor("#334155").text(medText);
    if (medicine.instructions) {
      doc.fontSize(10).fillColor("#64748b").text(`   Instructions: ${medicine.instructions}`);
    }
    doc.moveDown(0.5);
  });

  doc.moveDown(1);

  // Add Precautions
  doc.fontSize(14).fillColor("#1e293b").text("Precautions & Advice", { underline: true });
  doc.fontSize(12).fillColor("#334155").text(input.precautions || "Rest well and stay hydrated. Take medications as prescribed.");
  doc.moveDown(2);

  // Footer / Disclaimer
  doc.fontSize(9).fillColor("#94a3b8").text(
    "This is a digitally generated medical prescription. In case of emergency, please consult your nearest healthcare clinic.",
    { align: "center" }
  );

  // Compile PDF document buffer
  const fileBuffer = await streamToBuffer(doc);
  const uniqueKey = `uploads/prescriptions/${randomUUID()}.pdf`;

  // Upload private PDF buffer directly to S3
  await uploadToS3(uniqueKey, fileBuffer, "application/pdf");

  return uniqueKey;
}
