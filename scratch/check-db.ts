import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hospitals = await prisma.hospital.findMany();
  console.log("Hospitals in DB:", JSON.stringify(hospitals, null, 2));
}

main()
  .catch(console.error)
  .finally(() => pool.end());
