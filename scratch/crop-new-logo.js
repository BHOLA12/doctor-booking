const sharp = require('sharp');
const path = require('path');

async function crop() {
  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
  const emblemPath = path.join(__dirname, '..', 'public', 'logo-emblem.png');
  const faviconPath = path.join(__dirname, '..', 'src', 'app', 'icon.png');

  // Let's first trim the white background to get the bounding box of the logo elements
  const trimmed = await sharp(logoPath).trim({ background: '#FFFFFF', threshold: 10 }).toBuffer({ resolveWithObject: true });
  console.log('Trimmed Info:', trimmed.info);

  // The trimmed info contains the width and height of the bounding box
  // The medical cross symbol occupies the top section of the trimmed image
  // Let's crop the top section (roughly the top 60% of the trimmed height)
  // And expand it with a white background to make it a perfect square
  const symbolHeight = Math.round(trimmed.info.height * 0.60);
  
  await sharp(trimmed.data)
    .extract({ left: 0, top: 0, width: trimmed.info.width, height: symbolHeight })
    .trim({ background: '#FFFFFF', threshold: 10 }) // trim extra space
    .extend({
      top: 30,
      bottom: 30,
      left: 30,
      right: 30,
      background: '#FFFFFF'
    })
    .resize(256, 256)
    .toFile(emblemPath);

  console.log('✅ Created public/logo-emblem.png');

  // Create favicon (transparent/white background)
  await sharp(trimmed.data)
    .extract({ left: 0, top: 0, width: trimmed.info.width, height: symbolHeight })
    .trim({ background: '#FFFFFF', threshold: 10 })
    .extend({
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
      background: '#FFFFFF'
    })
    .resize(128, 128)
    .toFile(faviconPath);

  console.log('✅ Created src/app/icon.png (Favicon)');
}

crop().catch(err => console.error(err));
