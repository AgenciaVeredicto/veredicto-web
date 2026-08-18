/* Agencia Veredicto — script del sitio.
 *
 * Multipagina: NINGUN bloque puede asumir que su elemento existe. Cada uno
 * sale temprano si no lo encuentra. Un throw aca dejaria los .reveal en
 * opacity:0 y la pagina en blanco, que es como ya se rompio una vez.
 */

/* -------- SCROLL PROGRESS BAR -------- */
(function () {
  var bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', function () {
    var h = document.documentElement;
    var pct = h.scrollTop / (h.scrollHeight - h.clientHeight) || 0;
    bar.style.transform = 'scaleX(' + Math.min(pct, 1) + ')';
  }, { passive: true });
})();

/* -------- HERO TITLE ANIMATION (solo donde hay #heroTitle) -------- */
(function () {
  var title = document.getElementById('heroTitle');
  if (!title) return;

  // Las lineas se declaran en el HTML via data-lines, asi cada pagina
  // anima su propio titulo sin tocar este archivo.
  var lines;
  try { lines = JSON.parse(title.getAttribute('data-lines') || '[]'); }
  catch (e) { lines = []; }
  if (!lines.length) return;

  title.innerHTML = '';
  var delay = 0.3;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  lines.forEach(function (line) {
    var wrapper = document.createElement('span');
    wrapper.style.display = 'block';
    line.forEach(function (seg) {
      String(seg.text).split(' ').forEach(function (w) {
        var span = document.createElement('span');
        span.className = 'hero-word';
        if (reduced) { span.style.animation = 'none'; span.style.opacity = '1'; span.style.transform = 'none'; }
        else { span.style.animationDelay = delay + 's'; }
        span.textContent = w;
        if (seg.italic) { span.style.fontStyle = 'italic'; span.style.color = 'var(--sage)'; }
        wrapper.appendChild(span);
        delay += 0.07;
      });
    });
    title.appendChild(wrapper);
  });
})();

/* -------- NAV SCROLL -------- */
(function () {
  var nav = document.getElementById('mainNav');
  if (!nav) return;
  var apply = function () { nav.classList.toggle('scrolled', window.scrollY > 50); };
  window.addEventListener('scroll', apply, { passive: true });
  apply();
})();

/* -------- ACTIVE SECTION TRACKING (solo anclas de la home) -------- */
(function () {
  var links = document.querySelectorAll('.nav-links a[href^="/#"], .nav-links a[href^="#"]');
  var sections = document.querySelectorAll('section[id]');
  if (!links.length || !sections.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var id = e.target.id;
      links.forEach(function (a) {
        var href = a.getAttribute('href') || '';
        a.classList.toggle('active', href === '#' + id || href === '/#' + id);
      });
    });
  }, { threshold: 0.35 });
  sections.forEach(function (s) { obs.observe(s); });
})();

/* -------- MOBILE NAV -------- */
var openMobile = function () {};
var closeMobile = function () {};
(function () {
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobileNav');
  var navClose  = document.getElementById('navClose');
  if (!hamburger || !mobileNav) return;

  openMobile = function () {
    mobileNav.classList.add('open');
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  };
  closeMobile = function () {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  hamburger.addEventListener('click', function () {
    if (mobileNav.classList.contains('open')) closeMobile(); else openMobile();
  });
  if (navClose) navClose.addEventListener('click', closeMobile);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMobile(); });
})();

/* -------- REVEAL ON SCROLL -------- */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (!('IntersectionObserver' in window)) {
    // Sin soporte, mostrar todo antes que dejar la pagina vacia.
    els.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
  els.forEach(function (el) { obs.observe(el); });
})();

/* -------- COUNTER ANIMATION -------- */
(function () {
  var els = document.querySelectorAll('.counter');
  if (!els.length || !('IntersectionObserver' in window)) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) { obs.unobserve(el); return; }
      var start = null;
      var dur = 1200;
      (function tick(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        el.textContent = p < 1 ? Math.floor(ease * target) : target;
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
      obs.unobserve(el);
    });
  }, { threshold: 0.1 });
  els.forEach(function (el) { obs.observe(el); });
})();

/* -------- MAGNETIC BUTTONS (desktop) -------- */
if (!window.matchMedia('(hover: none)').matches) {
  document.querySelectorAll('.btn-primary, .btn-nav, .btn-submit').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var r = btn.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) * 0.2;
      var y = (e.clientY - r.top - r.height / 2) * 0.2;
      btn.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transition = 'transform .45s cubic-bezier(.16,1,.3,1), background .2s';
      btn.style.transform = '';
      setTimeout(function () { btn.style.transition = ''; }, 450);
    });
    btn.addEventListener('mouseenter', function () {
      btn.style.transition = 'transform .1s ease, background .2s';
    });
  });
}

/* -------- CARD 3-D TILT (desktop) -------- */
if (!window.matchMedia('(hover: none)').matches) {
  document.querySelectorAll('.plan-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transition = 'box-shadow .28s cubic-bezier(.16,1,.3,1)';
      card.style.transform =
        'translateY(-7px) perspective(700px) rotateX(' + (-y * 5) + 'deg) rotateY(' + (x * 5) + 'deg)';
      card.style.boxShadow = '0 22px 44px -20px rgba(28,43,30,.3)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transition = 'transform .35s cubic-bezier(.16,1,.3,1), box-shadow .3s cubic-bezier(.16,1,.3,1)';
      card.style.transform = '';
      card.style.boxShadow = '';
    });
    card.addEventListener('mouseenter', function () {
      card.style.transition = 'box-shadow .28s cubic-bezier(.16,1,.3,1)';
    });
  });
}

/* -------- FORM SUBMIT (Formspree) -------- */
(function () {
  var form = document.getElementById('ctaForm');
  if (!form) return;
  var ENDPOINT = 'https://formspree.io/f/mykadjvk';

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = document.getElementById('submitBtn');
    var data = new FormData(form);
    if (!btn) return;

    btn.textContent = 'Enviando…';
    btn.disabled = true;

    fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (res.ok) {
          btn.textContent = '¡Diagnóstico solicitado! Nos contactamos pronto.';
          btn.style.background = 'var(--sage)';
          form.reset();
          setTimeout(function () {
            btn.textContent = 'Solicitar diagnóstico →';
            btn.style.background = '';
            btn.disabled = false;
          }, 5000);
        } else {
          btn.textContent = 'Error al enviar. Escribinos por WhatsApp.';
          btn.disabled = false;
        }
      })
      .catch(function () {
        btn.textContent = 'Sin conexión. Escribinos por WhatsApp.';
        btn.disabled = false;
      });
  });
})();

/* -------- REDUCED MOTION -------- */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.hero-bg-num').forEach(function (el) { el.style.animation = 'none'; });
}
