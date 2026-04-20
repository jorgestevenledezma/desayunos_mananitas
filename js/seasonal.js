// ===== SEASONAL DYNAMIC BANNER =====
(function() {
  // 🎯 CONFIGURACIÓN DE TEMPORADAS
  // Para agregar una nueva temporada, simplemente agrega un objeto al array
  // startMonth/startDay = cuándo empieza a mostrarse
  // endMonth/endDay = fecha del evento (fin del banner)
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
      ctaColor: '#ffe066'
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
      ctaUrl: 'https://wa.me/573045236602?text=Hola%20%F0%9F%90%B0%20Quiero%20pedir%20un%20desayuno%20para%20San%20Valentín%20💝',
      gradient: 'linear-gradient(135deg, #e91e63, #c2185b, #ad1457)',
      ctaColor: '#e91e63'
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
      ctaUrl: 'https://wa.me/573045236602?text=Hola%20%F0%9F%90%B0%20Quiero%20pedir%20un%20desayuno%20para%20el%20Día%20de%20la%20Mujer%20💐',
      gradient: 'linear-gradient(135deg, #9c27b0, #7b1fa2, #6a1b9a)',
      ctaColor: '#9c27b0'
    },
    {
      id: 'dia-madre',
      name: 'Día de la Madre',
      startMonth: 3, startDay: 9,
      endMonth: 4, endDay: null, // Se calcula dinámicamente (2do domingo de mayo)
      emoji: '👩‍👧‍👦',
      title: '¡Sorprende a Mamá este 11 de mayo!',
      desc: 'Tenemos desayunos especiales para ella. Reserva con tiempo y llegamos desde las 6 a.m.',
      ctaText: '💖 Ver desayunos para Mamá',
      ctaUrl: 'https://wa.me/573045236602?text=Hola%20%F0%9F%90%B0%20Quiero%20pedir%20un%20desayuno%20para%20el%20D%C3%ADa%20de%20la%20Madre%20%F0%9F%92%96',
      gradient: 'linear-gradient(135deg, #e91e63, #f06292, #f48fb1)',
      ctaColor: '#e91e63'
    },
    {
      id: 'dia-padre',
      name: 'Día del Padre',
      startMonth: 5, startDay: 1,
      endMonth: 5, endDay: null, // Se calcula dinámicamente
      emoji: '👨‍👧',
      title: '¡Día del Padre!',
      desc: 'Papá también merece una sorpresa. Un brunch que nunca olvidará.',
      ctaText: '💙 Pedir para Papá',
      ctaUrl: 'https://wa.me/573045236602?text=Hola%20%F0%9F%90%B0%20Quiero%20pedir%20un%20desayuno%20para%20el%20Día%20del%20Padre%20💙',
      gradient: 'linear-gradient(135deg, #1565c0, #1976d2, #42a5f5)',
      ctaColor: '#1565c0'
    },
    {
      id: 'amor-amistad',
      name: 'Amor y Amistad',
      startMonth: 8, startDay: 1,
      endMonth: 8, endDay: null, // Se calcula dinámicamente
      emoji: '💛',
      title: '¡Amor y Amistad!',
      desc: 'Celebra con tus amigos y seres queridos con un desayuno sorpresa.',
      ctaText: '🤗 Pedir para Amor y Amistad',
      ctaUrl: 'https://wa.me/573045236602?text=Hola%20%F0%9F%90%B0%20Quiero%20pedir%20un%20desayuno%20para%20Amor%20y%20Amistad%20💛',
      gradient: 'linear-gradient(135deg, #ff6f00, #ff8f00, #ffa000)',
      ctaColor: '#ff6f00'
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
      ctaUrl: 'https://wa.me/573045236602?text=Hola%20%F0%9F%90%B0%20Quiero%20pedir%20un%20desayuno%20temático%20de%20Halloween%20🎃',
      gradient: 'linear-gradient(135deg, #e65100, #f57c00, #ff9800)',
      ctaColor: '#e65100'
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
      ctaUrl: 'https://wa.me/573045236602?text=Hola%20%F0%9F%90%B0%20Quiero%20pedir%20un%20desayuno%20navideño%20🎄',
      gradient: 'linear-gradient(135deg, #b71c1c, #c62828, #d32f2f)',
      ctaColor: '#b71c1c'
    }
  ];

  // Calcular fechas dinámicas (día de la madre, padre, amor y amistad)
  function getNthDayOfMonth(year, month, dayOfWeek, nth) {
    // dayOfWeek: 0=dom, 1=lun, ..., 6=sab
    const firstDay = new Date(year, month, 1).getDay();
    let day = 1 + ((dayOfWeek - firstDay + 7) % 7) + (nth - 1) * 7;
    return day;
  }

  const currentYear = new Date().getFullYear();

  // Día de la Madre: 2do domingo de mayo
  const motherDay = getNthDayOfMonth(currentYear, 4, 0, 2);
  seasons.find(s => s.id === 'dia-madre').endDay = motherDay;

  // Día del Padre: 3er domingo de junio
  const fatherDay = getNthDayOfMonth(currentYear, 5, 0, 3);
  seasons.find(s => s.id === 'dia-padre').endDay = fatherDay;

  // Amor y Amistad: 3er sábado de septiembre
  const amorDay = getNthDayOfMonth(currentYear, 8, 6, 3);
  seasons.find(s => s.id === 'amor-amistad').endDay = amorDay;

  // Buscar temporada activa
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let activeSeason = null;
  for (const season of seasons) {
    const start = new Date(currentYear, season.startMonth, season.startDay);
    const end = new Date(currentYear, season.endMonth, season.endDay, 23, 59, 59);
    if (today >= start && today <= end) {
      activeSeason = season;
      break;
    }
  }

  // Si no hay temporada activa, no mostrar banner
  if (!activeSeason) return;

  // Verificar si el usuario ya cerró este banner
  const closedKey = 'seasonal_closed_' + activeSeason.id + '_' + currentYear;
  if (sessionStorage.getItem(closedKey)) return;

  // Renderizar banner
  const banner = document.getElementById('seasonalBanner');
  const eventDate = new Date(currentYear, activeSeason.endMonth, activeSeason.endDay, 23, 59, 59);

  banner.style.display = 'block';
  banner.style.background = activeSeason.gradient;
  document.getElementById('seasonalEmoji').textContent = activeSeason.emoji;
  document.getElementById('seasonalTitle').textContent = activeSeason.title;
  document.getElementById('seasonalDesc').textContent = activeSeason.desc;

  const cta = document.getElementById('seasonalCta');
  cta.textContent = activeSeason.ctaText;
  cta.href = activeSeason.ctaUrl;
  cta.style.color = activeSeason.ctaColor;

  // Countdown
  function updateCountdown() {
    const now = new Date();
    const diff = eventDate - now;

    if (diff <= 0) {
      document.getElementById('seasonalCountdown').innerHTML =
        '<span style="color:white;font-weight:700;font-size:1.1rem;">🎉 ¡Es hoy! Último día para pedir</span>';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('seasonalCountdown').innerHTML =
      '<div class="countdown-item"><span class="countdown-number">' + days + '</span><span class="countdown-label">Días</span></div>' +
      '<div class="countdown-item"><span class="countdown-number">' + hours + '</span><span class="countdown-label">Horas</span></div>' +
      '<div class="countdown-item"><span class="countdown-number">' + mins + '</span><span class="countdown-label">Min</span></div>' +
      '<div class="countdown-item"><span class="countdown-number">' + secs + '</span><span class="countdown-label">Seg</span></div>';
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Cerrar banner
  document.getElementById('seasonalClose').addEventListener('click', () => {
    banner.style.display = 'none';
    sessionStorage.setItem(closedKey, '1');
  });

  // Ajustar hero margin cuando el banner está visible
  document.querySelector('.hero').style.marginTop = '0';
})();
