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
  for (const h of hospitals) {
    let newImage = "";
    if (h.name.includes("City")) {
      newImage = "/images/city-general.png";
    } else if (h.name.includes("Mary")) {
      newImage = "/images/st-marys.png";
    } else if (h.name.includes("Wellness")) {
      newImage = "/images/wellness-care.png";
    }

    if (newImage) {
      await prisma.hospital.update({
        where: { id: h.id },
        data: { image: newImage },
      });
      console.log(`Updated ${h.name} image to ${newImage}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => pool.end());
