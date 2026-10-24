/* Selector A/B/C (también ?d=a|b|c) y estado local del botón. Sin red ni medición de visitas. */
(function () {
  var dirs = ['a', 'b', 'c'];
  var btns = document.querySelectorAll('[data-dir-btn]');
  var mains = document.querySelectorAll('[data-dir-main]');

  function show(d, push) {
    if (dirs.indexOf(d) < 0) d = 'a';
    document.body.setAttribute('data-dir', d);
    mains.forEach(function (m) { m.hidden = m.getAttribute('data-dir-main') !== d; });
    btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-dir-btn') === d)); });
    if (push) {
      try { var u = new URL(location.href); u.searchParams.set('d', d); history.replaceState(null, '', u); } catch (e) {}
    }
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () { show(b.getAttribute('data-dir-btn'), true); });
  });
  var q = new URLSearchParams(location.search).get('d');
  show(q ? q.toLowerCase() : 'a', false);

  var dlg = document.getElementById('estado');
  var cerrar = document.getElementById('estado-cerrar');
  var last = null;
  document.querySelectorAll('.js-cta').forEach(function (b) {
    b.addEventListener('click', function () {
      last = b;
      if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    });
  });
  function close() { if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); if (last) last.focus(); }
  cerrar.addEventListener('click', close);
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
})();
