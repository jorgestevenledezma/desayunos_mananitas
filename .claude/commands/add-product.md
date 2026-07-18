# Agregar nuevo producto al catálogo

Sigue este flujo completo para agregar un producto nuevo a Desayunos Mañanitas.

## Paso 1 — Recopila la información del producto

Necesito que me des:
- **Nombre** del producto
- **Precio** (en COP, ej: 150000)
- **Categoría**: economico | medio | premium | madre | padre | clasico | especial
- **Emoji** representativo
- **Lista de items** que incluye (cada item = un string)
- **Decoración** incluida (caja, globos, tarjeta, etc.)
- **Badge** especial (ej: "🌸 Día de la Madre") o ninguno
- **Nota** importante (ej: "La decoración es alusiva según la ocasión") o ninguna
- **Gradient** de fondo si no hay fotos aún (ej: `linear-gradient(135deg, #xxx, #yyy)`)
- ¿Va en una **sección especial del home** (edición de temporada) o solo en el catálogo?

## Paso 2 — Crear el slug (ID)

El slug se genera del nombre en minúsculas, sin tildes, espacios reemplazados por guiones.
Ejemplo: "El Número 10" → `el-numero-10`

## Paso 3 — Agregar a js/products.js

Agregar el objeto al array `PRODUCTS` en la posición apropiada (al final de su categoría o edición).

## Paso 4 — Crear carpeta del producto

```bash
mkdir -p productos/[id]/img
```

## Paso 5 — Generar la página individual

```bash
node generate.js
```

Verifica que aparezca `✓ productos/[id]/` en el output.

## Paso 6 — Si va en sección especial del home

Agregar una `.product-card` hardcodeada en la sección correspondiente de `index.html`.
Seguir el patrón exacto de las tarjetas de Día de la Madre o Día del Padre ya existentes.

## Paso 7 — Actualizar llms.txt

Agregar el producto a la sección correcta del catálogo y a la lista de páginas de producto.

## Paso 8 — Verificar y publicar

Revisar que el HTML generado en `productos/[id]/index.html` se vea correcto, luego hacer commit y push.
