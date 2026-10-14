/* Called to Speak funnels: shared runtime. Config lives in config.js (window.CTS_CONFIG). */
(function () {
  var C = Object.assign({
    pixelId: '', webhook: '', calendarUrl: '', bookedUrl: '',
    vslVideoUrl: '', welcomeVideoUrl: '', privacyUrl: '', chapterPdfUrl: '',
    portraitUrl: '', retreatPhotos: [], academyCohort: '', challengeDates: '',
    showFox2: false, showWotY: false, scarcity: ''
  }, window.CTS_CONFIG || {});
  window.CTS = C;

  C.qs = function (k) { try { return new URLSearchParams(location.search).get(k) || ''; } catch (e) { return ''; } };
  C.store = {
    get: function (k) { try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  if (C.pixelId) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', C.pixelId); fbq('track', 'PageView');
  }
  C.track = function (name, params, custom) {
    if (!window.fbq) return;
    try { (custom ? fbq('trackCustom', name, params || {}) : fbq('track', name, params || {})); } catch (e) {}
  };

  /* POST JSON to the GHL inbound webhook. Silent on failure: the funnel must never block on it. */
  C.post = function (payload) {
    if (!C.webhook) return;
    try {
      fetch(C.webhook, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), keepalive: true }).catch(function () {});
    } catch (e) {}
  };

  C.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* Calendar embed with contact prefill (GHL widgets read these params). */
  C.mountCalendar = function (el, who) {
    if (!el) return;
    if (!C.calendarUrl) { el.innerHTML = '<div class="ph">Booking calendar goes here. Set <b>calendarUrl</b> in config.js to the GoHighLevel calendar link.</div>'; return; }
    var u = C.calendarUrl + (C.calendarUrl.indexOf('?') > -1 ? '&' : '?');
    var p = [];
    who = who || {};
    ['first_name', 'last_name', 'email', 'phone'].forEach(function (k) { if (who[k]) p.push(k + '=' + encodeURIComponent(who[k])); });
    el.innerHTML = '<iframe title="Book your call" src="' + C.esc(u + p.join('&')) + '" loading="lazy"></iframe>';
  };

  /* Video slot: YouTube/Vimeo/Wistia/GHL embed URL, or a clear placeholder. */
  C.mountVideo = function (el, url, label) {
    if (!el) return;
    if (url) { el.innerHTML = '<iframe title="' + C.esc(label) + '" src="' + C.esc(url) + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>'; return; }
    el.innerHTML = '<div class="play"><svg width="34" height="34" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="#000"/></svg></div><div>[' + C.esc(label) + ']</div>';
  };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-privacy]').forEach(function (a) { if (C.privacyUrl) { a.href = C.privacyUrl; a.hidden = false; } });
    document.querySelectorAll('[data-flag]').forEach(function (n) { if (C[n.getAttribute('data-flag')]) n.hidden = false; });
    document.querySelectorAll('[data-cfg-text]').forEach(function (n) { var v = C[n.getAttribute('data-cfg-text')]; if (v) { n.textContent = v; n.hidden = false; } });
    document.querySelectorAll('[data-cfg-href]').forEach(function (n) { var v = C[n.getAttribute('data-cfg-href')]; if (v) { n.href = v; n.hidden = false; } });
    document.querySelectorAll('[data-video]').forEach(function (n) { C.mountVideo(n, C[n.getAttribute('data-video')], n.getAttribute('data-label') || 'Video'); });
    var portraits = document.querySelectorAll('[data-portrait]');
    portraits.forEach(function (n) { if (C.portraitUrl) { n.style.backgroundImage = 'url(' + C.portraitUrl + ')'; n.textContent = ''; } });
  });
})();
