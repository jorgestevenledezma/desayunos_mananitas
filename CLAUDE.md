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

## Flujo obligatorio al modificar productos

```bash
# Después de cualquier cambio en products.js o fotos:
node generate.js
```

Esto regenera todas las páginas individuales y actualiza `js/photos-map.js`. **Nunca editar `productos/[id]/index.html` directamente** — se sobreescribe con `generate.js`.

## Estructura de un producto en products.js

```javascript
{
  id: 'slug-unico',          // coincide exactamente con la carpeta productos/[id]/
  active: true,
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

### Ediciones 2026 existentes

| Edición | Sección | Fecha | Paleta |
|---|---|---|---|
| Día de la Madre · Un Jardín Para Ella | `#dia-madre` | 10 mayo | Rosa floral (#c4507a) |
| Día del Padre · Papá es mi Campeón | `#dia-padre` | 21 junio | Navy/verde/dorado (#1a3a5c) |

### Productos Día del Padre (sin fotos aún — gradientes)
- `el-numero-10` ($100k) — gradiente azul navy
- `legado-de-campeon` ($170k) — gradiente verde oscuro
- `la-copa-del-honor` ($230k) — gradiente dorado

## Convenciones CSS

- Variables en `css/base.css` — usar siempre `var(--pink-deep)` etc., nunca hex directos en secciones generales
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
