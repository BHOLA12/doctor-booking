const sharp = require('sharp');
const path = require('path');

async function inspect() {
  const logoPath = path.join('C:', 'Users', 'kashy', '.gemini', 'antigravity', 'brain', 'a7511961-df30-4cb2-bc02-d7a048b31612', 'clinikbook_elevated_logo_1780203926325.png');
  const metadata = await sharp(logoPath).metadata();
  console.log('New Logo Metadata:', metadata);
}

inspect().catch(err => console.error(err));
