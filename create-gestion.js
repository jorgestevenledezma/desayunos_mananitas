/**
 * DESAYUNOS MAÑANITAS — Genera hoja de gestión de negocio
 * Uso: node create-gestion.js
 * Genera: gestion_mananitas.xlsx  → sube a Google Sheets
 */

const XLSX     = require('./node_modules/xlsx');
const PRODUCTS = require('./js/products.js');

const wb = XLSX.utils.book_new();
const MAX_ROWS = 1000; // Filas con fórmulas pre-cargadas

// ─────────────────────────────────────────────
// PESTAÑA 1: PEDIDOS
// Columnas:
// A=Fecha  B=Cliente  C=Teléfono  D=Zona  E=Dirección
// F=Producto  G=Precio(auto)  H=Domicilio  I=Total(auto)
// J=Método de Pago  K=Estado  L=Notas
// ─────────────────────────────────────────────
const pedidosRows = [
  ['Fecha', 'Cliente', 'Teléfono', 'Zona', 'Dirección',
   'Producto', 'Precio', 'Domicilio', 'Total',
   'Método de Pago', 'Estado', 'Notas']
];

// Fila de ejemplo (fila 2)
pedidosRows.push([
  '13/04/2026', 'María López', '3001234567', 'Cali',
  'Calle 5 # 10-20', 'Brunch Clasicc',
  '=IF(F2="","",VLOOKUP(F2,Productos!$A:$C,3,FALSE))',
  10000,
  '=IF(G2="","",G2+H2)',
  'Nequi', 'Entregado', 'Sin observaciones'
]);

// Filas 3..MAX_ROWS con fórmulas listas
for (let r = 3; r <= MAX_ROWS; r++) {
  pedidosRows.push([
    '', '', '', '', '', '',
    `=IF(F${r}="","",VLOOKUP(F${r},Productos!$A:$C,3,FALSE))`,
    '',
    `=IF(G${r}="","",G${r}+H${r})`,
    '', '', ''
  ]);
}

const wsPedidos = XLSX.utils.aoa_to_sheet(pedidosRows);
wsPedidos['!cols'] = [
  { wch: 14 }, // Fecha
  { wch: 22 }, // Cliente
  { wch: 14 }, // Teléfono
  { wch: 16 }, // Zona
  { wch: 30 }, // Dirección
  { wch: 28 }, // Producto ← escribe aquí
  { wch: 14 }, // Precio   ← se llena solo
  { wch: 12 }, // Domicilio
  { wch: 14 }, // Total    ← se calcula solo
  { wch: 18 }, // Método de Pago
  { wch: 14 }, // Estado
  { wch: 30 }, // Notas
];

XLSX.utils.book_append_sheet(wb, wsPedidos, 'Pedidos');

// ─────────────────────────────────────────────
// PESTAÑA 2: CLIENTES
// A=Nombre  B=Teléfono  C=Zona  D=Dirección
// E=Primer Pedido  F=Cant. Pedidos(auto)  G=Total Gastado(auto)  H=Notas
// ─────────────────────────────────────────────
const clientesRows = [
  ['Nombre', 'Teléfono', 'Zona', 'Dirección',
   'Primer Pedido', 'Cantidad Pedidos', 'Total Gastado', 'Notas']
];

// Filas 2..500 con fórmulas automáticas
for (let r = 2; r <= 500; r++) {
  clientesRows.push([
    '', '', '', '', '',
    // Cuenta cuántas veces aparece este cliente en Pedidos columna B
    `=IF(A${r}="","",COUNTIF(Pedidos!$B:$B,A${r}))`,
    // Suma el Total (col I) de todos sus pedidos entregados
    `=IF(A${r}="","",SUMIFS(Pedidos!$I:$I,Pedidos!$B:$B,A${r},Pedidos!$K:$K,"Entregado"))`,
    ''
  ]);
}

const wsClientes = XLSX.utils.aoa_to_sheet(clientesRows);
wsClientes['!cols'] = [
  { wch: 24 }, // Nombre
  { wch: 14 }, // Teléfono
  { wch: 16 }, // Zona
  { wch: 30 }, // Dirección
  { wch: 16 }, // Primer Pedido
  { wch: 18 }, // Cantidad Pedidos ← automático
  { wch: 18 }, // Total Gastado    ← automático
  { wch: 35 }, // Notas
];

XLSX.utils.book_append_sheet(wb, wsClientes, 'Clientes');

// ─────────────────────────────────────────────
// PESTAÑA 3: PRODUCTOS
// A=Nombre  B=Categoría  C=Precio  D=Activo
// (VLOOKUP en Pedidos busca en col A y trae col C)
// ─────────────────────────────────────────────
const catMap = { clasico: 'Clásico', especial: 'Especial', premium: 'Premium' };

const productosData = [
  ['Nombre', 'Categoría', 'Precio', 'Activo'],
  ...PRODUCTS.map(p => [
    p.name,
    catMap[p.category] || p.category,
    p.price,
    p.active === false ? 'NO' : 'SI',
  ])
];

