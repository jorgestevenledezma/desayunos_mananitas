/**
 * DESAYUNOS MAÑANITAS — Lógica de páginas de producto
 */

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll progress bar ──────────────────────────────────────
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.prepend(progressBar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrolled / total * 100) + '%';
  }, { passive: true });

  // ── Intersection Observer para animaciones ───────────────────
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Delay escalonado para listas
        if (el.tagName === 'LI') {
          const siblings = el.parentElement.querySelectorAll('li');
          const idx = Array.from(siblings).indexOf(el);
          setTimeout(() => el.classList.add('visible'), idx * 80);
        } else {
          el.classList.add('visible');
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(
    '.product-includes-list li, .product-decoration-box, .product-cta-panel, .related-card'
  ).forEach(el => observer.observe(el));

  // ── Navbar scroll ────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  // ── Botón copiar URL ─────────────────────────────────────────
  const copyBtn = document.getElementById('shareCopyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const orig = copyBtn.innerHTML;
        copyBtn.innerHTML = '✓ ¡Copiado!';
        copyBtn.style.background = '#25D366';
        copyBtn.style.color = 'white';
        setTimeout(() => {
          copyBtn.innerHTML = orig;
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2000);
      });
    });
  }

  // ── Confetti de corazones al cargar ─────────────────────────
  const confettiColors = ['#e8829e', '#c4507a', '#c9a96e', '#f48fb1', '#ffffff'];
  const confettiSymbols = ['♥', '✦', '✿', '★', '♡'];
  const count = 20;

  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const el = document.createElement('span');
      el.className = 'confetti-piece';
      el.textContent = confettiSymbols[Math.floor(Math.random() * confettiSymbols.length)];
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        color: ${confettiColors[Math.floor(Math.random() * confettiColors.length)]};
        font-size: ${10 + Math.random() * 16}px;
        animation-duration: ${2 + Math.random() * 3}s;
        animation-delay: ${Math.random() * 1.5}s;
        border-radius: 0;
        background: none;
        width: auto;
        height: auto;
      `;
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }, i * 80);
  }

  // ── Mobile toggle ────────────────────────────────────────────
  const toggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggle.classList.toggle('active');
    });
  }

  // ── Galería integrada en hero ────────────────────────────────
  const photos = window.GALLERY_PHOTOS || [];
  if (photos.length === 0) return;

  const heroBg    = document.getElementById('heroBg');
  const heroIdx   = document.getElementById('heroIdx');
  const stripThumbs = document.querySelectorAll('.strip-thumb');
  const lightbox  = document.getElementById('galleryLightbox');
  const lbImg     = document.getElementById('lightboxImg');
  const lbOverlay = document.getElementById('lightboxOverlay');
  const lbClose   = document.getElementById('lightboxClose');
  const lbPrev    = document.getElementById('lightboxPrev');
  const lbNext    = document.getElementById('lightboxNext');
  const heroPrev  = document.getElementById('heroPrev');
  const heroNext  = document.getElementById('heroNext');

  let current = 0;

  function goTo(idx) {
    current = (idx + photos.length) % photos.length;
    // Cambia fondo del hero con fade
    if (heroBg) {
      heroBg.style.opacity = '0';
      setTimeout(() => {
        heroBg.style.backgroundImage = `url('${photos[current]}')`;
        heroBg.style.opacity = '1';
      }, 200);
    }
    if (heroIdx)  heroIdx.textContent = current + 1;
    if (lbImg)    lbImg.src = photos[current];
    stripThumbs.forEach((t, i) => {
      t.classList.toggle('active', i === current);
      if (i === current) t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  }

  // Añadir transición al fondo
  if (heroBg) heroBg.style.transition = 'opacity 0.2s ease, transform 6s ease';

  // Strip de miniaturas
  stripThumbs.forEach(t => t.addEventListener('click', () => goTo(+t.dataset.idx)));

  // Flechas del hero
  heroPrev && heroPrev.addEventListener('click', () => goTo(current - 1));
  heroNext && heroNext.addEventListener('click', () => goTo(current + 1));

  // Clic en hero → abre lightbox
  const hero = document.getElementById('productHero');
  hero && hero.addEventListener('click', e => {
    if (e.target.closest('.hero-arrow, .product-breadcrumb, .btn-wa-hero, .strip-thumb')) return;
    if (lightbox) {
      lbImg.src = photos[current];
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  // Cerrar lightbox
  function closeLightbox() {
    lightbox && lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  lbClose   && lbClose.addEventListener('click', closeLightbox);
  lbOverlay && lbOverlay.addEventListener('click', closeLightbox);
  lbPrev    && lbPrev.addEventListener('click', () => goTo(current - 1));
  lbNext    && lbNext.addEventListener('click', () => goTo(current + 1));

  // Teclado
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
    if (e.key === 'Escape')     closeLightbox();
  });

  // Swipe táctil
  function addSwipe(el, onLeft, onRight) {
    let sx = 0;
    el.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    el.addEventListener('touchend',   e => {
      const d = sx - e.changedTouches[0].clientX;
      if (Math.abs(d) > 50) d > 0 ? onLeft() : onRight();
    }, { passive: true });
  }
  hero     && addSwipe(hero,     () => goTo(current + 1), () => goTo(current - 1));
  lightbox && addSwipe(lightbox, () => goTo(current + 1), () => goTo(current - 1));

  // Efecto zoom Ken Burns al cargar
  heroBg && setTimeout(() => heroBg.classList.add('zooming'), 100);

});
