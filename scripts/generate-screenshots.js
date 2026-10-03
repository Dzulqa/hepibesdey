const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateScreenshots() {
  const screenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const heroImage = path.join(__dirname, '..', 'public', 'images', 'alika_hero.jpg');
  const barbieIcon = path.join(__dirname, '..', 'public', 'images', 'barbie-icon.png');

  // 1. Desktop Screenshot: 1280 x 720 (Wide Form Factor)
  // Create a beautiful branded card mockup
  const heroDesktop = await sharp(heroImage)
    .resize(600, 600, { fit: 'cover' })
    .toBuffer();

  const desktopBg = await sharp({
    create: {
      width: 1280,
      height: 720,
      channels: 4,
      background: { r: 253, g: 242, b: 244, alpha: 1 } // #fdf2f4
    }
  })
  .composite([
    {
      input: heroDesktop,
      top: 60,
      left: 620
    }
  ])
  .png()
  .toFile(path.join(screenshotsDir, 'screenshot-desktop.png'));

  console.log('✓ Created screenshot-desktop.png (1280x720)');

  // 2. Mobile Screenshot: 750 x 1334 (Narrow Form Factor)
  const heroMobile = await sharp(heroImage)
    .resize(650, 750, { fit: 'cover' })
    .toBuffer();

  const mobileBg = await sharp({
    create: {
      width: 750,
      height: 1334,
      channels: 4,
      background: { r: 253, g: 242, b: 244, alpha: 1 }
    }
  })
  .composite([
    {
      input: heroMobile,
      top: 150,
      left: 50
    }
  ])
  .png()
  .toFile(path.join(screenshotsDir, 'screenshot-mobile.png'));

  console.log('✓ Created screenshot-mobile.png (750x1334)');
}

generateScreenshots()
  .then(() => console.log('All screenshots generated successfully!'))
  .catch((err) => {
    console.error('Error generating screenshots:', err);
    process.exit(1);
  });
