/* V2: HTML/CSS/JS nativo, sin red. El contenido es visible sin JS; esto solo agrega interacción. */
(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Exploración interna del hero: ?hero=balanza muestra la alternativa B.
  var h = new URLSearchParams(location.search).get('hero');
  if (h === 'balanza') root.dataset.hero = 'balanza';

  // CTA: solo estado local.
  var dlg = d.getElementById('estado');
  d.querySelectorAll('[data-cta]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (dlg && typeof dlg.showModal === 'function') dlg.showModal();
      else alert('Inscripción no habilitada. La venta está pausada y este botón no envía datos.');
    });
  });
  if (dlg) dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });

  // Contador de una tarea (ejemplo inventado, 4 semanas por mes como supuesto declarado).
  var veces = d.getElementById('c-veces'), mins = d.getElementById('c-min');
  var rSem = d.getElementById('r-sem'), rMes = d.getElementById('r-mes');
  function dur(m) {
    var hh = Math.floor(m / 60), mm = m % 60;
    return hh ? hh + ' h' + (mm ? ' ' + mm + ' min' : '') : mm + ' min';
  }
  function num(el, max) {
    var n = parseInt(el.value, 10);
    return isNaN(n) || n < 0 ? 0 : Math.min(n, max);
  }
  function calcular() {
    var sem = num(veces, 200) * num(mins, 480);
    rSem.textContent = sem + ' min';
    rMes.textContent = dur(sem * 4);
  }
  if (veces && mins) {
    [veces, mins].forEach(function (el) { el.addEventListener('input', calcular); });
    d.querySelectorAll('[data-paso]').forEach(function (b) {
      b.addEventListener('click', function () {
        var el = d.getElementById(b.dataset.para), max = +el.max || 999;
        el.value = Math.max(0, Math.min(max, num(el, max) + Number(b.dataset.paso)));
        calcular();
      });
    });
    d.getElementById('calc').addEventListener('submit', function (e) { e.preventDefault(); });
    calcular();
  }

  // Programa por pestañas (flechas, inicio y fin del teclado).
  var tabs = [].slice.call(d.querySelectorAll('.eje [role=tab]'));
  function elegir(i, foco) {
    tabs.forEach(function (t, j) {
      var on = i === j;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      d.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
    if (foco) tabs[i].focus();
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { elegir(i); });
    t.addEventListener('keydown', function (e) {
      var k = e.key, n = tabs.length;
      if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); elegir((i + 1) % n, true); }
      else if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); elegir((i - 1 + n) % n, true); }
      else if (k === 'Home') { e.preventDefault(); elegir(0, true); }
      else if (k === 'End') { e.preventDefault(); elegir(n - 1, true); }
    });
  });

  if (!('IntersectionObserver' in window)) return;

  // «Salís con»: se enciende la entrega que cruza el centro de la pantalla.
  var items = [].slice.call(d.querySelectorAll('.entrega'));
  var io1 = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) { items.forEach(function (x) { x.classList.toggle('activa', x === e.target); }); }
    });
  }, { rootMargin: '-42% 0px -42% 0px' });
  items.forEach(function (x) { io1.observe(x); });

  // Fotos: descubrimiento una sola vez. Se observa el contenedor (un elemento recortado no cruza el umbral).
  if (!reduce) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target._foto.classList.add('in'); io2.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    d.querySelectorAll('.salis-foto, .cuenta-foto, .retrato, .cierre-foto').forEach(function (f) {
      var host = f.closest('section'), r = f.getBoundingClientRect();
      if (r.top > innerHeight) { f.classList.add('rv'); host._foto = f; io2.observe(host); }
    });
  }
})();
