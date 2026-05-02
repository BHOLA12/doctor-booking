require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const badUrl = 'https://images.unsplash.com/photo-1594824436998-d40b243ea4f2?auto=format&fit=crop&q=80&w=300&h=300';
  const goodUrl = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300';

  const result = await sql`UPDATE "User" SET avatar = ${goodUrl} WHERE avatar = ${badUrl}`;
  console.log(`Updated avatars. Rows affected:`, result.length);
}

main().catch(console.error);
