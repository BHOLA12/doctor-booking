import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.resolve(__dirname, "..", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: dbPath });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 12);
  const adminPassword = await bcrypt.hash("admin123", 12);

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@docbook.com",
      password: adminPassword,
      role: "ADMIN",
      isVerified: true,
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Create Patients
  const patients = await Promise.all([
    prisma.user.create({
      data: {
        name: "Rahul Kumar",
        email: "rahul@example.com",
        password: hashedPassword,
        phone: "9876543210",
        role: "PATIENT",
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Priya Singh",
        email: "priya@example.com",
        password: hashedPassword,
        phone: "9876543211",
        role: "PATIENT",
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Amit Verma",
        email: "amit@example.com",
        password: hashedPassword,
        phone: "9876543212",
        role: "PATIENT",
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Neha Gupta",
        email: "patient@docbook.com",
        password: hashedPassword,
        phone: "9876543213",
        role: "PATIENT",
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        name: "Suresh Yadav",
        email: "suresh@example.com",
        password: hashedPassword,
        phone: "9876543214",
        role: "PATIENT",
        isVerified: true,
      },
    }),
  ]);
  console.log("✅ Patients created:", patients.length);

  // Doctor data
  const doctorData = [
    {
      name: "Dr. Rajesh Sharma",
      email: "dr.sharma@docbook.com",
      specialization: "Cardiologist",
      experience: 15,
      fees: 800,
      bio: "Senior Cardiologist with 15+ years of experience. Specializes in interventional cardiology and heart failure management. Former HOD at AIIMS Patna.",
      clinicName: "Sharma Heart Care Clinic",
      clinicAddress: "Main Road, Near Gandhi Chowk",
      rating: 4.8,
      totalReviews: 127,
    },
    {
      name: "Dr. Anita Kumari",
      email: "dr.anita@docbook.com",
      specialization: "Gynecologist",
      experience: 12,
      fees: 600,
      bio: "Experienced Gynecologist specializing in high-risk pregnancies, infertility treatment, and laparoscopic surgeries. Compassionate care for women's health.",
      clinicName: "Anita Women's Health Clinic",
      clinicAddress: "Station Road",
      rating: 4.7,
      totalReviews: 98,
    },
    {
      name: "Dr. Vikram Singh",
      email: "dr.vikram@docbook.com",
      specialization: "Orthopedic",
      experience: 10,
      fees: 700,
      bio: "Orthopedic surgeon with expertise in joint replacement, sports injuries, and fracture management. Uses latest minimally invasive techniques.",
      clinicName: "Singh Bone & Joint Clinic",
      clinicAddress: "Hospital Road",
      rating: 4.6,
      totalReviews: 85,
    },
    {
      name: "Dr. Meena Devi",
      email: "dr.meena@docbook.com",
      specialization: "Pediatrician",
      experience: 8,
      fees: 500,
      bio: "Caring pediatrician dedicated to children's health. Expert in neonatal care, vaccination programs, and childhood developmental disorders.",
      clinicName: "Little Stars Child Care",
      clinicAddress: "Bypass Road",
      rating: 4.9,
      totalReviews: 156,
    },
    {
      name: "Dr. Sanjay Prasad",
      email: "dr.sanjay@docbook.com",
      specialization: "Dentist",
      experience: 7,
      fees: 400,
      bio: "Modern dentistry with a gentle touch. Expert in cosmetic dentistry, root canals, dental implants, and orthodontic treatments.",
      clinicName: "Prasad Dental Care",
      clinicAddress: "Market Road, Near Bus Stand",
      rating: 4.5,
      totalReviews: 73,
    },
    {
      name: "Dr. Sunita Rani",
      email: "dr.sunita@docbook.com",
      specialization: "Dermatologist",
      experience: 9,
      fees: 600,
      bio: "Board-certified dermatologist treating all skin conditions. Specializes in acne, eczema, psoriasis, and cosmetic dermatology procedures.",
      clinicName: "Glow Skin Clinic",
      clinicAddress: "Civil Lines",
      rating: 4.4,
      totalReviews: 62,
    },
    {
      name: "Dr. Manoj Kumar",
      email: "dr.manoj@docbook.com",
      specialization: "General Physician",
      experience: 20,
      fees: 300,
      bio: "Experienced general physician providing comprehensive primary care. Expert in managing diabetes, hypertension, and respiratory conditions.",
      clinicName: "Kumar Health Centre",
      clinicAddress: "Gandhi Nagar",
      rating: 4.7,
      totalReviews: 210,
    },
    {
      name: "Dr. Kavita Jha",
      email: "dr.kavita@docbook.com",
      specialization: "ENT Specialist",
      experience: 11,
      fees: 550,
      bio: "ENT specialist with expertise in ear surgeries, sinus treatments, and voice disorders. Advanced endoscopic procedures available.",
      clinicName: "Jha ENT & Hearing Clinic",
      clinicAddress: "College Road",
      rating: 4.3,
      totalReviews: 45,
    },
    {
      name: "Dr. Ravi Shankar",
      email: "dr.ravi@docbook.com",
      specialization: "Neurologist",
      experience: 14,
      fees: 900,
      bio: "Senior neurologist treating epilepsy, stroke, headaches, and neurodegenerative diseases. Advanced EEG and nerve conduction studies.",
      clinicName: "Brain & Spine Clinic",
      clinicAddress: "Medical College Road",
      rating: 4.6,
      totalReviews: 67,
    },
    {
      name: "Dr. Pooja Mishra",
      email: "dr.pooja@docbook.com",
      specialization: "Ophthalmologist",
      experience: 6,
      fees: 450,
      bio: "Eye care specialist offering comprehensive eye exams, cataract surgery, glaucoma treatment, and LASIK consultations.",
      clinicName: "Clear Vision Eye Centre",
      clinicAddress: "Dak Bungalow Road",
      rating: 4.5,
      totalReviews: 52,
    },
    {
      name: "Dr. Ashok Pandey",
      email: "dr.ashok@docbook.com",
      specialization: "Psychiatrist",
      experience: 13,
      fees: 700,
      bio: "Experienced psychiatrist providing compassionate mental health care. Treats depression, anxiety, OCD, and addiction disorders.",
      clinicName: "Mind Wellness Clinic",
      clinicAddress: "Sadar Area",
      rating: 4.8,
      totalReviews: 89,
    },
    {
      name: "Dr. Nandini Roy",
      email: "dr.nandini@docbook.com",
      specialization: "General Physician",
      experience: 5,
      fees: 350,
      bio: "Dedicated general physician focused on preventive healthcare and lifestyle medicine. Specializes in managing chronic conditions.",
      clinicName: "Roy Family Clinic",
      clinicAddress: "New Colony",
      rating: 4.2,
      totalReviews: 34,
    },
    {
      name: "Dr. Ramesh Gupta",
      email: "dr.ramesh@docbook.com",
      specialization: "Urologist",
      experience: 16,
      fees: 850,
      bio: "Senior urologist with expertise in kidney stones, prostate disorders, and urological surgeries. Minimally invasive procedures specialist.",
      clinicName: "Gupta Urology Centre",
      clinicAddress: "NH-83",
      rating: 4.4,
      totalReviews: 58,
    },
    {
      name: "Dr. Aarti Sinha",
      email: "dr.aarti@docbook.com",
      specialization: "Dentist",
      experience: 4,
      fees: 350,
      bio: "Young and passionate dentist offering modern dental care with a focus on pain-free treatments and preventive dentistry.",
      clinicName: "Smile Dental Studio",
      clinicAddress: "Tower Chowk",
      rating: 4.6,
      totalReviews: 41,
    },
    {
      name: "Dr. Vivek Thakur",
      email: "dr.vivek@docbook.com",
      specialization: "Cardiologist",
      experience: 8,
      fees: 750,
      bio: "Cardiologist specializing in echocardiography, stress testing, and preventive cardiology. Committed to heart health awareness.",
      clinicName: "HeartCare Diagnostics",
      clinicAddress: "Arwal Road",
      rating: 4.3,
      totalReviews: 39,
    },
  ];

  // Create Doctors
  const doctorUsers = [];
  for (const d of doctorData) {
    const user = await prisma.user.create({
      data: {
        name: d.name,
        email: d.email,
        password: hashedPassword,
        role: "DOCTOR",
        isVerified: true,
      },
    });

    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        specialization: d.specialization,
        experience: d.experience,
        fees: d.fees,
        bio: d.bio,
        clinicName: d.clinicName,
        clinicAddress: d.clinicAddress,
        city: "New Delhi",
        state: "India",
        isApproved: true,
        rating: d.rating,
        totalReviews: d.totalReviews,
        consultationType: "BOTH",
      },
    });

    doctorUsers.push({ user, doctor });
  }
  console.log("✅ Doctors created:", doctorUsers.length);

  // Create Slots for each doctor (Mon-Sat, various time ranges)
  const slotConfigs = [
    { days: [1, 2, 3, 4, 5, 6], startHour: 9, endHour: 13 }, // Morning
    { days: [1, 2, 3, 4, 5], startHour: 16, endHour: 20 }, // Evening
  ];

  for (const { doctor } of doctorUsers) {
    const slots = [];
    for (const config of slotConfigs) {
      for (const day of config.days) {
        for (let hour = config.startHour; hour < config.endHour; hour++) {
          slots.push({
            doctorId: doctor.id,
            dayOfWeek: day,
            startTime: `${hour.toString().padStart(2, "0")}:00`,
            endTime: `${hour.toString().padStart(2, "0")}:30`,
            isActive: true,
          });
          slots.push({
            doctorId: doctor.id,
            dayOfWeek: day,
            startTime: `${hour.toString().padStart(2, "0")}:30`,
            endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
            isActive: true,
          });
        }
      }
    }
    await prisma.slot.createMany({ data: slots });
  }
  console.log("✅ Slots created for all doctors");

  // Create sample appointments
  const today = new Date();
  const appointments = [
    {
      patientId: patients[0].id,
      doctorId: doctorUsers[0].doctor.id,
      date: today.toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "09:30",
      status: "CONFIRMED",
      consultationType: "OFFLINE",
    },
    {
      patientId: patients[1].id,
      doctorId: doctorUsers[0].doctor.id,
      date: today.toISOString().split("T")[0],
      startTime: "10:00",
      endTime: "10:30",
      status: "PENDING",
      consultationType: "ONLINE",
    },
    {
      patientId: patients[2].id,
      doctorId: doctorUsers[1].doctor.id,
      date: today.toISOString().split("T")[0],
      startTime: "11:00",
      endTime: "11:30",
      status: "CONFIRMED",
      consultationType: "OFFLINE",
    },
    {
      patientId: patients[0].id,
      doctorId: doctorUsers[3].doctor.id,
      date: new Date(today.getTime() + 86400000).toISOString().split("T")[0],
      startTime: "16:00",
      endTime: "16:30",
      status: "PENDING",
      consultationType: "ONLINE",
      notes: "Follow up for fever",
    },
    {
      patientId: patients[3].id,
      doctorId: doctorUsers[4].doctor.id,
      date: new Date(today.getTime() - 86400000 * 3).toISOString().split("T")[0],
      startTime: "09:30",
      endTime: "10:00",
      status: "COMPLETED",
      consultationType: "OFFLINE",
    },
    {
      patientId: patients[4].id,
      doctorId: doctorUsers[6].doctor.id,
      date: new Date(today.getTime() - 86400000 * 2).toISOString().split("T")[0],
      startTime: "17:00",
      endTime: "17:30",
      status: "COMPLETED",
      consultationType: "OFFLINE",
    },
  ];

  await prisma.appointment.createMany({ data: appointments });
  console.log("✅ Appointments created:", appointments.length);

  // Create sample reviews
  const reviews = [
    { patientId: patients[0].id, doctorId: doctorUsers[0].doctor.id, rating: 5, comment: "Excellent doctor! Very thorough examination and clear explanation." },
    { patientId: patients[1].id, doctorId: doctorUsers[0].doctor.id, rating: 4, comment: "Good experience. Wait time was a bit long but treatment was great." },
    { patientId: patients[2].id, doctorId: doctorUsers[1].doctor.id, rating: 5, comment: "Very caring and professional. Best gynecologist in the city." },
    { patientId: patients[3].id, doctorId: doctorUsers[3].doctor.id, rating: 5, comment: "My child loves visiting Dr. Meena! So patient and kind." },
    { patientId: patients[0].id, doctorId: doctorUsers[4].doctor.id, rating: 4, comment: "Clean clinic and painless treatment. Highly recommend." },
    { patientId: patients[1].id, doctorId: doctorUsers[6].doctor.id, rating: 5, comment: "Dr. Manoj is our family doctor. Excellent diagnosis every time." },
    { patientId: patients[4].id, doctorId: doctorUsers[6].doctor.id, rating: 4, comment: "Very experienced and affordable. Go-to doctor for general issues." },
    { patientId: patients[2].id, doctorId: doctorUsers[8].doctor.id, rating: 5, comment: "Handled my migraine issue brilliantly. Life-changing treatment." },
  ];

  await prisma.review.createMany({ data: reviews });
  console.log("✅ Reviews created:", reviews.length);

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📋 Login Credentials:");
  console.log("   Admin:   admin@docbook.com / admin123");
  console.log("   Doctor:  dr.sharma@docbook.com / password123");
  console.log("   Patient: patient@docbook.com / password123");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