const wsProductos = XLSX.utils.aoa_to_sheet(productosData);
wsProductos['!cols'] = [
  { wch: 30 }, // Nombre
  { wch: 12 }, // Categoría
  { wch: 12 }, // Precio
  { wch: 8  }, // Activo
];

XLSX.utils.book_append_sheet(wb, wsProductos, 'Productos');

// ─────────────────────────────────────────────
// PESTAÑA 4: RESUMEN
// ─────────────────────────────────────────────
const resumenData = [
  ['RESUMEN DEL NEGOCIO', ''],
  ['', ''],
  ['Total pedidos registrados',        '=COUNTA(Pedidos!B2:B10000)'],
  ['Pedidos entregados',               '=COUNTIF(Pedidos!K2:K10000,"Entregado")'],
  ['Pedidos pendientes',               '=COUNTIF(Pedidos!K2:K10000,"Pendiente")'],
  ['Pedidos confirmados',              '=COUNTIF(Pedidos!K2:K10000,"Confirmado")'],
  ['Pedidos cancelados',               '=COUNTIF(Pedidos!K2:K10000,"Cancelado")'],
  ['', ''],
  ['Ingresos brutos (entregados)',      '=SUMIF(Pedidos!K2:K10000,"Entregado",Pedidos!G2:G10000)'],
  ['Total domicilios cobrados',         '=SUMIF(Pedidos!K2:K10000,"Entregado",Pedidos!H2:H10000)'],
  ['Ingresos totales (con domicilio)',  '=SUMIF(Pedidos!K2:K10000,"Entregado",Pedidos!I2:I10000)'],
  ['', ''],
  ['Clientes registrados',             '=COUNTA(Clientes!A2:A10000)'],
  ['', ''],
  ['Producto más vendido',             '=INDEX(Pedidos!F2:F10000,MATCH(MAX(COUNTIF(Pedidos!F2:F10000,Pedidos!F2:F10000)),COUNTIF(Pedidos!F2:F10000,Pedidos!F2:F10000),0))'],
  ['', ''],
  ['Pagos por Nequi',                  '=SUMIF(Pedidos!J2:J10000,"Nequi",Pedidos!I2:I10000)'],
  ['Pagos por Transferencia Bancolombia', '=SUMIF(Pedidos!J2:J10000,"Transferencia",Pedidos!I2:I10000)'],
];

const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
wsResumen['!cols'] = [{ wch: 38 }, { wch: 20 }];
XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

// ─────────────────────────────────────────────
// PESTAÑA 5: REFERENCIA (listas desplegables)
// ─────────────────────────────────────────────
const refData = [
  ['Estado',      'Método de Pago', 'Zona',             'Productos (para validación)'],
  ['Pendiente',   'Nequi',          'Cali',             ...PRODUCTS.map(p => p.name)],
  ['Confirmado',  'Daviplata',      'Jamundí'],
  ['Entregado',   'Efectivo',       'Ciudad del Campo'],
  ['Cancelado',   'Transferencia',  'Yumbo'],
];

// Aplanar: cada producto en su propia fila en col D
const refRows = [
  ['Estado', 'Método de Pago', 'Zona', 'Productos (para validación)'],
  ['Pendiente',   'Nequi',          'Cali',             ''],
  ['Confirmado',  'Transferencia',  'Jamundí',          ''],
  ['Entregado',   '',               'Ciudad del Campo', ''],
  ['Cancelado',   '',               'Yumbo',            ''],
];
PRODUCTS.forEach((p, i) => {
  if (refRows[i + 1]) {
    refRows[i + 1][3] = p.name;
  } else {
    refRows.push(['', '', '', p.name]);
  }
});

const wsRef = XLSX.utils.aoa_to_sheet(refRows);
wsRef['!cols'] = [{ wch: 14 }, { wch: 18 }, { wch: 20 }, { wch: 32 }];
XLSX.utils.book_append_sheet(wb, wsRef, 'Referencia');

// ─────────────────────────────────────────────
// Guardar
// ─────────────────────────────────────────────
const file = 'gestion_mananitas.xlsx';
XLSX.writeFile(wb, file);

console.log(`\n✅ Archivo generado: ${file}`);
console.log(`\n📋 Cómo funciona:`);
console.log(`   • En Pedidos, escribe el nombre del producto en columna F`);
console.log(`     → el Precio (col G) se llena solo`);
console.log(`     → el Total (col I) se calcula solo`);
console.log(`   • En Clientes, escribe el nombre (col A)`);
console.log(`     → Cantidad Pedidos y Total Gastado se calculan solos`);
console.log(`\n🚀 Para subir a Google Sheets:`);
console.log(`   1. sheets.google.com → Archivo → Importar → Subir`);
console.log(`   2. Selecciona: "Reemplazar hoja de cálculo"`);
console.log(`   3. Configura listas desplegables en Pedidos:`);
console.log(`      - Col F (Producto): datos de Referencia!D2:D24`);
console.log(`      - Col J (Método):   datos de Referencia!B2:B5`);
console.log(`      - Col K (Estado):   datos de Referencia!A2:A5`);
console.log(`      - Col D (Zona):     datos de Referencia!C2:C5\n`);
