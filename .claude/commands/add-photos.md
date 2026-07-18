# Integrar fotos a un producto

Usa este flujo cuando llegan fotos nuevas para un producto que actualmente usa gradiente.

## Paso 1 — Confirma el producto

Dime el **nombre o ID del producto** al que llegaron las fotos.
Voy a verificar que las fotos estén en `productos/[id]/img/`.

## Paso 2 — Revisar las fotos

```bash
ls productos/[id]/img/
```

Las fotos se ordenan alfabéticamente. La **primera en orden** será la foto principal (hero y thumbnail).
Si el orden no es el correcto, renombrar las fotos: `01.jpeg`, `02.jpeg`, etc.

## Paso 3 — Regenerar la página individual

```bash
node generate.js
```

La página `productos/[id]/index.html` se actualiza automáticamente con:
- Hero con foto real de fondo
- Galería interactiva con thumbnails
- Lightbox al hacer clic
- Preload de la imagen LCP

## Paso 4 — Actualizar la tarjeta en el home (si aplica)

Si el producto tiene una tarjeta hardcodeada en `index.html` (ediciones especiales), cambiar el bloque visual de gradiente a foto real.

**Antes (gradiente):**
```html
<div class="card-visual">
  <div class="card-gradient" style="background: linear-gradient(...)"></div>
  <div class="card-emoji">⚽</div>
</div>
```

**Después (con foto):**
```html
<div class="card-visual">
  <img src="productos/[id]/img/[primera-foto]" class="card-photo" alt="[Nombre]" loading="lazy">
  <div class="card-photo-overlay"></div>
  <div class="card-emoji card-emoji--photo">⚽</div>
</div>
```

## Paso 5 — Verificar photos-map.js

Después de `node generate.js`, revisar que `js/photos-map.js` incluya la foto del producto:

```bash
grep '"[id]"' js/photos-map.js
```

Debe mostrar algo como: `"[id]": "productos/[id]/img/[foto]"`

Esto hace que la foto también aparezca en el catálogo general.

## Paso 6 — Publicar

Hacer commit con los archivos modificados y push a GitHub.
Los archivos que cambian típicamente:
- `js/photos-map.js`
- `productos/[id]/index.html`
- `index.html` (si se actualizó la card del home)
- Las fotos nuevas en `productos/[id]/img/`
