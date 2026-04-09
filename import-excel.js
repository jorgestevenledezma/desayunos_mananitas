/**
 * DESAYUNOS MAÑANITAS — Importar productos desde Excel → products.js
 * Uso: node import-excel.js
 * Lee:  productos_2026.xlsx
 * Actualiza: js/products.js  y  regenera las páginas
 */

const XLSX = require('xlsx');
const fs   = require('fs');
const path = require('path');

const FILE = 'productos_2026.xlsx';

if (!fs.existsSync(FILE)) {
  console.error(`❌ No encuentro el archivo "${FILE}". Primero corre: node export-excel.js`);
  process.exit(1);
}

// ── Leer Excel ────────────────────────────────────────────────
const wb   = XLSX.readFile(FILE);
const ws   = wb.Sheets['Productos'];
const rows = XLSX.utils.sheet_to_json(ws);

if (!rows.length) {
  console.error('❌ La hoja "Productos" está vacía.');
  process.exit(1);
}

// ── Convertir filas a objetos de producto ─────────────────────
function col(row, key) {
  const val = row[key];
  return val !== undefined && val !== null && val !== '' ? String(val).trim() : null;
}

function buildIncludes(row) {
  return [1,2,3,4,5,6,7]
    .map(n => col(row, `Incluye ${n}`))
    .filter(Boolean);
}

const PRODUCTS = rows.map(row => {
  const p = {
    id         : col(row, 'ID (no cambiar)'),
    name       : col(row, 'Nombre'),
    price      : Number(col(row, 'Precio')) || 0,
    emoji      : col(row, 'Emoji') || '🍳',
    category   : col(row, 'Categoría') || 'economico',
    badge      : col(row, 'Badge') || null,
    note       : col(row, 'Nota') || '',
    photos     : [], // las fotos se escanean automáticamente de la carpeta img/
    includes   : buildIncludes(row),
    decoration : col(row, 'Decoración') || '',
    gradient   : col(row, 'Gradiente') || 'linear-gradient(135deg, #fce4ec, #f8bbd0)',
  };

  // Precio alternativo (opcional)
  const priceAlt = col(row, 'Precio Alt');
  if (priceAlt && Number(priceAlt) > 0) {
    p.priceAlt      = Number(priceAlt);
    p.priceAltLabel = col(row, 'Nota precio alt') || '';
  }

  return p;
});

// Validar que no haya IDs duplicados ni vacíos
const ids = PRODUCTS.map(p => p.id);
const missing = PRODUCTS.filter(p => !p.id);
const dupes   = ids.filter((id, i) => ids.indexOf(id) !== i);

if (missing.length) {
  console.error('❌ Hay productos sin ID. Revisa la columna "ID (no cambiar)".');
  process.exit(1);
}
if (dupes.length) {
  console.error(`❌ IDs duplicados: ${dupes.join(', ')}`);
  process.exit(1);
}

// ── Generar js/products.js ────────────────────────────────────
const lines = PRODUCTS.map(p => {
  const extras = p.priceAlt
    ? `\n    priceAlt: ${p.priceAlt},\n    priceAltLabel: '${p.priceAltLabel}',`
    : '';
  const includes = p.includes.map(i => `      '${i.replace(/'/g, "\\'")}'`).join(',\n');
  return `  {
    id: '${p.id}',
    name: '${p.name.replace(/'/g, "\\'")}',
    price: ${p.price},${extras}
    emoji: '${p.emoji}',
    category: '${p.category}',
    badge: ${p.badge ? `'${p.badge.replace(/'/g, "\\'")}'` : 'null'},
    note: '${p.note.replace(/'/g, "\\'")}',
    photos: [],
    includes: [
${includes},
    ],
    decoration: '${p.decoration.replace(/'/g, "\\'")}',
    gradient: '${p.gradient}',
  }`;
}).join(',\n\n');

const output = `/**
 * DESAYUNOS MAÑANITAS — Catálogo de productos
 * Generado automáticamente desde productos_2026.xlsx
 * Para editar: abre el Excel, modifica y corre: node import-excel.js
 */

const PRODUCTS = [
${lines}
];

// Para uso en Node.js (generate.js)
if (typeof module !== 'undefined') module.exports = PRODUCTS;
`;

fs.writeFileSync('./js/products.js', output, 'utf8');
console.log(`✅ js/products.js actualizado — ${PRODUCTS.length} productos`);

// ── Regenerar páginas automáticamente ────────────────────────
console.log('🔄 Regenerando páginas de producto...');
require('./generate.js');
