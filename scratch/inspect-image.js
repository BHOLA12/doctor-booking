const sharp = require('sharp');
const path = require('path');

async function inspect() {
  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
  const metadata = await sharp(logoPath).metadata();
  console.log('Logo Metadata:', metadata);
}

inspect().catch(err => console.error(err));
