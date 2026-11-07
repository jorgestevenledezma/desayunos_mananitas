/**
 * DESAYUNOS MAÑANITAS — Catálogo dinámico
 * Lee PRODUCTS (js/products.js) y renderiza tarjetas compactas en #catalogGrid
 * con filtro por presupuesto, orden por precio y botón "Ver más".
 * Los productos con `until` (AAAA-MM-DD) salen del catálogo después de esa fecha.
 */

(function () {
  var WA        = '573045236602';
  var PAGE_SIZE = 12;
  var grid      = document.getElementById('catalogGrid');
  if (!grid || typeof PRODUCTS === 'undefined') return;

  var statusEl = document.getElementById('catalogStatus');
  var moreBtn  = document.getElementById('catalogMore');
  var filters  = Array.from(document.querySelectorAll('.filter-btn[data-filter]'));

  var activeFilter = 'all';
  var activeSort   = 'default';
  var showAll      = false;

  var WA_ICON = '<svg class="wa-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8.2 8.2 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.4-.5.3-.5v-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.1 1.1 0 0 0-.8.4 3.4 3.4 0 0 0-1 2.5 5.9 5.9 0 0 0 1.2 3.1 13.4 13.4 0 0 0 5.2 4.6c.7.3 1.3.5 1.7.6a4.2 4.2 0 0 0 1.9.1 3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.2-.6-.4zM12 21.8a9.9 9.9 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zM20.5 3.5A11.8 11.8 0 0 0 1.9 17.7L.2 24l6.4-1.7a11.8 11.8 0 0 0 5.4 1.4h.1A11.8 11.8 0 0 0 20.5 3.5z"/></svg>';

  function formatPrice(n) {
    return '$' + Number(n).toLocaleString('es-CO');
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Mensaje con los datos que siempre hay que preguntar: así el pedido llega completo
  function waUrl(p) {
    var msg = 'Hola, quiero pedir el ' + p.name + ' (' + formatPrice(p.price) + ' + domicilio).\n\n' +
      'Fecha de entrega: \n' +
      'Franja (5:30–11:00 a.m. o 2:00–4:30 p.m.): \n' +
      'Barrio o municipio: \n' +
      'Mensaje para la tarjeta: ';
    return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
  }

  function isVisible(p) {
    if (p.active === false) return false;
    if (p.until && new Date() > new Date(p.until + 'T23:59:59')) return false;
    return true;
  }

  function inRange(p, filter) {
    if (filter === 'all') return true;
    var parts = filter.split('-');
    var min = Number(parts[0]) || 0;
    var max = parts[1] ? Number(parts[1]) : Infinity;
    return p.price >= min && p.price <= max;
  }

  function renderCard(p) {
    var href   = p.waOnly ? waUrl(p) : 'productos/' + p.id + '/';
    var tgtRel = p.waOnly ? ' target="_blank" rel="noopener"' : '';
    var photo  = (window.PHOTOS_MAP && window.PHOTOS_MAP[p.id]) || null;

    var visual = photo
      ? '<img src="' + photo + '" class="card-photo" alt="' + esc(p.name) + '" loading="lazy" decoding="async">'
      : '<div class="card-gradient" style="background:' + p.gradient + '"></div><div class="card-emoji" aria-hidden="true">' + p.emoji + '</div>';

    return [
      '<article class="product-card fade-up">',
        p.badge ? '<div class="card-badge">' + esc(p.badge) + '</div>' : '',
        '<a href="' + href + '"' + tgtRel + ' class="card-visual" tabindex="-1" aria-hidden="true">', visual, '</a>',
        '<div class="card-body">',
          '<h3 class="card-name"><a href="' + href + '"' + tgtRel + '>' + esc(p.name) + '</a></h3>',
          '<p class="card-summary">' + esc(p.includes.join(' · ')) + '</p>',
          '<div class="card-footer">',
            '<div class="card-price-wrap">',
              '<span class="card-price">' + formatPrice(p.price) + '</span>',
              '<span class="card-price-note">+ domicilio</span>',
            '</div>',
            '<a href="' + waUrl(p) + '" class="card-order" target="_blank" rel="noopener" aria-label="Pedir ' + esc(p.name) + ' por WhatsApp">' + WA_ICON + 'Pedir</a>',
          '</div>',
        '</div>',
      '</article>',
    ].join('');
  }

  // Animación de entrada para las tarjetas
  var fadeObserver = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 }) : null;

  var available = PRODUCTS.filter(isVisible);

  function updateCounts() {
    filters.forEach(function (btn) {
      var n = available.filter(function (p) { return inRange(p, btn.dataset.filter); }).length;
      var count = btn.querySelector('.filter-count');
      if (count) count.textContent = n;
    });
  }

  function render() {
    var list = available.filter(function (p) { return inRange(p, activeFilter); });

    if (activeSort === 'asc')  list.sort(function (a, b) { return a.price - b.price; });
    if (activeSort === 'desc') list.sort(function (a, b) { return b.price - a.price; });

    grid.style.minHeight = '';   // CLS: libera el espacio reservado

    if (!list.length) {
      grid.innerHTML = '<div class="catalog-empty"><p>No tenemos desayunos en este rango por ahora.</p>' +
        '<button type="button" class="filter-btn" data-reset>Ver todos los desayunos</button></div>';
      grid.querySelector('[data-reset]').addEventListener('click', function () { setFilter('all'); });
      if (statusEl) statusEl.textContent = '';
      if (moreBtn) moreBtn.hidden = true;
      return;
    }

    var shown = showAll ? list : list.slice(0, PAGE_SIZE);
    grid.innerHTML = shown.map(renderCard).join('');
    grid.querySelectorAll('.product-card').forEach(function (el) {
      if (fadeObserver) fadeObserver.observe(el); else el.classList.add('visible');
    });

    if (statusEl) {
      statusEl.textContent = shown.length < list.length
        ? 'Mostrando ' + shown.length + ' de ' + list.length + ' desayunos'
        : list.length + (list.length === 1 ? ' desayuno' : ' desayunos');
    }
    if (moreBtn) {
      var rest = list.length - shown.length;
      moreBtn.hidden = rest <= 0;
      moreBtn.textContent = 'Ver ' + (rest === 1 ? 'el desayuno restante' : 'los ' + rest + ' desayunos restantes');
    }
  }

  function setFilter(value) {
    activeFilter = value;
    showAll = false;
    filters.forEach(function (b) {
      var on = b.dataset.filter === value;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    render();
  }

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () { setFilter(btn.dataset.filter); });
  });

  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      var first = grid.children.length;
      showAll = true;
      render();
      // Lleva el foco a la primera tarjeta nueva para no perder el lugar
      var next = grid.children[first] && grid.children[first].querySelector('.card-name a');
      if (next) next.focus({ preventScroll: true });
    });
  }

  var sortSel = document.getElementById('priceSort');
  if (sortSel) {
    sortSel.addEventListener('change', function () {
      activeSort = sortSel.value;
      render();
    });
  }

  updateCounts();
  render();
})();
