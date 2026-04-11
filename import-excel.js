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

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .replace(/[^a-z0-9\s-]/g, '')                     // solo letras, números, espacios, guiones
    .trim()
    .replace(/\s+/g, '-')                              // espacios → guión
    .replace(/-+/g, '-');                              // guiones dobles → uno
}

function buildIncludes(row) {
  return [1,2,3,4,5,6,7]
    .map(n => col(row, `Incluye ${n}`))
    .filter(Boolean);
}

const PRODUCTS = rows.map(row => {
  const name = col(row, 'Nombre') || '';
  const p = {
    id         : col(row, 'ID (no cambiar)') || slugify(name),
    name       : name,
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

// Validar IDs — avisar de los auto-generados, fallar solo si hay duplicados o nombre vacío
const ids     = PRODUCTS.map(p => p.id);
const sinNombre = PRODUCTS.filter(p => !p.id);
const dupes     = ids.filter((id, i) => ids.indexOf(id) !== i);
const autoIds   = rows
  .filter(row => !col(row, 'ID (no cambiar)') && col(row, 'Nombre'))
  .map(row => slugify(col(row, 'Nombre')));

if (sinNombre.length) {
  console.error('❌ Hay productos sin nombre ni ID. Completa la columna "Nombre".');
  process.exit(1);
}
if (autoIds.length) {
  console.warn(`⚠️  IDs auto-generados para ${autoIds.length} producto(s) nuevo(s):`);
  autoIds.forEach(id => console.warn(`   → ${id}`));
  console.warn('   Copia estos IDs en la columna "ID (no cambiar)" del Excel para futuras ediciones.');
}
if (dupes.length) {
  console.error(`❌ IDs duplicados: ${dupes.join(', ')}`);
  process.exit(1);
}

// ── Generar js/products.js ────────────────────────────────────
function esc(s) { return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }

const lines = PRODUCTS.map(p => {
  const extras = p.priceAlt
    ? `\n    priceAlt: ${p.priceAlt},\n    priceAltLabel: '${esc(p.priceAltLabel)}',`
    : '';
  const includes = p.includes.map(i => `      '${esc(i)}'`).join(',\n');
  return `  {
    id: '${esc(p.id)}',
    name: '${esc(p.name)}',
    price: ${p.price},${extras}
    emoji: '${esc(p.emoji)}',
    category: '${esc(p.category)}',
    badge: ${p.badge ? `'${esc(p.badge)}'` : 'null'},
    note: '${esc(p.note)}',
    photos: [],
    includes: [
${includes},
    ],
    decoration: '${esc(p.decoration)}',
    gradient: '${esc(p.gradient)}',
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
