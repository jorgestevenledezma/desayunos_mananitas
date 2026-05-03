// ===== SEASONAL DYNAMIC BANNER (slider) =====
(function() {
  // Los meses van de 0 (enero) a 11 (diciembre)
  const seasons = [
    {
      id: 'dia-nino',
      name: 'Día del Niño',
      startMonth: 3, startDay: 10,
      endMonth: 3, endDay: 25,
      emoji: '🍄',
      title: '🎮 Mario Bros Galaxy · Día del Niño 2026',
      desc: 'Desayunos temáticos especiales para el 25 de abril. ¡Reserva el tuyo!',
      ctaText: '⭐ Ver desayunos del Día del Niño',
      ctaUrl: '#dia-nino',
      gradient: 'linear-gradient(135deg, #0a0a3a, #1a1a6e, #2d2d9f)',
    },
    {
      id: 'dia-madre',
      name: 'Día de la Madre',
      startMonth: 3, startDay: 9,
      endMonth: 4, endDay: null,
      emoji: '👩‍👧‍👦',
      title: '¡Sorprende a Mamá este 10 de mayo!',
      desc: 'Tenemos desayunos especiales para ella. Reserva con tiempo y llegamos desde las 5:30 a.m.',
      ctaText: '💖 Ver desayunos para Mamá',
      ctaUrl: 'https://wa.me/573045236602?text=Hola%2C%20quiero%20pedir%20un%20desayuno%20para%20el%20D%C3%ADa%20de%20la%20Madre%20%F0%9F%92%96',
      gradient: 'linear-gradient(135deg, #880e4f, #c2185b, #f06292)',
    },
    {
      id: 'san-valentin',
      name: 'San Valentín',
      startMonth: 0, startDay: 20,
      endMonth: 1, endDay: 14,
      emoji: '💝',
      title: '¡San Valentín se acerca!',
      desc: 'Sorprende a tu persona favorita con un brunch romántico lleno de amor.',
      ctaText: '💕 Pedir para San Valentín',
      ctaUrl: 'https://wa.me/573045236602?text=Hola%2C%20quiero%20pedir%20un%20desayuno%20para%20San%20Valent%C3%ADn',
      gradient: 'linear-gradient(135deg, #e91e63, #c2185b, #ad1457)',
    },
    {
      id: 'dia-mujer',
      name: 'Día de la Mujer',
      startMonth: 1, startDay: 20,
      endMonth: 2, endDay: 8,
      emoji: '💐',
      title: '¡Feliz Día de la Mujer!',
      desc: 'Celebra a esa mujer increíble con un desayuno lleno de flores y cariño.',
      ctaText: '🌷 Pedir para Día de la Mujer',
      ctaUrl: 'https://wa.me/573045236602?text=Hola%2C%20quiero%20pedir%20un%20desayuno%20para%20el%20D%C3%ADa%20de%20la%20Mujer',
      gradient: 'linear-gradient(135deg, #9c27b0, #7b1fa2, #6a1b9a)',
    },
    {
      id: 'dia-padre',
      name: 'Día del Padre',
      startMonth: 5, startDay: 1,
      endMonth: 5, endDay: null,
      emoji: '👨‍👧',
      title: '¡Día del Padre!',
      desc: 'Papá también merece una sorpresa. Un brunch que nunca olvidará.',
      ctaText: '💙 Pedir para Papá',
      ctaUrl: 'https://wa.me/573045236602?text=Hola%2C%20quiero%20pedir%20un%20desayuno%20para%20el%20D%C3%ADa%20del%20Padre',
      gradient: 'linear-gradient(135deg, #1565c0, #1976d2, #42a5f5)',
    },
    {
      id: 'amor-amistad',
      name: 'Amor y Amistad',
      startMonth: 8, startDay: 1,
      endMonth: 8, endDay: null,
      emoji: '💛',
      title: '¡Amor y Amistad!',
      desc: 'Celebra con tus amigos y seres queridos con un desayuno sorpresa.',
      ctaText: '🤗 Pedir para Amor y Amistad',
      ctaUrl: 'https://wa.me/573045236602?text=Hola%2C%20quiero%20pedir%20para%20Amor%20y%20Amistad',
      gradient: 'linear-gradient(135deg, #e65100, #f57c00, #ff9800)',
    },
    {
      id: 'halloween',
      name: 'Halloween',
      startMonth: 9, startDay: 15,
      endMonth: 9, endDay: 31,
      emoji: '🎃',
      title: '¡Halloween Mañanitas!',
      desc: 'Desayunos temáticos de Halloween. ¡Sustos dulces para empezar el día!',
      ctaText: '🎃 Pedir Halloween',
      ctaUrl: 'https://wa.me/573045236602?text=Hola%2C%20quiero%20pedir%20un%20desayuno%20tem%C3%A1tico%20de%20Halloween',
      gradient: 'linear-gradient(135deg, #e65100, #f57c00, #ff9800)',
    },
    {
      id: 'navidad',
      name: 'Navidad',
      startMonth: 11, startDay: 1,
      endMonth: 11, endDay: 25,
      emoji: '🎄',
      title: '¡Feliz Navidad!',
      desc: 'Regala un desayuno navideño lleno de magia y sabor. El detalle perfecto.',
      ctaText: '🎁 Pedir Navideño',
      ctaUrl: 'https://wa.me/573045236602?text=Hola%2C%20quiero%20pedir%20un%20desayuno%20navide%C3%B1o',
      gradient: 'linear-gradient(135deg, #b71c1c, #c62828, #d32f2f)',
    },
  ];

  // Calcular fechas dinámicas
  function getNthDayOfMonth(year, month, dayOfWeek, nth) {
    const firstDay = new Date(year, month, 1).getDay();
    return 1 + ((dayOfWeek - firstDay + 7) % 7) + (nth - 1) * 7;
  }

  const currentYear = new Date().getFullYear();
  const motherDay = getNthDayOfMonth(currentYear, 4, 0, 2);
  const fatherDay = getNthDayOfMonth(currentYear, 5, 0, 3);
  const amorDay   = getNthDayOfMonth(currentYear, 8, 6, 3);
  seasons.find(s => s.id === 'dia-madre').endDay    = motherDay;
  seasons.find(s => s.id === 'dia-padre').endDay    = fatherDay;
  seasons.find(s => s.id === 'amor-amistad').endDay = amorDay;

  // Recoger TODAS las temporadas activas
  const now   = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const activeSeasons = seasons.filter(s => {
    const start = new Date(currentYear, s.startMonth, s.startDay);
    const end   = new Date(currentYear, s.endMonth, s.endDay, 23, 59, 59);
    return today >= start && today <= end;
  });

  if (!activeSeasons.length) return;

  // Si todas fueron cerradas en esta sesión, no mostrar
  const allClosed = activeSeasons.every(s =>
    sessionStorage.getItem('seasonal_closed_' + s.id + '_' + currentYear)
  );
  if (allClosed) return;

  // Filtrar las que el usuario cerró
  const visible = activeSeasons.filter(s =>
    !sessionStorage.getItem('seasonal_closed_' + s.id + '_' + currentYear)
  );
  if (!visible.length) return;

  // ── DOM ──
  const banner    = document.getElementById('seasonalBanner');
  const elEmoji   = document.getElementById('seasonalEmoji');
  const elTitle   = document.getElementById('seasonalTitle');
  const elDesc    = document.getElementById('seasonalDesc');
  const elCountdown = document.getElementById('seasonalCountdown');
  const elCta     = document.getElementById('seasonalCta');
  const elDots    = document.getElementById('seasonalDots');

  let current = 0;
  let autoTimer;

  // Crear dots
  function buildDots() {
    elDots.innerHTML = '';
    if (visible.length < 2) return; // sin dots si solo hay uno
    visible.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'seasonal-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Ir a ' + visible[i].name);
      d.addEventListener('click', () => { goTo(i); resetAuto(); });
      elDots.appendChild(d);
    });
  }

  function updateDots(idx) {
    elDots.querySelectorAll('.seasonal-dot').forEach((d, i) =>
      d.classList.toggle('active', i === idx)
    );
  }

  let countdownInterval;
  function renderSeason(s) {
    const eventDate = new Date(currentYear, s.endMonth, s.endDay, 23, 59, 59);

    // Transición suave
    banner.style.opacity = '0';
    setTimeout(() => {
      banner.style.background = s.gradient;
      elEmoji.textContent   = s.emoji;
      elTitle.textContent   = s.title;
      elDesc.textContent    = s.desc;
      elCta.textContent     = s.ctaText;
      elCta.href            = s.ctaUrl;
      // El link interno no abre nueva pestaña
      if (s.ctaUrl.startsWith('#')) {
        elCta.removeAttribute('target');
      } else {
        elCta.setAttribute('target', '_blank');
        elCta.setAttribute('rel', 'noopener');
      }
      banner.style.opacity = '1';
    }, 180);

    // Countdown
    clearInterval(countdownInterval);
    function updateCountdown() {
      const diff = eventDate - new Date();
      if (diff <= 0) {
        elCountdown.innerHTML = '<span style="color:white;font-weight:700;">🎉 ¡Es hoy!</span>';
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const sc = Math.floor((diff % 60000) / 1000);
      elCountdown.innerHTML =
        '<div class="countdown-item"><span class="countdown-number">' + d  + '</span><span class="countdown-label">Días</span></div>' +
        '<div class="countdown-item"><span class="countdown-number">' + h  + '</span><span class="countdown-label">Horas</span></div>' +
        '<div class="countdown-item"><span class="countdown-number">' + m  + '</span><span class="countdown-label">Min</span></div>' +
        '<div class="countdown-item"><span class="countdown-number">' + sc + '</span><span class="countdown-label">Seg</span></div>';
    }
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
  }

  function goTo(idx) {
    current = (idx + visible.length) % visible.length;
    renderSeason(visible[current]);
    updateDots(current);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    if (visible.length > 1) {
      autoTimer = setInterval(() => goTo(current + 1), 6000);
    }
  }

  // Iniciar
  banner.style.transition = 'opacity 0.18s ease, background 0.4s ease';
  banner.style.display    = 'block';
  buildDots();
  goTo(0);
  resetAuto();
  document.querySelector('.hero').style.marginTop = '0';

  // Cerrar
  document.getElementById('seasonalClose').addEventListener('click', () => {
    // Marcar la temporada actual como cerrada
    sessionStorage.setItem('seasonal_closed_' + visible[current].id + '_' + currentYear, '1');
    // Si quedan otras, ir a la siguiente; si no, ocultar
    const remaining = visible.filter(s =>
      !sessionStorage.getItem('seasonal_closed_' + s.id + '_' + currentYear)
    );
    if (remaining.length) {
      goTo(current + 1);
    } else {
      banner.style.display = 'none';
      clearInterval(autoTimer);
      clearInterval(countdownInterval);
    }
  });
})();
