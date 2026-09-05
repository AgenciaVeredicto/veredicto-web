/* Fondo generativo del hero.
 *
 * Criterios: que no distraiga del titular, que no dependa de descargar nada,
 * que no penalice el rendimiento y que se apague solo cuando corresponde.
 *
 * - Lineas de contorno muy tenues que se desplazan lentas, en la paleta verde.
 * - Se detiene cuando el hero sale de pantalla (IntersectionObserver): no
 *   gasta CPU mientras el usuario lee el resto de la pagina.
 * - Se apaga con prefers-reduced-motion y en pantallas chicas, donde el
 *   costo de bateria no compensa.
 * - Si algo falla, no pasa nada: el hero funciona igual sin este archivo.
 */
(function () {
  var host = document.getElementById('heroCanvas');
  if (!host) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var chico = window.matchMedia('(max-width: 720px)').matches;
  if (reduce || chico) return;

  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  host.appendChild(canvas);

  var ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

  function medir() {
    var r = host.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  medir();

  // Cada linea es una onda con su propia fase, amplitud y velocidad:
  // al no compartir periodo, el conjunto nunca se repite a simple vista.
  var LINEAS = 5;
  var ondas = [];
  for (var i = 0; i < LINEAS; i++) {
    ondas.push({
      y: 0.32 + i * 0.11,
      amp: 16 + i * 7,
      largo: 0.0016 + i * 0.00035,
      vel: 0.00007 + i * 0.000022,
      fase: i * 1.7,
      alfa: 0.22 - i * 0.025
    });
  }

  var activo = true, raf = null;

  function dibujar(t) {
    ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < ondas.length; i++) {
      var o = ondas[i];
      ctx.beginPath();
      for (var x = 0; x <= w; x += 6) {
        var y = o.y * h
              + Math.sin(x * o.largo + t * o.vel + o.fase) * o.amp
              + Math.sin(x * o.largo * 2.3 + t * o.vel * 1.6) * (o.amp * 0.3);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(74, 124, 89, ' + o.alfa + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    if (activo) raf = requestAnimationFrame(dibujar);
  }
  raf = requestAnimationFrame(dibujar);

  // Se pausa cuando el hero no esta a la vista
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting && !activo) { activo = true; raf = requestAnimationFrame(dibujar); }
        else if (!e.isIntersecting && activo) { activo = false; cancelAnimationFrame(raf); }
      });
    }, { threshold: 0 }).observe(host);
  }

  var tid;
  window.addEventListener('resize', function () {
    clearTimeout(tid);
    tid = setTimeout(medir, 180);
  }, { passive: true });
})();
