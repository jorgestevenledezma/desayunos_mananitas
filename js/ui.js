// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== MOBILE MENU =====
document.getElementById('mobileToggle').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

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

// ===== CARRUSEL MÓVIL (features & steps) =====
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

    // Auto-avance cada 4s
    var timer;
    function startAuto() { timer = setInterval(function () { goTo(current + 1); }, 4000); }
    function stopAuto()  { clearInterval(timer); }
    grid.addEventListener('touchstart', stopAuto, { passive: true });
    grid.addEventListener('touchend',   startAuto, { passive: true });

    function setup() {
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
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 150);
    });
  }

  initCarousel('featuresGrid', 'featuresDots', '.feature-item');
  initCarousel('stepsGrid',    'stepsDots',    '.step-card');
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
