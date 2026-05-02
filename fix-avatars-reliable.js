require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

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

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        https.get(response.headers.location, (res) => {
          const file = fs.createWriteStream(filename);
          res.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
      } else if (response.statusCode === 200) {
        const file = fs.createWriteStream(filename);
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      } else {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

function isFemaleName(name) {
  const n = name.toLowerCase();
  return n.match(/(a|i|ee)$/i) || n.includes('kumari') || n.includes('devi') || (n.includes('singh') && n.includes('priya'));
}

async function main() {
  const avatarsDir = path.join(__dirname, 'public', 'avatars');
  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
  }

  // Use reliable generic images instead of downloading unsplash to avoid hotlink/404 issues again
  // Or just use randomuser.me which is guaranteed to work everywhere!
  // Wait, let's just use randomuser.me for now to instantly fix it, it's 100% reliable.
  
  const doctors = await sql`SELECT id, name FROM "User" WHERE role = 'DOCTOR'`;
  
  let updatedCount = 0;
  for (const doc of doctors) {
    let name = doc.name.replace(/^dr\.?\s*/i, '').trim();
    const isFemale = isFemaleName(name.split(' ')[0]);
    
    // Use randomuser.me for 100% reliability
    const imgIndex = (name.length % 50) + 1; // 1 to 50
    const gender = isFemale ? 'women' : 'men';
    const avatarUrl = `https://randomuser.me/api/portraits/${gender}/${imgIndex}.jpg`;

    await sql`UPDATE "User" SET avatar = ${avatarUrl} WHERE id = ${doc.id}`;
    updatedCount++;
  }

  console.log(`Updated ${updatedCount} avatars with reliable randomuser.me URLs`);
}

main().catch(console.error);
