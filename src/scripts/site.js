/* -------- SCROLL PROGRESS BAR -------- */
(function () {
  const bar = document.getElementById('scrollProgress');
  function update() {
    const h = document.documentElement;
    const pct = h.scrollTop / (h.scrollHeight - h.clientHeight) || 0;
    bar.style.transform = 'scaleX(' + Math.min(pct, 1) + ')';
  }
  window.addEventListener('scroll', update, { passive: true });
})();

/* -------- HERO TITLE ANIMATION -------- */
var heroLines = [
  { segments: [{ text: 'Tus clientes están buscando.', italic: false }] },
  { segments: [{ text: 'Nos aseguramos de que te encuentren.', italic: false }] }
];

function buildHeroTitle() {
  var title = document.getElementById('heroTitle');
  title.innerHTML = '';
  var delay = 0.3;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  heroLines.forEach(function(line) {
    var wrapper = document.createElement('span');
    wrapper.style.display = 'block';
    line.segments.forEach(function(seg) {
      seg.text.split(' ').forEach(function(w) {
        var span = document.createElement('span');
        span.className = 'hero-word';
        if (reducedMotion) { span.style.animation = 'none'; span.style.opacity = '1'; span.style.transform = 'none'; }
        else { span.style.animationDelay = delay + 's'; }
        span.textContent = w;
        if (seg.italic) { span.style.fontStyle = 'italic'; span.style.color = 'var(--sage)'; }
        wrapper.appendChild(span);
        delay += 0.07;
      });
    });
    title.appendChild(wrapper);
  });
}

buildHeroTitle();

/* -------- NAV SCROLL -------- */
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* -------- ACTIVE SECTION TRACKING -------- */
(function () {
  const links   = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = '#' + e.target.id;
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => obs.observe(s));
})();

/* -------- MOBILE NAV -------- */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

function openMobile() {
  mobileNav.classList.add('open');
  hamburger.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
}
function closeMobile() {
  mobileNav.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}
hamburger.addEventListener('click', () =>
  mobileNav.classList.contains('open') ? closeMobile() : openMobile()
);
document.getElementById('navClose').addEventListener('click', closeMobile);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMobile(); });

/* -------- REVEAL ON SCROLL -------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* -------- COUNTER ANIMATION -------- */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.target, 10);
    let start = null;
    const dur = 1200;
    (function tick(ts) {
      if (!start) start = ts;
      const p  = Math.min((ts - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = p < 1 ? Math.floor(ease * target) : target;
      if (p < 1) requestAnimationFrame(tick);
    })(performance.now());
    counterObserver.unobserve(el);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* -------- MAGNETIC BUTTONS (desktop only) -------- */
if (!window.matchMedia('(hover: none)').matches) {
  document.querySelectorAll('.btn-primary, .btn-nav, .btn-submit').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.2;
      const y = (e.clientY - r.top  - r.height / 2) * 0.2;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform .45s cubic-bezier(.16,1,.3,1), background .2s';
      btn.style.transform  = '';
      setTimeout(() => { btn.style.transition = ''; }, 450);
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform .1s ease, background .2s';
    });
  });
}

/* -------- CARD 3-D TILT (desktop only) -------- */
if (!window.matchMedia('(hover: none)').matches) {
  document.querySelectorAll('.plan-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - 0.5;
      const y = (e.clientY - r.top)  / r.height - 0.5;
      card.style.transition = 'box-shadow .28s cubic-bezier(.16,1,.3,1)';
      card.style.transform  =
        `translateY(-7px) perspective(700px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
      card.style.boxShadow  = '0 22px 44px -20px rgba(28,43,30,.3)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .35s cubic-bezier(.16,1,.3,1), box-shadow .3s cubic-bezier(.16,1,.3,1)';
      card.style.transform  = '';
      card.style.boxShadow  = '';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'box-shadow .28s cubic-bezier(.16,1,.3,1)';
    });
  });
}

/* -------- TICKER -------- */
/* pausa/reanuda solo con hover (CSS), sin toggle por click */

/* -------- FORM SUBMIT (Formspree) -------- */
// Reemplazá 'XXXXXXXX' con tu endpoint de formspree.io/f/XXXXXXXX
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mykadjvk';

document.getElementById('ctaForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn  = document.getElementById('submitBtn');
  const data = new FormData(this);

  btn.textContent = 'Enviando…';
  btn.disabled    = true;

  fetch(FORMSPREE_ENDPOINT, {
    method:  'POST',
    body:    data,
    headers: { 'Accept': 'application/json' }
  })
    .then(res => {
      if (res.ok) {
        btn.textContent      = '¡Diagnóstico solicitado! Nos contactamos pronto.';
        btn.style.background = 'var(--sage)';
        this.reset();
        setTimeout(() => {
          btn.textContent      = 'Solicitar diagnóstico →';
          btn.style.background = '';
          btn.disabled         = false;
        }, 5000);
      } else {
        btn.textContent = 'Error al enviar. Escribinos por WhatsApp.';
        btn.disabled    = false;
      }
    })
    .catch(() => {
      btn.textContent = 'Sin conexión. Escribinos por WhatsApp.';
      btn.disabled    = false;
    });
});

/* -------- REDUCED MOTION -------- */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.hero-bg-num').forEach(el => { el.style.animation = 'none'; });
  /* hero-word reduced motion is handled inside buildHeroTitle */
}
