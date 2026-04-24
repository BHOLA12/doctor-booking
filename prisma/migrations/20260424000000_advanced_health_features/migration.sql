ALTER TABLE "Doctor"
ADD COLUMN IF NOT EXISTS "licenseNumber" TEXT;

ALTER TABLE "Appointment"
ADD COLUMN IF NOT EXISTS "appointmentType" TEXT NOT NULL DEFAULT 'NORMAL',
ADD COLUMN IF NOT EXISTS "priorityRank" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN IF NOT EXISTS "queuePositionSnapshot" INTEGER,
ADD COLUMN IF NOT EXISTS "estimatedWaitMinutes" INTEGER,
ADD COLUMN IF NOT EXISTS "symptoms" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Doctor_licenseNumber_key" ON "Doctor"("licenseNumber");
CREATE INDEX IF NOT EXISTS "Appointment_doctorId_date_status_idx" ON "Appointment"("doctorId", "date", "status");
CREATE INDEX IF NOT EXISTS "Appointment_doctorId_date_priorityRank_createdAt_idx" ON "Appointment"("doctorId", "date", "priorityRank", "createdAt");

CREATE TABLE IF NOT EXISTS "MedicalReport" (
  "id" TEXT NOT NULL,
  "patientId" TEXT NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "summary" TEXT,
  CONSTRAINT "MedicalReport_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "MedicalReport_patientId_date_idx" ON "MedicalReport"("patientId", "date" DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'MedicalReport_patientId_fkey'
  ) THEN
    ALTER TABLE "MedicalReport"
    ADD CONSTRAINT "MedicalReport_patientId_fkey"
    FOREIGN KEY ("patientId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "Notification" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "link" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt" DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'Notification_userId_fkey'
  ) THEN
    ALTER TABLE "Notification"
    ADD CONSTRAINT "Notification_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "Prescription" (
  "id" TEXT NOT NULL,
  "appointmentId" TEXT,
  "patientId" TEXT NOT NULL,
  "doctorId" TEXT NOT NULL,
  "symptoms" TEXT NOT NULL,
  "diagnosis" TEXT NOT NULL,
  "medicines" JSONB NOT NULL,
  "precautions" TEXT,
  "pdfUrl" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Prescription_appointmentId_key" ON "Prescription"("appointmentId");
CREATE INDEX IF NOT EXISTS "Prescription_patientId_createdAt_idx" ON "Prescription"("patientId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Prescription_doctorId_createdAt_idx" ON "Prescription"("doctorId", "createdAt" DESC);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'Prescription_appointmentId_fkey'
  ) THEN
    ALTER TABLE "Prescription"
    ADD CONSTRAINT "Prescription_appointmentId_fkey"
    FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'Prescription_patientId_fkey'
  ) THEN
    ALTER TABLE "Prescription"
    ADD CONSTRAINT "Prescription_patientId_fkey"
    FOREIGN KEY ("patientId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'Prescription_doctorId_fkey'
  ) THEN
    ALTER TABLE "Prescription"
    ADD CONSTRAINT "Prescription_doctorId_fkey"
    FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
