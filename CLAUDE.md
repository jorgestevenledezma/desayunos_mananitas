# Desayunos Mañanitas — Instrucciones del proyecto

Sitio web estático (HTML/CSS/JS vanilla) para desayunos sorpresa a domicilio en Cali, Colombia. Hosting en GitHub Pages. Sin frameworks, sin bundlers, sin npm install necesario.

## Archivos críticos

| Archivo | Rol |
|---|---|
| `js/products.js` | **Fuente de verdad** — array `PRODUCTS` con todos los productos |
| `generate.js` | Script Node que genera `productos/[id]/index.html` + `js/photos-map.js` |
| `index.html` | Home completo con todas las secciones hardcodeadas |
| `css/sections.css` | Estilos de secciones del home (incluyendo ediciones especiales) |
| `css/components.css` | Estilos de `.product-card`, navbar, badges |
| `llms.txt` | Contexto para LLMs — mantener actualizado con cada cambio |
| `miniaturas.js` | `npm run miniaturas`: crea `productos/[id]/img/thumb/*.webp` (600 px) para catálogo, galería y relacionados |
| `plantillas/edicion-temporada.html` + `css/ediciones.css` | Plantilla y estilos de las ediciones de temporada (fuera del home cuando no hay una activa) |

## Flujo obligatorio al modificar productos

```bash
# Después de cualquier cambio en products.js o fotos:
npm run miniaturas   # solo si cambiaron fotos (requiere `npm install` una vez; usa sharp)
node generate.js
```

Si no se corren las miniaturas, `generate.js` usa la foto original (funciona, pero el catálogo pesa más).

Esto regenera todas las páginas individuales y actualiza `js/photos-map.js`. **Nunca editar `productos/[id]/index.html` directamente** — se sobreescribe con `generate.js`.

## Estructura de un producto en products.js

```javascript
{
  id: 'slug-unico',          // coincide exactamente con la carpeta productos/[id]/
  active: true,
  until: '2026-05-10',       // opcional: después de esa fecha sale del catálogo y su página muestra "edición terminada" 
  name: 'Nombre del Producto',
  price: 100000,             // COP sin puntos ni formato
  emoji: '🎁',
  category: 'padre',         // economico | medio | premium | madre | padre | clasico | especial
  badge: '⚽ Día del Padre', // null si no aplica
  note: 'Nota importante',   // null si no aplica
  photos: [],                // siempre [] — generate.js escanea la carpeta img/
  includes: ['Item 1', 'Item 2'],
  decoration: 'Descripción de la decoración',
  gradient: 'linear-gradient(135deg, #xxx, #yyy)',
}
```

## Estructura de carpeta de producto

```
productos/[id]/
  index.html     ← auto-generado, NO editar
  img/           ← subir fotos aquí (se ordenan alfabéticamente, primera = foto principal)
```

## Ediciones especiales de temporada

Cada edición tiene:
1. **Sección en `index.html`** con ID `#dia-[evento]` — hardcodeada con `.product-card`
2. **Estilos en `css/sections.css`** — clase `.[evento]-section` con paleta propia
3. **Countdown JS** en `index.html` al final del body — se oculta automáticamente tras la fecha
4. **Link en el navbar** apuntando a `#dia-[evento]`
5. **Productos en `js/products.js`** con `category: '[evento]'`
6. **Carpetas** `productos/[id]/img/` para las fotos

**Cuando la edición termina:** los productos con `until` salen solos del catálogo. La sección del home se retira
(en noviembre de 2026 se retiraron madre, padre y amistad; siguen en el historial de git) y se quita el
`<link rel="stylesheet" href="css/ediciones.css">` del `<head>` si ya no hay ninguna activa.

### Ediciones 2026 (todas finalizadas)

| Edición | Sección | Fecha | Paleta |
|---|---|---|---|
| Día de la Madre · Un Jardín Para Ella | `#dia-madre` | 10 mayo | Rosa floral (#c4507a) |
| Día del Padre · Papá es mi Campeón | `#dia-padre` | 21 junio | Navy/verde/dorado (#1a3a5c) |


## Convenciones CSS

- Variables en `css/base.css` — usar siempre `var(--pink-deep)` etc., nunca hex directos en secciones generales
- Contraste: texto blanco solo sobre `--pink-ink`/`--pink-ink-dark` (rosa) o `--wa-green`/`--wa-green-dark` (WhatsApp); `--pink-main` no da contraste para texto
- Mensaje de WhatsApp de cada producto: plantilla con fecha, franja, barrio y mensaje de tarjeta (`waUrl` en `js/catalog.js` y `waLink` en `generate.js` — mantenerlos iguales)
- Catálogo: tarjetas compactas, filtros por presupuesto (`data-filter="min-max"`), 12 visibles y botón "Ver más"
- Tipografías: `Great Vibes` (títulos cursivos), `Playfair Display` (h1/h2), `Quicksand` (cuerpo)
- Border radius: `var(--radius)` = 20px, `var(--radius-sm)` = 12px
- Para ediciones especiales el patrón de la clase de sección es: `.madre-section` o `.padre-section`

## Al terminar cambios importantes

1. Correr `node generate.js` si se tocó `products.js` o se agregaron fotos
2. Actualizar `llms.txt` con los nuevos productos o secciones
3. Hacer commit y push a GitHub para publicar en producción

## Comandos disponibles

- `/add-product` — Agrega un nuevo producto al catálogo completo
- `/new-edition` — Crea una nueva sección de temporada en el home
- `/add-photos` — Integra fotos recién subidas a un producto
