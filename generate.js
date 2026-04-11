/**
 * DESAYUNOS MAÑANITAS — Generador de páginas de producto
 * Uso: node generate.js
 *
 * Lee js/products.js y genera productos/[slug]/index.html por cada producto.
 */

const fs   = require('fs');
const path = require('path');

const PRODUCTS   = require('./js/products.js');
const WA_NUMBER  = '573045236602';
const BASE_URL   = 'https://www.desayunosmananitas.com';
const ROOT       = __dirname;
const OUTPUT_DIR = path.join(ROOT, 'productos');

// ── Helpers ──────────────────────────────────────────────────────────────────

const IMG_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

/** Escanea productos/[id]/img/ y devuelve los nombres de archivo ordenados */
function scanPhotos(productId) {
  const imgDir = path.join(OUTPUT_DIR, productId, 'img');
  if (!fs.existsSync(imgDir)) return [];
  return fs.readdirSync(imgDir)
    .filter(f => IMG_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .sort()
    .map(f => encodeURIComponent(f).replace(/%20/g, '%20'));
}

function formatPrice(n) {
  return '$' + n.toLocaleString('es-CO');
}

function waLink(product) {
  const text = encodeURIComponent(`Hola, estoy interesado en el ${product.name} y el valor ${formatPrice(product.price)}`);
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
}

function waShareLink(product) {
  const text = encodeURIComponent(
    `¡Mira este increíble desayuno sorpresa! 🎁\n${product.name} por ${formatPrice(product.price)}\n${BASE_URL}/productos/${product.id}/`
  );
  return `https://wa.me/?text=${text}`;
}

function getRelated(product, all) {
  // Prefiere misma categoría, distinto producto
  const sameCat = all.filter(p => p.id !== product.id && p.category === product.category);
  const others  = all.filter(p => p.id !== product.id && p.category !== product.category);
  const pool    = [...sameCat, ...others];
  // Shuffle determinístico basado en id
  const seed = product.id.charCodeAt(0);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = (seed * (i + 1)) % (i + 1);
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3);
}

// ── Template HTML ────────────────────────────────────────────────────────────

