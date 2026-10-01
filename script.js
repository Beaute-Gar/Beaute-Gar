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
    'Applications web full-stack',
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

  function revealAll() {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Balayage synchrone : affiche d'emblée tout ce qui est déjà dans le
  // viewport. Indispensable si l'IntersectionObserver ne se déclenche pas
  // (onglet masqué, moteur exotique) — on ne veut jamais une page vide.
  function sweep() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    reveals.forEach(function (el) {
      if (el.classList.contains('in')) return;
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.classList.add('in');
    });
  }

  if (reduced || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    sweep();                       // immédiat : le hero apparaît dès le chargement
    setTimeout(sweep, 1500);       // différé : après stabilisation de la mise en page

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
    if (el.getAttribute('data-counted')) return;
    el.setAttribute('data-counted', '1');

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

    // Filet : rAF ne se déclenche pas dans un onglet non rendu.
    // On garantit la valeur finale exacte quoi qu'il arrive.
    setTimeout(function () { el.textContent = target; }, dur + 150);
  }

  // Sans ce balayage, un échec de l'IntersectionObserver laisserait « 0 »
  // à la place de 187 — une donnée fausse, bien pire qu'un contenu masqué.
  function sweepCounters() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    counters.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) runCount(el);
    });
  }

  if ('IntersectionObserver' in window) {
    sweepCounters();
    setTimeout(sweepCounters, 1500);

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
