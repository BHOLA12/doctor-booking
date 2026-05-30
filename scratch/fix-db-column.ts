import pg from "pg";
import "dotenv/config";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  await pool.query('ALTER TABLE "Pharmacy" ADD COLUMN IF NOT EXISTS "isApproved" BOOLEAN DEFAULT false;');
  console.log("Successfully added isApproved column to Pharmacy table!");
}

main()
  .catch(console.error)
  .finally(() => pool.end());