function buildHTML(product, related, photos) {
  const descText = product.includes.slice(0, 3).join(', ');
  const canonicalUrl = `${BASE_URL}/productos/${product.id}/`;

  const includesHTML = product.includes.map(item =>
    `<li><span class="item-icon">✦</span>${item}</li>`
  ).join('\n        ');

  const hasPhotos = photos.length > 0;

  // ── Hero: con foto real o con gradiente ──────────────────────
  const heroHTML = hasPhotos ? `
<section class="product-hero product-hero--photo" id="productHero">
  <div class="hero-photo-bg" id="heroBg" style="background-image:url('img/${photos[0]}')"></div>
  <div class="hero-photo-overlay"></div>

  <div class="product-breadcrumb">
    <a href="../../#catalogo">← Volver al catálogo</a>
  </div>

  <div class="hero-photo-content">
    ${product.badge ? `<div class="product-hero-badge">${product.badge}</div>` : ''}
    <h1 class="product-hero-name">${product.name}</h1>
    <div class="product-hero-price-wrap">
      <span class="product-hero-price">${formatPrice(product.price)}</span>
      <span class="product-hero-price-note">+ domicilio</span>
    </div>
    ${product.priceAlt ? `<p class="product-hero-price-alt">Sin libro de citas: ${formatPrice(product.priceAlt)}</p>` : ''}
    <a href="${waLink(product)}" class="btn-wa-hero" target="_blank" rel="noopener">
      💬 Pedir por WhatsApp
    </a>
  </div>
</section>` :

`<section class="product-hero product-hero--gradient">
  <div class="product-hero-bg" style="background:${product.gradient};background-size:400% 400%;"></div>
  <div class="hero-bubble"></div><div class="hero-bubble"></div>
  <div class="hero-bubble"></div><div class="hero-bubble"></div>
  <div class="hero-bubble"></div>
  <div class="product-breadcrumb">
    <a href="../../#catalogo">← Volver al catálogo</a>
  </div>
  <div class="product-hero-emoji">${product.emoji}</div>
  <div class="product-hero-card">
    ${product.badge ? `<div class="product-hero-badge">${product.badge}</div>` : ''}
    <h1 class="product-hero-name">${product.name}</h1>
    <div class="product-hero-price-wrap">
      <span class="product-hero-price">${formatPrice(product.price)}</span>
      <span class="product-hero-price-note">+ domicilio</span>
    </div>
    ${product.priceAlt ? `<p class="product-hero-price-alt">Sin libro de citas: ${formatPrice(product.priceAlt)}</p>` : ''}
  </div>
</section>`;

  // ── Lightbox (siempre presente si hay fotos) ─────────────────
  const lightboxHTML = hasPhotos ? `
<div class="gallery-lightbox" id="galleryLightbox">
  <div class="lightbox-overlay" id="lightboxOverlay"></div>
  <div class="lightbox-content">
    <button class="lightbox-close" id="lightboxClose">✕</button>
    <img src="" alt="${product.name}" class="lightbox-img" id="lightboxImg">
    ${photos.length > 1 ? `
    <button class="lightbox-nav lightbox-prev" id="lightboxPrev">‹</button>
    <button class="lightbox-nav lightbox-next" id="lightboxNext">›</button>` : ''}
  </div>
</div>
<script>
  window.GALLERY_PHOTOS = ${JSON.stringify(photos.map(p => `img/${p}`))};
  window.GALLERY_NAME   = "${product.name}";
</script>` : '';

  // ── Galería en el cuerpo de la página ───────────────────────
  const galleryHTML = hasPhotos ? `
<section class="product-gallery">
  <div class="gallery-container">
    <div class="gallery-header">
      <div class="gallery-label">Fotografías</div>
      <h2 class="gallery-title">Así llega tu desayuno</h2>
    </div>

    <div class="gallery-main" id="galleryMain">
      <img src="img/${photos[0]}" alt="${product.name}" class="gallery-main-img" id="galleryMainImg" loading="lazy">
      ${photos.length > 1 ? `
      <button class="gallery-arrow gallery-prev" id="galleryPrev" aria-label="Anterior">‹</button>
      <button class="gallery-arrow gallery-next" id="galleryNext" aria-label="Siguiente">›</button>
      <div class="gallery-counter"><span id="galleryIdx">1</span> / ${photos.length}</div>` : ''}
    </div>

    ${photos.length > 1 ? `
    <div class="gallery-thumbs">
      ${photos.map((p, i) => `
      <button class="gallery-thumb ${i === 0 ? 'active' : ''}" data-idx="${i}" aria-label="Foto ${i + 1}">
        <img src="img/${p}" alt="${product.name} foto ${i + 1}" loading="lazy">
      </button>`).join('')}
    </div>` : ''}
  </div>
</section>` : '';


  const relatedHTML = related.map(r => {
    const previewItems = r.includes.slice(0, 2).join(' · ');
    return `
    <a href="../../productos/${r.id}/" class="related-card fade-related">
      <div class="related-card-visual" style="${r.gradient ? `background: ${r.gradient}` : ''}">
        <span class="related-card-emoji">${r.emoji}</span>
      </div>
      <div class="related-card-body">
        <div class="related-card-name">${r.name}</div>
        <div class="related-card-includes">${previewItems}</div>
        <div class="related-card-footer">
          <span class="related-card-price">${formatPrice(r.price)}</span>
          <span class="related-card-cta">Ver más →</span>
        </div>
      </div>
    </a>`;
  }).join('');

  const noteHTML = product.note
    ? `<div class="product-note">📌 ${product.note}</div>`
    : '';

  const priceAltCardHTML = product.priceAlt
    ? `<div class="product-price-alt">Sin libro de citas: ${formatPrice(product.priceAlt)}</div>`
    : '';

  // Schema.org
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": descText,
    "brand": { "@type": "Brand", "name": "Desayunos Mañanitas" },
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "COP",
      "availability": "https://schema.org/InStock",
      "url": canonicalUrl
    }
  }, null, 2);

  return `<!DOCTYPE html>
<html lang="es-CO">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- SEO -->
<title>${product.name} | Desayunos Mañanitas - Desayunos Sorpresa a Domicilio en Cali</title>
<meta name="description" content="${product.name}: ${descText}. Desde ${formatPrice(product.price)} + domicilio. Desayunos sorpresa a domicilio en Cali, Jamundí y Yumbo. ¡Pide ya por WhatsApp!">
<meta name="robots" content="index, follow">
<link rel="canonical" href="${canonicalUrl}">

<!-- Open Graph -->
<meta property="og:type" content="product">
<meta property="og:title" content="${product.name} | Desayunos Mañanitas">
<meta property="og:description" content="${descText}. Desde ${formatPrice(product.price)} + domicilio. ¡Sorprende a quien más quieres!">
<meta property="og:url" content="${canonicalUrl}">
<meta property="og:image" content="${BASE_URL}/img/logo-horizontal-rosado.png">
<meta property="og:site_name" content="Desayunos Mañanitas">
<meta property="og:locale" content="es_CO">

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${product.name} | Desayunos Mañanitas">
<meta name="twitter:description" content="${descText}. Desde ${formatPrice(product.price)}.">
<meta name="twitter:image" content="${BASE_URL}/img/logo-horizontal-rosado.png">

<!-- Schema.org Product -->
<script type="application/ld+json">
${schema}
</script>

<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-RBQKCWQLMN"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-RBQKCWQLMN');
</script>

<!-- Favicon -->
<link rel="icon" type="image/x-icon" href="../../img/favicon.ico">
<link rel="apple-touch-icon" sizes="60x60" href="../../img/apple-icon-60x60.png">
<meta name="theme-color" content="#c4507a">

<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Quicksand:wght@400;500;600;700&family=Great+Vibes&display=swap" rel="stylesheet">

<!-- CSS -->
<link rel="stylesheet" href="../../css/base.css">
<link rel="stylesheet" href="../../css/components.css">
<link rel="stylesheet" href="../../css/sections.css">
<link rel="stylesheet" href="../../css/responsive.css">
<link rel="stylesheet" href="../../css/product.css">
</head>
<body>

<!-- Scroll progress -->
<div class="scroll-progress" id="scrollProgress"></div>

<!-- NAVBAR -->
<nav class="navbar" id="navbar">
  <div class="nav-inner">
    <a href="../../" aria-label="Inicio - Desayunos Mañanitas">
      <img src="../../img/logo-horizontal-rosado.png" alt="Desayunos Mañanitas" class="nav-logo" width="280" height="65" loading="eager">
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="../../#catalogo">Catálogo</a></li>
      <li><a href="../../#envios">Envíos</a></li>
      <li><a href="../../#nosotros">Nosotros</a></li>
      <li><a href="../../#faq">Preguntas</a></li>
      <li><a href="https://wa.me/${WA_NUMBER}?text=Hola%20%F0%9F%90%B0%20Quiero%20hacer%20un%20pedido" class="nav-cta" target="_blank" rel="noopener">🐰 Pedir Ahora</a></li>
    </ul>
    <button class="mobile-toggle" id="mobileToggle" aria-label="Menú">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

${heroHTML}
${lightboxHTML}

<!-- CONTENIDO PRINCIPAL -->
<section class="product-main">
  <div class="product-main-container">
    <div class="product-main-grid">

      <!-- Columna izquierda: ¿Qué incluye? -->
      <div class="product-left">
        <div class="product-includes-title">¿Qué incluye?</div>
        <div class="product-includes-subtitle">Todo lo que viene en tu pedido</div>
        <ul class="product-includes-list">
          ${includesHTML}
        </ul>
        <div class="product-decoration-box">
          <div class="product-decoration-title">🎀 Decoración especial</div>
          <p class="product-decoration-text">${product.decoration}</p>
        </div>
        ${noteHTML}
      </div>

      <!-- Columna derecha: galería + acción -->
      <div class="product-right">

        ${hasPhotos ? `
        <!-- Galería de fotos -->
        <div class="product-gallery-panel">
          <div class="gallery-main" id="galleryMain">
            <img src="img/${photos[0]}" alt="${product.name}" class="gallery-main-img" id="galleryMainImg" loading="lazy">
            ${photos.length > 1 ? `
            <button class="gallery-arrow gallery-prev" id="galleryPrev" aria-label="Anterior">‹</button>
            <button class="gallery-arrow gallery-next" id="galleryNext" aria-label="Siguiente">›</button>
            <div class="gallery-counter"><span id="galleryIdx">1</span> / ${photos.length}</div>` : ''}
          </div>
          ${photos.length > 1 ? `
          <div class="gallery-thumbs">
            ${photos.map((p, i) => `
            <button class="gallery-thumb ${i === 0 ? 'active' : ''}" data-idx="${i}" aria-label="Foto ${i + 1}">
              <img src="img/${p}" alt="${product.name} foto ${i + 1}" loading="lazy">
            </button>`).join('')}
          </div>` : ''}
        </div>` : ''}

        <!-- Acción: un solo botón + compartir compacto -->
        <div class="product-action-panel">
          <a href="${waLink(product)}" class="btn-wa-product" target="_blank" rel="noopener">
            <span class="wa-icon">💬</span>
            Pedir por WhatsApp
          </a>
          <a href="../../#catalogo" class="btn-back-catalog">
            ← Ver todos los desayunos
          </a>
          <div class="product-share-row">
            <span class="product-share-label">Compartir</span>
            <a href="${waShareLink(product)}" class="share-icon-btn" target="_blank" rel="noopener" title="Compartir por WhatsApp">💬</a>
            <button class="share-icon-btn" id="shareCopyBtn" title="Copiar enlace">🔗</button>
          </div>
        </div>

      </div>

    </div>
  </div>
</section>

<!-- PRODUCTOS RELACIONADOS -->
<section class="product-related">
  <div class="product-related-header">
    <div class="product-related-label">También te puede gustar</div>
    <h2 class="product-related-title">Más desayunos sorpresa</h2>
  </div>
  <div class="product-related-grid">
    ${relatedHTML}
  </div>
</section>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div class="footer-brand">Desayunos Mañanitas</div>
    <p style="font-size:0.88rem; margin-bottom:16px;">Los regalos y desayunos más encantadores de Cali 🐰</p>
    <div class="footer-links">
      <a href="../../#catalogo">Catálogo</a>
      <a href="../../#envios">Envíos</a>
      <a href="../../#nosotros">Nosotros</a>
      <a href="../../#faq">Preguntas</a>
    </div>
    <div class="footer-social">
      <a href="https://wa.me/${WA_NUMBER}" target="_blank" rel="noopener" aria-label="WhatsApp">💬</a>
      <a href="https://www.instagram.com/desayunosmananitasoficial" target="_blank" rel="noopener" aria-label="Instagram">📸</a>
    </div>
    <div class="footer-copy">© ${new Date().getFullYear()} Desayunos Mañanitas · Cali, Valle del Cauca · Tel: (304) 523-6602</div>
  </div>
</footer>

<!-- STICKY CTA MÓVIL -->
<div class="sticky-cta-bar">
  <div class="sticky-price-wrap">
    <span class="sticky-price">${formatPrice(product.price)}</span>
    <span class="sticky-price-note">+ domicilio</span>
  </div>
  <a href="${waLink(product)}" class="sticky-wa-btn" target="_blank" rel="noopener">
    💬 Pedir por WhatsApp
  </a>
</div>

<!-- WhatsApp flotante -->
<a href="https://wa.me/${WA_NUMBER}?text=Hola%20%F0%9F%90%B0%20Quiero%20informaci%C3%B3n" class="whatsapp-float" target="_blank" rel="noopener" aria-label="Chat por WhatsApp">💬</a>

<script src="../../js/product-page.js"></script>
</body>
</html>`;
}

