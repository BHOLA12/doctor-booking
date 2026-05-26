import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import bcrypt from "bcryptjs";

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.pharmacy.deleteMany();
  await prisma.hospital.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 12);
  const adminPassword = await bcrypt.hash("admin123", 12);

  // Create Hospitals
  const hospitals = await Promise.all([
    prisma.hospital.create({
      data: {
        name: "City General Hospital",
        address: "123 Healthcare Ave, South Extension",
        city: "New Delhi",
        rating: 4.8,
        totalReviews: 450,
        image: "/images/city-general.png",
        specialties: ["Cardiologist", "Neurologist", "Orthopedic", "General Physician"],
      },
    }),
    prisma.hospital.create({
      data: {
        name: "St. Mary's Medical Center",
        address: "45 Wellness Lane, Civil Lines",
        city: "New Delhi",
        rating: 4.6,
        totalReviews: 320,
        image: "/images/st-marys.png",
        specialties: ["Pediatrician", "Gynecologist", "Dentist", "Dermatologist"],
      },
    }),
    prisma.hospital.create({
      data: {
        name: "Wellness Care Institute",
        address: "78 Healing Road, Rohini",
        city: "New Delhi",
        rating: 4.5,
        totalReviews: 280,
        image: "/images/wellness-care.png",
        specialties: ["Psychiatrist", "ENT Specialist", "Ophthalmologist", "Urologist", "Sexologist"],
      },
    }),
  ]);
  console.log("✅ Hospitals created:", hospitals.length);

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
        name: "Neha Gupta",
        email: "patient@docbook.com",
        password: hashedPassword,
        phone: "9876543213",
        role: "PATIENT",
        isVerified: true,
      },
    }),
  ]);
  console.log("✅ Patients created:", patients.length);

  // Create Pharmacies
  const pharmacyData = [
    {
      storeName: "Hindustan Medical Hall",
      email: "hindustan.med@gmail.com",
      ownerName: "Subhash Chandra Keshri",
      pharmacistName: "Rakesh Kumar",
      pharmacistRegNo: "REG-8390-PH",
      dl20: "DL-20-9430B",
      dl21: "DL-21-9430B",
      gstin: "10ABCDE1234F1Z5",
      address: "Jehanabad Court, Patna-Gaya Highway",
      pincode: "804408",
      latitude: 25.2165,
      longitude: 84.9902,
      rating: 4.8,
      totalReviews: 180,
    },
    {
      storeName: "Ajay Medical Hall",
      email: "ajay.med@gmail.com",
      ownerName: "Ajay Kumar Gupta",
      pharmacistName: "Sanjay Kumar",
      pharmacistRegNo: "REG-4321-PH",
      dl20: "DL-20-3021B",
      dl21: "DL-21-3021B",
      gstin: "10GHIJK5678L2Z6",
      address: "Main Market, Hospital Road",
      pincode: "804408",
      latitude: 25.2132,
      longitude: 84.9858,
      rating: 4.6,
      totalReviews: 95,
    },
    {
      storeName: "Gudvil Medical Hall",
      email: "gudvil.med@gmail.com",
      ownerName: "Vinay Prasad",
      pharmacistName: "Aman Gupta",
      pharmacistRegNo: "REG-7210-PH",
      dl20: "DL-20-5821B",
      dl21: "DL-21-5821B",
      gstin: "10MNOPQ9012R3Z7",
      address: "Rajabazar, NH-83, Patna-Gaya Road",
      pincode: "804408",
      latitude: 25.2215,
      longitude: 84.9934,
      rating: 4.5,
      totalReviews: 64,
    },
    {
      storeName: "Green Medical Hall",
      email: "green.med@gmail.com",
      ownerName: "Praveen Yadav",
      pharmacistName: "Suresh Kumar",
      pharmacistRegNo: "REG-1928-PH",
      dl20: "DL-20-8321B",
      dl21: "DL-21-8321B",
      gstin: "10STUVW3456T4Z8",
      address: "Main Market, Hospital Road",
      pincode: "804408",
      latitude: 25.2130,
      longitude: 84.9848,
      rating: 4.3,
      totalReviews: 42,
    }
  ];

  const pharmacyUsers = [];
  for (const p of pharmacyData) {
    const user = await prisma.user.create({
      data: {
        name: p.storeName,
        email: p.email,
        password: hashedPassword,
        role: "PHARMACY",
        isVerified: true,
      },
    });

    const pharmacy = await prisma.pharmacy.create({
      data: {
        userId: user.id,
        storeName: p.storeName,
        ownerName: p.ownerName,
        pharmacistName: p.pharmacistName,
        pharmacistRegNo: p.pharmacistRegNo,
        dl20: p.dl20,
        dl21: p.dl21,
        gstin: p.gstin,
        address: p.address,
        pincode: p.pincode,
        latitude: p.latitude,
        longitude: p.longitude,
        rating: p.rating,
        totalReviews: p.totalReviews,
      },
    });

    pharmacyUsers.push({ user, pharmacy });
  }
  console.log("✅ Pharmacies created:", pharmacyUsers.length);

  // Doctor data
  const doctorData = [
    {
      name: "Dr. Rajesh Sharma",
      email: "dr.sharma@docbook.com",
      specialization: "Cardiologist",
      experience: 15,
      fees: 800,
      bio: "Senior Cardiologist with 15+ years of experience.",
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
      bio: "Experienced Gynecologist specializing in high-risk pregnancies.",
      clinicName: "Anita Women's Health Clinic",
      clinicAddress: "Station Road",
      rating: 4.7,
      totalReviews: 98,
    },
    {
      name: "Dr. Meena Devi",
      email: "dr.meena@docbook.com",
      specialization: "Pediatrician",
      experience: 8,
      fees: 500,
      bio: "Caring pediatrician dedicated to children's health.",
      clinicName: "Little Stars Child Care",
      clinicAddress: "Bypass Road",
      rating: 4.9,
      totalReviews: 156,
    },
    {
      name: "Dr. Ashok Pandey",
      email: "dr.ashok@docbook.com",
      specialization: "Psychiatrist",
      experience: 13,
      fees: 700,
      bio: "Experienced psychiatrist providing compassionate mental health care.",
      clinicName: "Mind Wellness Clinic",
      clinicAddress: "Sadar Area",
      rating: 4.8,
      totalReviews: 89,
    },
    {
      name: "Dr. Manoj Kumar",
      email: "dr.manoj@docbook.com",
      specialization: "General Physician",
      experience: 20,
      fees: 300,
      bio: "Experienced general physician providing comprehensive primary care.",
      clinicName: "Kumar Health Centre",
      clinicAddress: "Gandhi Nagar",
      rating: 4.7,
      totalReviews: 210,
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

    // Assign doctor to a hospital based on specialization
    const hospital = hospitals.find(h => 
      (h.specialties as string[]).includes(d.specialization)
    ) || hospitals[0];

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
        hospitalId: hospital.id,
      },
    });

    doctorUsers.push({ user, doctor });
  }
  console.log("✅ Doctors created:", doctorUsers.length);

  // Create Slots for each doctor
  for (const { doctor } of doctorUsers) {
    const slots = [];
    for (let day = 1; day <= 6; day++) {
      for (let hour = 9; hour < 12; hour++) {
        slots.push({
          doctorId: doctor.id,
          dayOfWeek: day,
          startTime: `${hour.toString().padStart(2, "0")}:00`,
          endTime: `${hour.toString().padStart(2, "0")}:30`,
          isActive: true,
        });
      }
    }
    await prisma.slot.createMany({ data: slots });
  }
  console.log("✅ Slots created for all doctors");

  console.log("\n🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
