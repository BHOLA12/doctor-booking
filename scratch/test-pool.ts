import { Pool } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config();

console.log("DATABASE_URL length:", process.env.DATABASE_URL?.length);

try {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  console.log("Pool created successfully");
  
  pool.query("SELECT 1 as val")
    .then(res => console.log("Query success:", res.rows))
    .catch(err => console.error("Query error:", err.message))
    .finally(() => pool.end());
    
} catch (e: any) {
  console.error("Pool error:", e.message);
}
