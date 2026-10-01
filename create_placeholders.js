const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Generate aesthetic SVGs as placeholder images
const placeholders = [
  {
    name: 'polaroid_cat.svg',
    title: 'Miko / Si Kucing',
    subtitle: 'Foto Si Meong Lucu',
    emoji: '🐱',
    color1: '#ffccd5',
    color2: '#ffb3c1'
  },
  {
    name: 'polaroid_ribbon.svg',
    title: 'Aesthetic Hair Ribbon',
    subtitle: 'Foto Alika Favorit',
    emoji: '🎀',
    color1: '#f8edeb',
    color2: '#fcd5ce'
  },
  {
    name: 'polaroid_cafe.svg',
    title: 'Kencan Pertama di Cafe',
    subtitle: '14 Februari 2024',
    emoji: '☕',
    color1: '#fae1dd',
    color2: '#fec5bb'
  },
  {
    name: 'polaroid_flower.svg',
    title: 'Bunga Untuk Alika',
    subtitle: 'Mawar & Tulip Pink',
    emoji: '💐',
    color1: '#ffe5ec',
    color2: '#ffc2d1'
  },
  {
    name: 'album_cover.svg',
    title: 'Surat Hati',
    subtitle: 'Devano',
    emoji: '💌',
    color1: '#f43f5e',
    color2: '#fb7185'
  },
  {
    name: 'polaroid_beach.svg',
    title: 'Senja di Pantai',
    subtitle: 'Momen Berdua',
    emoji: '🌅',
    color1: '#fed7aa',
    color2: '#fda4af'
  }
];

placeholders.forEach(item => {
  const svg = `<svg width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${item.name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${item.color1}"/>
      <stop offset="100%" stop-color="${item.color2}"/>
    </linearGradient>
    <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <rect width="600" height="600" fill="url(#bg-${item.name})"/>
  <circle cx="300" cy="240" r="140" fill="#ffffff" opacity="0.35" filter="url(#soft-glow)"/>
  <text x="300" y="270" font-size="110" text-anchor="middle" font-family="'Segoe UI Emoji', sans-serif">${item.emoji}</text>
  <text x="300" y="380" font-size="28" font-weight="bold" fill="#5c2638" text-anchor="middle" font-family="system-ui, sans-serif">${item.title}</text>
  <text x="300" y="420" font-size="18" fill="#8a4b60" text-anchor="middle" font-family="system-ui, sans-serif">${item.subtitle}</text>
  <rect x="220" y="460" width="160" height="34" rx="17" fill="#ffffff" opacity="0.6"/>
  <text x="300" y="483" font-size="13" font-weight="600" fill="#db2777" text-anchor="middle" font-family="system-ui, sans-serif">✨ Ganti Foto Disini</text>
</svg>`;
  fs.writeFileSync(path.join(targetDir, item.name), svg, 'utf-8');
});

console.log('Placeholders created successfully.');
