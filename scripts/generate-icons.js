const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateIcons() {
  const iconsDir = path.join(__dirname, '..', 'public', 'icons');
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  const input = path.join(__dirname, '..', 'public', 'images', 'barbie-icon.png');
  console.log('Reading from:', input);

  // 192x192
  await sharp(input).resize(192, 192).toFile(path.join(iconsDir, 'icon-192x192.png'));
  console.log('✓ Created icon-192x192.png');

  // 384x384
  await sharp(input).resize(384, 384).toFile(path.join(iconsDir, 'icon-384x384.png'));
  console.log('✓ Created icon-384x384.png');

  // 512x512
  await sharp(input).resize(512, 512).toFile(path.join(iconsDir, 'icon-512x512.png'));
  console.log('✓ Created icon-512x512.png');

  // 180x180 for Apple touch icon
  await sharp(input).resize(180, 180).toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  console.log('✓ Created apple-touch-icon.png');

  // Maskable 512x512 (with 10% safe margin so rounded icons do not crop edges)
  const innerSize = Math.round(512 * 0.8);
  const padding = Math.round((512 - innerSize) / 2);
  const resizedInner = await sharp(input).resize(innerSize, innerSize).toBuffer();
  
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 253, g: 242, b: 244, alpha: 1 } // #fdf2f4 soft pink
    }
  })
  .composite([{ input: resizedInner, top: padding, left: padding }])
  .png()
  .toFile(path.join(iconsDir, 'maskable-icon-512x512.png'));
  console.log('✓ Created maskable-icon-512x512.png');

  // Maskable 192x192
  const innerSize192 = Math.round(192 * 0.8);
  const padding192 = Math.round((192 - innerSize192) / 2);
  const resizedInner192 = await sharp(input).resize(innerSize192, innerSize192).toBuffer();
  
  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: { r: 253, g: 242, b: 244, alpha: 1 }
    }
  })
  .composite([{ input: resizedInner192, top: padding192, left: padding192 }])
  .png()
  .toFile(path.join(iconsDir, 'maskable-icon-192x192.png'));
  console.log('✓ Created maskable-icon-192x192.png');
}

generateIcons()
  .then(() => console.log('All PWA icons generated successfully!'))
  .catch((err) => {
    console.error('Error generating icons:', err);
    process.exit(1);
  });
