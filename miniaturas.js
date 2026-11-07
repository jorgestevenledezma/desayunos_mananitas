/**
 * DESAYUNOS MAÑANITAS — Miniaturas WebP de las fotos de producto
 * Uso: npm run miniaturas   (requiere `npm install` una vez)
 *
 * Por cada foto en productos/[id]/img/ crea productos/[id]/img/thumb/[nombre].webp
 * (600 px de ancho). generate.js las usa en el catálogo, las miniaturas de la
 * galería y los productos relacionados; si una miniatura no existe, usa la foto original.
 */

const fs    = require('fs');
const path  = require('path');
const sharp = require('sharp');

const OUTPUT_DIR = path.join(__dirname, 'productos');
const IMG_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

async function main() {
  let created = 0, skipped = 0, removed = 0;

  for (const id of fs.readdirSync(OUTPUT_DIR)) {
    const imgDir = path.join(OUTPUT_DIR, id, 'img');
    if (!fs.existsSync(imgDir)) continue;

    const thumbDir = path.join(imgDir, 'thumb');
    const photos = fs.readdirSync(imgDir)
      .filter(f => IMG_EXTENSIONS.includes(path.extname(f).toLowerCase()));
    const expected = new Set(photos.map(f => path.parse(f).name + '.webp'));

    if (photos.length && !fs.existsSync(thumbDir)) fs.mkdirSync(thumbDir);

    for (const f of photos) {
      const src  = path.join(imgDir, f);
      const dest = path.join(thumbDir, path.parse(f).name + '.webp');
      if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= fs.statSync(src).mtimeMs) {
        skipped++;
        continue;
      }
      await sharp(src).rotate().resize({ width: 600, withoutEnlargement: true }).webp({ quality: 72 }).toFile(dest);
      created++;
    }

    // Borra miniaturas de fotos que ya no existen
    if (fs.existsSync(thumbDir)) {
      for (const t of fs.readdirSync(thumbDir)) {
        if (!expected.has(t)) { fs.unlinkSync(path.join(thumbDir, t)); removed++; }
      }
    }
  }

  console.log(`✅ Miniaturas: ${created} creadas, ${skipped} al día, ${removed} borradas.`);
  console.log('   Ahora corre: node generate.js');
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
