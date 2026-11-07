// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
const menuToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

function setMenu(open) {
  navLinks.classList.toggle('open', open);
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
}

menuToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));

// Cierra el menú al elegir un enlace o con Escape
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => setMenu(false));
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    setMenu(false);
    menuToggle.focus();
  }
});

// ===== VOLVER ARRIBA =====
const backToTop = document.getElementById('backToTop');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.hidden = window.scrollY < window.innerHeight * 2;
  }, { passive: true });
  backToTop.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== INTERSECTION OBSERVER (fade-up animations) =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== CARRUSEL MÓVIL (features) =====
(function () {
  function initCarousel(gridId, dotsId, itemSelector) {
    var grid = document.getElementById(gridId);
    var dotsWrap = document.getElementById(dotsId);
    if (!grid || !dotsWrap) return;

    function isMobile() { return window.innerWidth < 768; }

    var items = Array.from(grid.querySelectorAll(itemSelector));
    var current = 0;
    var dots = [];

    function buildDots() {
      dotsWrap.innerHTML = '';
      dots = [];
      items.forEach(function (_, i) {
        var d = document.createElement('button');
        d.className = 'dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Ir al elemento ' + (i + 1));
        d.addEventListener('click', function () { goTo(i); });
        dotsWrap.appendChild(d);
        dots.push(d);
      });
    }

    function goTo(idx) {
      current = (idx + items.length) % items.length;
      grid.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
    }

    // Swipe táctil
    var sx = 0;
    grid.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    grid.addEventListener('touchend', function (e) {
      var dx = sx - e.changedTouches[0].clientX;
      if (Math.abs(dx) > 40) goTo(current + (dx > 0 ? 1 : -1));
    }, { passive: true });

    // Auto-avance cada 5s (no se activa si el usuario prefiere menos movimiento).
    // stopAuto() antes de cada inicio evita que los intervalos se acumulen.
    var timer = null;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function stopAuto()  { clearInterval(timer); timer = null; }
    function startAuto() {
      stopAuto();
      if (reduceMotion || !isMobile()) return;
      timer = setInterval(function () { goTo(current + 1); }, 5000);
    }
    grid.addEventListener('touchstart', stopAuto, { passive: true });
    grid.addEventListener('touchend',   startAuto, { passive: true });

    function setup() {
      stopAuto();
      if (isMobile()) {
        buildDots();
        goTo(0);
        startAuto();
      } else {
        grid.style.transform = '';
        dotsWrap.innerHTML = '';
        stopAuto();
      }
    }

    setup();
    // Solo reiniciar si cambia el ancho: en móvil la barra del navegador
    // dispara 'resize' al hacer scroll y reiniciaba el carrusel.
    var resizeTimer, lastWidth = window.innerWidth;
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 150);
    });
  }

  initCarousel('featuresGrid', 'featuresDots', '.feature-item');
})();

// ===== FAQ ACCORDION =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all others
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Toggle current
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});
