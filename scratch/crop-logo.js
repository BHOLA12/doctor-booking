const sharp = require('sharp');
const path = require('path');

async function crop() {
  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
  const outputPath = path.join(__dirname, '..', 'public', 'logo-emblem.png');
  const faviconPath = path.join(__dirname, '..', 'src', 'app', 'icon.png');

  // Crop only the top portion containing the emblem (ignoring text at bottom)
  // Dimensions: 325x294
  // Let's crop from y: 0 to y: 160, and horizontally from x: 50 to x: 275 (width 225)
  // Let's make it a clean square of 200x200
  await sharp(logoPath)
    .extract({ left: 45, top: 5, width: 235, height: 160 })
    .extend({
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
      background: { r: 15, g: 23, b: 42, alpha: 1 } // slate-900 / black background
    })
    .resize(256, 256)
    .toFile(outputPath);

  console.log('✅ Created public/logo-emblem.png');

  // For the favicon, let's output a square transparent or dark icon
  await sharp(logoPath)
    .extract({ left: 45, top: 5, width: 235, height: 160 })
    .extend({
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
      background: { r: 15, g: 23, b: 42, alpha: 1 } // matches slate-950 container
    })
    .resize(128, 128)
    .toFile(faviconPath);

  console.log('✅ Created src/app/icon.png');
}

crop().catch(err => console.error(err));
