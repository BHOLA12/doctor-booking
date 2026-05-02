require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const users = await sql`SELECT name, avatar FROM "User" WHERE id = 'cmocngdbe000gb4lcfv5omo06'`;
  console.log('Avatar:', users);
}

main().catch(console.error);
