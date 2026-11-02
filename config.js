/* Called to Speak VSL funnel: config. Everything unconfirmed is OFF or empty by default (zero fabrication).
   Fill these in as Meghan supplies them. Never commit keys here; the webhook URL is a public inbound endpoint by design. */
window.CTS_CONFIG = {
  pixelId: '',            // Meta pixel ID (loads fbq and fires PageView + events when set)
  webhook: '',            // GHL inbound webhook URL; application answers POST here as JSON
  calendarUrl: '',        // GHL calendar widget URL for the VSL application path (set its post-booking redirect to /booked/)
  vslVideoUrl: '',        // embed URL for the ~22 min VSL (YouTube/Vimeo/Wistia/GHL)
  welcomeVideoUrl: '',    // embed URL for Meghan's 2 to 3 min welcome video on /booked/
  privacyUrl: '',         // Meghan's privacy policy URL (NONE EXISTS YET; link stays hidden until set)
  chapterPdfUrl: '',      // link to chapter 1 PDF (the gift card on /booked/ stays hidden until set)
  portraitUrl: '',        // real portrait of Meghan (never AI-generated)
  retreatPhotos: [],      // real Untamed 2.0 photos, with attendee consent
  academyCohort: '',      // e.g. "Next cohort Nov 10" once Meghan confirms (shown on the Academy card)
  challengeDates: '',     // next dates for the $33 challenge
  showFox2: false,        // VERIFIED 2026-11-02: 3 FOX 2 Detroit segments (see brand/verified-facts.md); turn on when Phil OKs
  showWotY: false,        // VERIFIED 2026-11-02 as "2025 Women of Birmingham" (Birmingham City Lifestyle honoree list), NOT Woman of the Year
  scarcity: ''            // only with a real number, e.g. "Limited to 4 private clients each quarter"
};
