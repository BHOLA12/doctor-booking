require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

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

  // We will use 5 local avatars for men and 5 for women
  console.log("Downloading local avatars...");
  for (let i = 1; i <= 5; i++) {
    const womenUrl = `https://randomuser.me/api/portraits/women/${i + 10}.jpg`; // +10 to get some good ones
    const menUrl = `https://randomuser.me/api/portraits/men/${i + 20}.jpg`;
    
    await downloadImage(womenUrl, path.join(avatarsDir, `women-${i}.jpg`));
    await downloadImage(menUrl, path.join(avatarsDir, `men-${i}.jpg`));
  }
  console.log("Downloaded 10 avatars to public/avatars/");

  const doctors = await sql`SELECT id, name FROM "User" WHERE role = 'DOCTOR'`;
  
  let updatedCount = 0;
  for (const doc of doctors) {
    let name = doc.name.replace(/^dr\.?\s*/i, '').trim();
    const isFemale = isFemaleName(name.split(' ')[0]);
    
    const imgIndex = (name.length % 5) + 1; // 1 to 5
    const gender = isFemale ? 'women' : 'men';
    
    // Relative local path string starting with /
    const avatarUrl = `/avatars/${gender}-${imgIndex}.jpg`;

    await sql`UPDATE "User" SET avatar = ${avatarUrl} WHERE id = ${doc.id}`;
    console.log(`Updated ${doc.name} -> ${avatarUrl}`);
    updatedCount++;
  }

  console.log(`Successfully updated ${updatedCount} avatars to use LOCAL images!`);
}

main().catch(console.error);
