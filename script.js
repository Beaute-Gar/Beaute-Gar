/* ════════════════════════════════════════════
   Beaute-Gar — portfolio
   Écriture machine · révélation au défilement · compteurs
   Aucune dépendance externe.
   ════════════════════════════════════════════ */

(function () {
  'use strict';

  var reduced = window.matchMedia &&
                window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Écriture machine ──────────────────── */
  var PHRASES = [
    'Bots WhatsApp & automatisation',
    'JavaScript · Python · TypeScript',
    'Moteurs de modération & protections',
    'Je construis des outils utiles en public'
  ];

  var typedEl = document.getElementById('typed');

  if (typedEl) {
    if (reduced) {
      typedEl.textContent = PHRASES[0];
    } else {
      var p = 0;      // index de la phrase
      var c = 0;      // index du caractère
      var deleting = false;

      var TYPE = 58;      // ms par caractère tapé
      var ERASE = 26;     // ms par caractère effacé
      var HOLD = 1900;    // pause en fin de phrase
      var GAP = 420;      // pause après effacement

      (function tick() {
        var full = PHRASES[p];

        if (!deleting) {
          c++;
          typedEl.textContent = full.slice(0, c);

          if (c === full.length) {
            deleting = true;
            return setTimeout(tick, HOLD);
          }
          return setTimeout(tick, TYPE + Math.random() * 34);
        }

        c--;
        typedEl.textContent = full.slice(0, c);

        if (c === 0) {
          deleting = false;
          p = (p + 1) % PHRASES.length;
          return setTimeout(tick, GAP);
        }
        return setTimeout(tick, ERASE);
      })();
    }
  }

  /* ── 2. Révélation au défilement ──────────── */
  var reveals = document.querySelectorAll('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    // décalage en cascade entre cartes d'une même rangée
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = ((i % 4) * 85) + 'ms';
      io.observe(el);
    });
  }

  /* ── 3. Compteurs du hero ─────────────────── */
  var counters = document.querySelectorAll('[data-count]');

  function runCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;

    if (reduced || target === 0) {
      el.textContent = target;
      return;
    }

    var dur = 1250;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / dur, 1);
      // easeOutCubic — ralentit en fin de course
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        runCount(entry.target);
        co.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { co.observe(el); });
  } else {
    counters.forEach(runCount);
  }

  /* ── 4. Ombre sous la nav au défilement ───── */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () {
      nav.style.boxShadow = window.scrollY > 12
        ? '0 12px 34px -26px rgba(0,0,0,.95)'
        : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
