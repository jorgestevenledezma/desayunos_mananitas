/**
 * DESAYUNOS MAÑANITAS — Exportar productos a Excel
 * Uso: node export-excel.js
 * Genera: productos_2026.xlsx
 */

const XLSX     = require('./node_modules/xlsx');
const PRODUCTS = require('./js/products.js');

// ── Preparar filas ────────────────────────────────────────────
const rows = PRODUCTS.map(p => ({
  'ID (no cambiar)'   : p.id,
  'Activo'            : p.active === false ? 'NO' : 'SI',
  'Nombre'            : p.name,
  'Precio'            : p.price,
  'Precio Alt'        : p.priceAlt || '',
  'Nota precio alt'   : p.priceAltLabel || '',
  'Categoría'         : p.category,
  'Badge'             : p.badge || '',
  'Emoji'             : p.emoji,
  'Nota'              : p.note,
  'Incluye 1'         : p.includes[0] || '',
  'Incluye 2'         : p.includes[1] || '',
  'Incluye 3'         : p.includes[2] || '',
  'Incluye 4'         : p.includes[3] || '',
  'Incluye 5'         : p.includes[4] || '',
  'Incluye 6'         : p.includes[5] || '',
  'Incluye 7'         : p.includes[6] || '',
  'Decoración'        : p.decoration,
  'Gradiente'         : p.gradient,
}));

// ── Crear libro ───────────────────────────────────────────────
const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(rows);

// Anchos de columna
ws['!cols'] = [
  { wch: 32 },  // ID
  { wch: 8  },  // Activo
  { wch: 28 },  // Nombre
  { wch: 12 },  // Precio
  { wch: 12 },  // Precio Alt
  { wch: 20 },  // Nota precio alt
  { wch: 12 },  // Categoría
  { wch: 20 },  // Badge
  { wch: 8  },  // Emoji
  { wch: 45 },  // Nota
  { wch: 50 },  // Incluye 1-7
  { wch: 50 },
  { wch: 50 },
  { wch: 50 },
  { wch: 50 },
  { wch: 50 },
  { wch: 50 },
  { wch: 60 },  // Decoración
  { wch: 55 },  // Gradiente
];

XLSX.utils.book_append_sheet(wb, ws, 'Productos');

// Hoja de referencia de categorías
const catSheet = XLSX.utils.aoa_to_sheet([
  ['Valor',     'Descripción'],
  ['economico', 'Hasta $120.000'],
  ['medio',     '$120.000 – $230.000'],
  ['premium',   'Más de $230.000'],
]);
catSheet['!cols'] = [{ wch: 12 }, { wch: 24 }];
XLSX.utils.book_append_sheet(wb, catSheet, 'Categorías (ref)');

const file = 'productos_2026.xlsx';
XLSX.writeFile(wb, file);
console.log(`✅ Exportado: ${file}  (${PRODUCTS.length} productos)`);
