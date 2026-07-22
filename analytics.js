// Calmoniq site analytics - privacy friendly, cookieless, no personal data.
//
// SETUP (one value needed):
//   1. Sign up free at https://www.goatcounter.com and pick a site code.
//   2. Put that code in SITE_CODE below, e.g. "calmoniq".
// Until SITE_CODE is set this file does nothing at all, so the site works
// exactly as before and no requests are made.
//
// GoatCounter is used because it is free, open source, sets no cookies, stores
// no personal data and needs no consent banner under GDPR/PIPEDA. It also
// supports custom events, which we use to count downloads and signups.
(function () {
  var SITE_CODE = ""; // <-- put your GoatCounter code here

  // window.cqTrack("download-mac") records a named event. Safe to call before
  // (or without) analytics being configured - it just no-ops.
  window.cqTrack = function (name) {
    try {
      if (window.goatcounter && window.goatcounter.count) {
        window.goatcounter.count({ path: name, title: name, event: true });
      }
    } catch (e) {}
  };

  if (!SITE_CODE) return;

  var s = document.createElement("script");
  s.async = true;
  s.src = "//gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter", "https://" + SITE_CODE + ".goatcounter.com/count");
  document.head.appendChild(s);
})();
