require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const users = await sql`SELECT id, name, avatar FROM "User" WHERE name ILIKE '%bhola%'`;
  console.log('Bhola avatars:', users);
}

main().catch(console.error);
