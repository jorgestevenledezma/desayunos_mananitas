/**
 * DESAYUNOS MAÑANITAS — Catálogo dinámico
 * Lee PRODUCTS (js/products.js) y renderiza las tarjetas en #catalogGrid
 * con filtro por categoría y ordenamiento por precio.
 */

(function () {
  const WA   = '573045236602';
  const grid = document.getElementById('catalogGrid');
  if (!grid || typeof PRODUCTS === 'undefined') return;

  let activeCategory = 'all';
  let activeSort     = 'default';

  function formatPrice(n) {
    return '$' + Number(n).toLocaleString('es-CO');
  }

  function waUrl(p) {
    var msg = encodeURIComponent('Hola, ' + p.name + ' (' + formatPrice(p.price) + ')');
    return 'https://wa.me/' + WA + '?text=' + msg;
  }

  function renderCard(p) {
    const badge = p.badge
      ? '<div class="card-badge">' + p.badge + '</div>'
      : '';
    const items = p.includes.slice(0, 4).map(function (i) {
      return '<p>' + i + '</p>';
    }).join('');

    var photo = (window.PHOTOS_MAP && window.PHOTOS_MAP[p.id]) || null;
    var visualInner = photo
      ? '<img src="' + photo + '" class="card-photo" alt="' + p.name + '" loading="lazy"><div class="card-photo-overlay"></div><div class="card-emoji card-emoji--photo">' + p.emoji + '</div>'
      : '<div class="card-gradient" style="background:' + p.gradient + '"></div><div class="card-emoji">' + p.emoji + '</div>';

    return [
      '<div class="product-card fade-up" data-category="' + p.category + '" data-price="' + p.price + '">',
        badge,
        '<a href="productos/' + p.id + '/" style="text-decoration:none;display:block;">',
          '<div class="card-visual">',
            visualInner,
          '</div>',
        '</a>',
        '<div class="card-body">',
          '<a href="productos/' + p.id + '/" style="text-decoration:none;">',
            '<h3 class="card-name">' + p.name + '</h3>',
          '</a>',
          '<div class="card-includes">' + items + '</div>',
          '<div class="card-decoration"><p>🎀 ' + p.decoration + '</p></div>',
          '<div class="card-footer">',
            '<div>',
              '<div class="card-price">' + formatPrice(p.price) + '</div>',
              '<span class="card-price-note">+ domicilio</span>',
            '</div>',
            '<a href="' + waUrl(p) + '" class="card-order" target="_blank" rel="noopener">📲 Pedir</a>',
          '</div>',
        '</div>',
      '</div>',
    ].join('');
  }

  // Animación de entrada para las tarjetas
  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  function render() {
    var list = PRODUCTS.slice();

    if (activeCategory !== 'all') {
      list = list.filter(function (p) { return p.category === activeCategory; });
    }
    if (activeSort === 'asc')  list.sort(function (a, b) { return a.price - b.price; });
    if (activeSort === 'desc') list.sort(function (a, b) { return b.price - a.price; });

    if (!list.length) {
      grid.innerHTML = '<p class="catalog-empty">No hay productos en esta categoría.</p>';
      return;
    }

    grid.innerHTML = list.map(renderCard).join('');
    grid.querySelectorAll('.product-card').forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  // Botones de categoría
  document.querySelectorAll('.filter-btn[data-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn[data-filter]').forEach(function (b) {
        b.classList.remove('active');
      });
      btn.classList.add('active');
      activeCategory = btn.dataset.filter;
      render();
    });
  });

  // Selector de ordenamiento
  var sortSel = document.getElementById('priceSort');
  if (sortSel) {
    sortSel.addEventListener('change', function () {
      activeSort = sortSel.value;
      render();
    });
  }

  // Render inicial
  render();
})();
