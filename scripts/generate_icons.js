const sharp = require('c:/Users/HP/Desktop/Event App/eventpulse/node_modules/sharp');
const path = require('path');
const fs = require('fs');

const srcImage = 'C:/Users/HP/.gemini/antigravity/brain/9c692197-623c-41ba-b5eb-83e3a0e206b0/media__1772458679743.png';
const outputDir = 'c:/Users/HP/Desktop/Event App/eventpulse/public/icons';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const sizes = [
    { name: 'icon-16x16.png', size: 16 },
    { name: 'icon-24x24.png', size: 24 },
    { name: 'icon-32x32.png', size: 32 },
    { name: 'icon-48x48.png', size: 48 },
    { name: 'icon-64x64.png', size: 64 },
    { name: 'icon-128x128.png', size: 128 },
    { name: 'icon-192x192.png', size: 192 },
    { name: 'icon-256x256.png', size: 256 },
    { name: 'icon-512x512.png', size: 512 },
    { name: 'icon-1024x1024.png', size: 1024 },
    { name: 'apple-touch-icon.png', size: 180 }
];

async function generateIcons() {
    console.log('Generating icons...');
    for (const item of sizes) {
        await sharp(srcImage)
            .resize(item.size, item.size)
            .toFile(path.join(outputDir, item.item ? item.item : item.name));
        console.log(`Generated: ${item.name}`);
    }

    // Also generate favicon.ico (simplified version using 32x32)
    // In a real scenario we might want a multi-layer ICO, but here we just copy/rename or use a simple one.
    // Sharp can't write .ico directly without extra plugins, so we'll just use a PNG as favicon if supported,
    // or we'll just rename one for now.

    console.log('Icon generation complete!');
}

generateIcons().catch(console.error);
