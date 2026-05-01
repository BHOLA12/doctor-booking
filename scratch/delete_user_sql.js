const { neon } = require("@neondatabase/serverless");

async function main() {
  const url = "postgresql://neondb_owner:npg_L4OJMFW9izZn@ep-gentle-waterfall-aontalvm-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=verify-full";
  const sql = neon(url);
  const email = "rr4175653@gmail.com";
  
  try {
    const result = await sql`DELETE FROM "User" WHERE email = ${email}`;
    console.log("Deletion successful");
  } catch (error) {
    console.error("Error deleting user with raw SQL:", error);
  }
}

main();
