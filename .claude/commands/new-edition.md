# Crear nueva edición especial de temporada

Sigue este flujo para agregar una nueva sección de temporada en el home (ej: San Valentín, Día de la Mujer, Navidad).

## Paso 1 — Recopila la información de la edición

Necesito que me des:
- **Nombre del evento** (ej: "San Valentín 2027")
- **Fecha** del evento (ej: 14 de febrero)
- **Subtítulo / nombre de la colección** (ej: "Amor en Flor")
- **Texto de dedicatoria** (frase poética que va bajo el título)
- **Emojis decorativos** flotantes (ej: 🌹 💕 ✨)
- **Paleta de colores** o tema visual (ej: rojo y dorado, azul marino, etc.)
- **Productos de la edición** (nombre, precio, items incluidos, decoración de cada uno)
- **¿Ya hay fotos** de los productos o usamos gradientes por ahora?

## Paso 2 — Definir el ID de la sección

Formato: `dia-[evento]` en minúsculas sin tildes.
Ejemplo: "San Valentín" → `#dia-san-valentin`

## Paso 3 — Agregar productos a js/products.js

Cada producto de la edición lleva `category: '[evento]'` (ej: `category: 'san-valentin'`).
Agregar al final del array, agrupados y con comentario de sección.

## Paso 4 — Crear carpetas de producto

```bash
mkdir -p productos/[id-producto-1]/img
mkdir -p productos/[id-producto-2]/img
# ... por cada producto
```

## Paso 5 — Generar páginas individuales

```bash
node generate.js
```

## Paso 6 — Agregar la sección al home (index.html)

La sección va **antes de `#catalogo`**, después de la edición anterior.
Estructura:

```html
<section class="[evento]-section" id="dia-[evento]" aria-label="...">
  <div class="[evento]-floats" aria-hidden="true">
    <!-- 10 emojis decorativos -->
  </div>
  <div class="[evento]-inner">
    <div class="[evento]-header fade-up">
      <!-- tag edición, título Great Vibes, dedicatoria, countdown -->
    </div>
    <div class="[evento]-products fade-up">
      <!-- product-card por cada producto -->
    </div>
    <div class="[evento]-cta-wrap fade-up">
      <!-- botón WhatsApp -->
    </div>
  </div>
</section>
```

Seguir exactamente el patrón de `.padre-section` (en index.html, líneas ~494-620).

## Paso 7 — Agregar estilos en css/sections.css

Copiar el bloque `/* ===== PAPÁ ES MI CAMPEÓN ===== */` al final de sections.css y adaptar:
- Nombre de clases: `.padre-` → `.[evento]-`
- Colores del `.padre-edition-tag`, `.padre-title-accent`, `.padre-cd-num`, `.padre-cta-btn`
- Gradiente del fondo de `.padre-section`
- Keyframe de la animación flotante

## Paso 8 — Agregar link en el navbar (index.html)

```html
<li><a href="#dia-[evento]" style="color:[color-acento];font-weight:700;">[emoji] [Nombre]</a></li>
```

## Paso 9 — Agregar countdown JS

Al final del body de index.html, copiar el bloque del countdown del Día del Padre y adaptar:
- `target` → nueva fecha
- IDs de los elementos: `[evento]Countdown`, `[e]cd-days`, etc.
- Mensaje cuando llega el día
- Ocultar sección después de la fecha

## Paso 10 — Actualizar llms.txt

Agregar la nueva edición en la sección correspondiente y los nuevos productos.
