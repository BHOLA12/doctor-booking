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

  const femaleImages = [
    "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1594824436998-d40b243ea4f2?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1623854767648-e7bb8009f0db?auto=format&fit=crop&q=80&w=300&h=300"
  ];

  const maleImages = [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1550831107-1553da8c8464?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=300&h=300"
  ];

  const pharmacyImages = [
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=300&h=300",
    "https://images.unsplash.com/photo-1631549916768-4119b2e55c26?auto=format&fit=crop&q=80&w=300&h=300"
  ];

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@clinikbook.health",
      password: adminPassword,
      role: "ADMIN",
      isVerified: true,
      avatar: maleImages[4],
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
        avatar: maleImages[0],
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
        avatar: femaleImages[0],
      },
    }),
    prisma.user.create({
      data: {
        name: "Neha Gupta",
        email: "patient@clinikbook.health",
        password: hashedPassword,
        phone: "9876543213",
        role: "PATIENT",
        isVerified: true,
        avatar: femaleImages[1],
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
  for (let i = 0; i < pharmacyData.length; i++) {
    const p = pharmacyData[i];
    const user = await prisma.user.create({
      data: {
        name: p.storeName,
        email: p.email,
        password: hashedPassword,
        role: "PHARMACY",
        isVerified: true,
        avatar: pharmacyImages[i % pharmacyImages.length],
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
      email: "dr.sharma@clinikbook.health",
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
      email: "dr.anita@clinikbook.health",
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
      email: "dr.meena@clinikbook.health",
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
      email: "dr.ashok@clinikbook.health",
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
      email: "dr.manoj@clinikbook.health",
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
  for (let i = 0; i < doctorData.length; i++) {
    const d = doctorData[i];
    
    // Choose gender-appropriate avatar
    let avatarUrl = maleImages[0];
    if (d.name.includes("Anita")) {
      avatarUrl = femaleImages[2];
    } else if (d.name.includes("Meena")) {
      avatarUrl = femaleImages[3];
    } else if (d.name.includes("Ashok")) {
      avatarUrl = maleImages[2];
    } else if (d.name.includes("Manoj")) {
      avatarUrl = maleImages[3];
    } else if (d.name.includes("Rajesh")) {
      avatarUrl = maleImages[1];
    }

    const user = await prisma.user.create({
      data: {
        name: d.name,
        email: d.email,
        password: hashedPassword,
        role: "DOCTOR",
        isVerified: true,
        avatar: avatarUrl,
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
