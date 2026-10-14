document.addEventListener('DOMContentLoaded', function () {
  var C = window.CTS, app = document.getElementById('app'), note = document.getElementById('hdrNote');
  var E = C.esc;
  var steps = [
    { key: 'role', type: 'single', title: 'Which best describes you?', options: [['Coach or consultant', 'coach'], ['Founder or CEO', 'founder'], ['Ministry leader or pastor', 'ministry'], ['Author, creative or wellness professional', 'creative'], ['Something else', 'other']] },
    { key: 'where', type: 'multi', title: 'Where do you speak today?', help: 'Choose all that apply.', options: [['Stages and events', 'stages'], ['Podcasts', 'podcasts'], ['Instagram or Facebook Lives', 'lives'], ['My own events or retreats', 'events'], ['Church or ministry', 'church'], ['TV or radio', 'media']] },
    { key: 'pain', type: 'single', title: 'Which sounds most like you when you speak right now?', options: [['People love my talks, but few become clients', 'noclients'], ['I’m in my head, managing how I’m coming across', 'performing'], ['I hold back the most powerful parts of my story', 'holdback'], ['I avoid talking about my offer so I don’t sound salesy', 'salesy']] },
    { key: 'calling', type: 'text', title: 'What do you sense the Holy Spirit is calling you to say, or to say more boldly?', placeholder: 'Write whatever comes to mind. There are no wrong answers.' },
    { key: 'revenue', type: 'single', title: 'What is your business’s current monthly revenue?', options: [['Under $5K', 'under5'], ['$5K to $10K', '5to10'], ['$10K to $25K', '10to25'], ['$25K to $50K', '25to50'], ['$50K+', '50plus']] },
    { key: 'why', type: 'single', title: 'Why is now the right time?', options: [['I have a stage, launch or big opportunity coming up', 'opportunity'], ['I’m tired of being the best-kept secret in my field', 'secret'], ['I feel God calling me to more, and I’m ready to say yes', 'calling'], ['I’m just exploring for now', 'exploring']] },
    { key: 'invest', type: 'single', title: 'This is a private, five-figure mentorship. If we’re a fit, are you in a position to invest in yourself right now?', options: [['Yes, I’m ready', 'yes'], ['Yes, with a payment plan', 'plan'], ['Not right now', 'no']] },
    { key: 'contact', type: 'contact', title: 'Last step. Where can Meghan reach you?', help: 'If you’re a fit, you’ll pick a time for your call on the next screen.' }
  ];
  var i = 0, answers = {}, labels = {}, multi = [], who = {}, started = false;

  function privacy() { return C.privacyUrl ? ' <a href="' + E(C.privacyUrl) + '">Privacy Policy</a>' : ''; }
  function setNote(t) { note.textContent = t; }
  function back() { return i > 0 ? '<button type="button" class="link-btn" data-back>Back</button>' : ''; }
  function head(s) {
    var pct = Math.round(((i + 1) / steps.length) * 100);
    return '<div class="prog"><span>Question ' + (i + 1) + ' of ' + steps.length + '</span><span>' + (i === 0 ? 'About 2 minutes' : pct + '% complete') + '</span></div>' +
      '<div class="bar" role="progressbar" aria-valuenow="' + pct + '" aria-valuemin="0" aria-valuemax="100"><i style="width:' + pct + '%"></i></div>' +
      '<div class="col g12"><h1 style="font-size:clamp(30px,4vw,46px);line-height:1.1">' + E(s.title) + '</h1>' + (s.help ? '<p class="mute-d">' + E(s.help) + '</p>' : '') + '</div>';
  }
  function frame(inner) { app.innerHTML = '<section class="stage"><div>' + inner + '</div></section>'; var h = app.querySelector('h1,h2'); if (h) { h.setAttribute('tabindex', '-1'); if (started) h.focus({ preventScroll: true }); } window.scrollTo(0, 0); started = true; }
  function go(n) { i = Math.max(0, Math.min(n, steps.length - 1)); multi = []; render(); }

  function render() {
    var s = steps[i];
    setNote('Application');
    if (s.type === 'single') {
      frame(head(s) + '<div class="opts">' + s.options.map(function (o, k) { return '<button type="button" class="opt" data-pick="' + k + '">' + E(o[0]) + '</button>'; }).join('') + '</div>' + back());
      app.querySelectorAll('[data-pick]').forEach(function (b) { b.onclick = function () { var o = s.options[+b.dataset.pick]; answers[s.key] = o[1]; labels[s.key] = o[0]; go(i + 1); }; });
    } else if (s.type === 'multi') {
      var cur = multi.length ? multi : (answers[s.key] || []);
      frame(head(s) + '<div class="opts">' + s.options.map(function (o, k) { var on = cur.indexOf(o[1]) > -1; return '<button type="button" class="opt" aria-pressed="' + on + '" data-tog="' + k + '"><span class="box"></span>' + E(o[0]) + '</button>'; }).join('') +
        '<div id="err"></div><button type="button" class="btn lg" data-cont style="margin-top:8px">Continue</button></div>' + back());
      multi = cur.slice();
      app.querySelectorAll('[data-tog]').forEach(function (b) { b.onclick = function () { var v = s.options[+b.dataset.tog][1], at = multi.indexOf(v); if (at > -1) multi.splice(at, 1); else multi.push(v); b.setAttribute('aria-pressed', at === -1); }; });
      app.querySelector('[data-cont]').onclick = function () {
        if (!multi.length) { document.getElementById('err').innerHTML = '<p class="err" role="alert">Choose at least one to continue.</p>'; return; }
        answers[s.key] = multi.slice(); labels[s.key] = s.options.filter(function (o) { return multi.indexOf(o[1]) > -1; }).map(function (o) { return o[0]; });
        go(i + 1);
      };
    } else if (s.type === 'text') {
      frame(head(s) + '<div class="form"><label>Your answer<textarea id="txt" rows="5" placeholder="' + E(s.placeholder) + '">' + E(answers[s.key] || '') + '</textarea></label>' +
        '<button type="button" class="btn lg" data-cont>Continue</button><button type="button" class="link-btn" data-skip style="align-self:center">Skip for now</button></div>' + back());
      app.querySelector('[data-cont]').onclick = function () { answers[s.key] = document.getElementById('txt').value.trim(); go(i + 1); };
      app.querySelector('[data-skip]').onclick = function () { go(i + 1); };
    } else {
      frame(head(s) + '<form class="form" id="f" novalidate>' +
        '<div class="row"><label>First name<input type="text" name="first_name" autocomplete="given-name" required value="' + E(who.first_name || '') + '"></label><label>Last name<input type="text" name="last_name" autocomplete="family-name" required value="' + E(who.last_name || '') + '"></label>' +
        '<label>Email<input type="email" name="email" autocomplete="email" required value="' + E(who.email || '') + '"></label><label>Phone<input type="tel" name="phone" autocomplete="tel" required value="' + E(who.phone || '') + '"></label></div>' +
        '<label>Instagram handle or website<input type="text" name="handle" value="' + E(who.handle || '') + '"></label>' +
        '<label class="consent"><input type="checkbox" name="sms">I agree to receive text messages about my call. Message and data rates may apply. Reply STOP to opt out.</label>' +
        '<figure class="card" style="background:transparent;border-color:var(--line);padding:20px 24px"><blockquote style="font-size:18px;color:var(--t-dark)">"You activate it in me, girl! Unlike anyone else (including pastors and priests)."</blockquote><figcaption style="font-size:14px;color:#9A9893;margin-top:8px">Katelyn Pennell, founder of Body Based Scaling</figcaption></figure>' +
        '<div id="err"></div><button type="submit" class="btn lg">Submit my application</button>' +
        '<p class="fine">Every application is read personally. We never sell your information.' + privacy() + '</p></form>' + back());
      app.querySelector('#f').onsubmit = function (ev) {
        ev.preventDefault();
        var f = ev.target, d = {};
        ['first_name', 'last_name', 'email', 'phone', 'handle'].forEach(function (k) { d[k] = f.elements[k].value.trim(); });
        d.sms = f.elements.sms.checked; who = d;
        var bad = !d.first_name || !d.last_name || !/^\S+@\S+\.\S+$/.test(d.email) || d.phone.replace(/\D/g, '').length < 7;
        if (bad) { document.getElementById('err').innerHTML = '<p class="err" role="alert">Please add your name, a valid email and your phone number.</p>'; return; }
        submit();
      };
    }
    var bk = app.querySelector('[data-back]'); if (bk) bk.onclick = function () { go(i - 1); };
  }

  function submit() {
    var notReady = answers.invest === 'no' || answers.revenue === 'under5';
    C.post({
      source: 'cts-vsl-application', submitted_at: new Date().toISOString(), page: location.href,
      first_name: who.first_name, last_name: who.last_name, email: who.email, phone: who.phone, instagram_or_website: who.handle, sms_consent: who.sms,
      answers: answers, answer_labels: labels, qualified: !notReady,
      tags: ['cts-vsl-application', notReady ? 'cts-vsl-not-ready' : 'cts-vsl-qualified'],
      utm: { source: C.qs('utm_source'), medium: C.qs('utm_medium'), campaign: C.qs('utm_campaign'), content: C.qs('utm_content'), term: C.qs('utm_term') }
    });
    C.track('SubmitApplication', { qualified: !notReady });
    if (!notReady) C.track('Lead', { content_name: 'VSL application qualified' });
    C.store.set('cts_apply', { first_name: who.first_name, last_name: who.last_name, email: who.email, phone: who.phone });
    notReady ? start() : calendar();
  }

  function calendar() {
    setNote('Book your call');
    app.innerHTML = '<section class="light sec" style="padding:64px 24px 96px"><div class="wrap-s col g24" style="max-width:880px"><div class="col c g12"><h1 style="font-size:clamp(40px,5vw,56px)">You’re a fit for a call. Pick a time.</h1><p class="mute" style="max-width:600px">A 45-minute conversation with Meghan about where your voice is now, where God is leading it, and whether working together makes sense.</p></div><div class="cal" id="cal"></div></div></section>';
    C.mountCalendar(document.getElementById('cal'), who);
    window.scrollTo(0, 0);
  }

  function start() {
    setNote('Your next step');
    var cohort = C.academyCohort ? '<p class="eyebrow">' + E(C.academyCohort) + '</p>' : '';
    var dates = C.challengeDates ? ' ' + E(C.challengeDates) : '';
    app.innerHTML = '<section class="light sec" style="padding:64px 24px 96px"><div class="wrap col g40" style="max-width:1040px"><div class="col c g12"><h1 style="font-size:clamp(40px,5vw,56px)">Thank you. Here’s the best place to start.</h1><p class="mute" style="max-width:640px">Private mentorship may not be the right step today, but the message God gave you still matters right now. These are the ways to start with Meghan’s method.</p></div>' +
      '<div class="grid g3" style="gap:20px">' +
      '<div class="card k col g16"><p class="eyebrow">Most popular</p><h3>Called to Speak Academy 2.0</h3><p style="color:var(--t-dark);flex-grow:1">Four live weeks to learn the 5 S’s of Spirit-Led Storytelling in a small group.</p>' + cohort + '<p style="font-size:28px;font-weight:700">$1,999</p><a class="btn" href="https://apricity.myflodesk.com/hnvf9k12ar">Join the Academy</a></div>' +
      '<div class="card col g16"><p class="eyebrow">Read first</p><h3>Called to Speak, the book</h3><p class="mute" style="flex-grow:1">Meghan’s guide to Spirit-Led Storytelling, in paperback and Kindle.</p><p style="font-size:28px;font-weight:700">From $8.88</p><a class="btn out" href="https://www.amazon.com/dp/B0H7PR1XRG">Get the book</a></div>' +
      '<div class="card col g16"><p class="eyebrow">Try it</p><h3>Activate Your Holy Voice</h3><p class="mute" style="flex-grow:1">An 11-day guided challenge on Telegram.' + dates + '</p><p style="font-size:28px;font-weight:700">$33</p><a class="btn out" href="https://apricity.myflodesk.com/h0u5xummqr">Join the challenge</a></div>' +
      '</div></div></section>';
    window.scrollTo(0, 0);
  }

  render();
});
