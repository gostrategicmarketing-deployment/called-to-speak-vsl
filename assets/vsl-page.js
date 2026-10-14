document.addEventListener('DOMContentLoaded', function () {
  var C = window.CTS;
  var grid = document.getElementById('retreat');
  (C.retreatPhotos || []).forEach(function (src) {
    var d = document.createElement('div');
    d.setAttribute('role', 'img'); d.setAttribute('aria-label', 'Untamed retreat');
    d.style.cssText = 'aspect-ratio:4/3;border-radius:12px;background:#1C161A center/cover no-repeat;background-image:url(' + src + ')';
    grid.insertBefore(d, grid.firstChild);
  });
  var bar = document.getElementById('stickyBar'), hero = document.getElementById('heroCta');
  if (bar && hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { bar.classList.toggle('on', !e[0].isIntersecting && e[0].boundingClientRect.top < 0); }).observe(hero);
  }
  document.querySelectorAll('a[href="apply/"]').forEach(function (a) {
    a.addEventListener('click', function () { C.track('ViewContent', { content_name: 'VSL CTA click' }); });
  });
});