// ── Main ─────────────────────────────────────────────────────────────────────

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

let generated = 0;
const photosMap = {};

PRODUCTS.forEach(product => {
  const dir = path.join(OUTPUT_DIR, product.id);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const photos  = scanPhotos(product.id);
  const related = getRelated(product, PRODUCTS);
  const html    = buildHTML(product, related, photos);
  const file    = path.join(dir, 'index.html');

  fs.writeFileSync(file, html, 'utf8');

  // Guardar primera foto para el mapa del catálogo
  photosMap[product.id] = photos.length > 0
    ? `productos/${product.id}/img/${photos[0]}`
    : null;

  const photoInfo = photos.length > 0 ? ` (${photos.length} foto${photos.length > 1 ? 's' : ''})` : '';
  console.log(`✓ productos/${product.id}/${photoInfo}`);
  generated++;
});

// Generar js/photos-map.js para que catalog.js muestre fotos en el catálogo
const mapContent = `// Generado automáticamente por generate.js — no editar\nvar PHOTOS_MAP = ${JSON.stringify(photosMap, null, 2)};\n`;
fs.writeFileSync(path.join(ROOT, 'js', 'photos-map.js'), mapContent, 'utf8');

console.log(`\n✅ ${generated} páginas generadas en /productos/`);
console.log(`   Para publicar: haz commit y push a GitHub.\n`);
