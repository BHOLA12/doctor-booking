require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const users = await sql`SELECT avatar FROM "User" WHERE name = 'bhola '`;
  console.log(JSON.stringify(users[0].avatar));
}

main().catch(console.error);
