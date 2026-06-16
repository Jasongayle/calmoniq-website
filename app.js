// Calmoniq marketing site — small enhancements, no tracking.
(function () {
  var REPO = "https://github.com/Jasongayle/calmoniq-desktop-releases/releases/latest/download";
  var RELEASES = "https://github.com/Jasongayle/calmoniq-desktop-releases/releases/latest";

  // Point the primary download button at the right installer for the visitor's OS.
  var ua = navigator.userAgent;
  var plat = navigator.platform || "";
  var btn = document.getElementById("primary-download");
  var note = document.getElementById("os-note");
  var isWindows = /Win/.test(plat) || /Windows/.test(ua);
  var isMac = /Mac/.test(plat) || /Mac OS X/.test(ua);
  // Apple Silicon is hard to detect reliably; offer the universal download page
  // for Mac so the visitor picks the right chip, direct-link Windows.
  if (btn) {
    if (isWindows) {
      btn.href = REPO + "/Calmoniq.Setup.1.0.0.exe";
      btn.textContent = "Download for Windows";
      if (note) note.textContent = "Windows 11/10 (64-bit) · 14-day money-back guarantee";
    } else if (isMac) {
      btn.href = RELEASES;
      btn.textContent = "Download for Mac";
      if (note) note.textContent = "Choose Apple Silicon (M1–M4) or Intel on the next page · 14-day money-back guarantee";
    }
  }

  // CASL-compliant newsletter form. If NEWSLETTER_ENDPOINT hasn't been wired
  // to a real provider yet, fall back to a mailto so no signup is ever lost.
  var form = document.getElementById("newsletter-form");
  var msg = document.getElementById("newsletter-msg");
  if (form) {
    form.addEventListener("submit", function (e) {
      var endpoint = form.getAttribute("action");
      if (!endpoint || endpoint === "NEWSLETTER_ENDPOINT") {
        e.preventDefault();
        var email = (form.querySelector('input[name="email"]') || {}).value || "";
        window.location.href =
          "mailto:hello@calmoniq.com?subject=Newsletter%20signup&body=" +
          encodeURIComponent("Please add me to the Calmoniq newsletter: " + email);
        if (msg) {
          msg.hidden = false;
          msg.className = "form-msg ok";
          msg.textContent = "Thanks! Confirm in your email app to finish.";
        }
      }
      // When a real endpoint is set, the form posts normally to the provider.
    });
  }

  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
