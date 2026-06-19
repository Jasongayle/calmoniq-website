// Calmoniq marketing site — small enhancements, no tracking.
(function () {
  var RELEASES = "https://github.com/Jasongayle/calmoniq-desktop-releases/releases/latest";

  // Point the primary download button at the right OS. We send everyone to the
  // releases page (which lists Mac arm64/Intel + Windows) rather than a
  // hardcoded filename, so links never break when the version bumps.
  var ua = navigator.userAgent;
  var plat = navigator.platform || "";
  var btn = document.getElementById("primary-download");
  var note = document.getElementById("os-note");
  var isWindows = /Win/.test(plat) || /Windows/.test(ua);
  var isMac = /Mac/.test(plat) || /Mac OS X/.test(ua);
  if (btn) {
    btn.href = RELEASES;
    if (isWindows) {
      btn.textContent = "Download free for Windows";
      if (note) note.textContent = "Free · Windows 11/10 (64-bit) · no account needed";
    } else if (isMac) {
      btn.textContent = "Download free for Mac";
      if (note) note.textContent = "Free · choose Apple Silicon (M1–M4) or Intel on the next page · no account needed";
    }
  }

  // Newsletter → MailerLite. Posts directly to the form's subscribe endpoint
  // (data-ml-endpoint). no-cors means we can't read the response, so we assume
  // it's queued and rely on MailerLite's double opt-in email to confirm — which
  // is also what satisfies CASL express consent.
  var form = document.getElementById("newsletter-form");
  var msg = document.getElementById("newsletter-msg");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var endpoint = form.getAttribute("data-ml-endpoint");
      var emailInput = form.querySelector('input[type="email"]');
      var email = ((emailInput && emailInput.value) || "").trim();
      var consent = form.querySelector('input[name="consent"]');
      if (!email) return;
      if (consent && !consent.checked) {
        showMsg("err", "Please check the consent box to subscribe.");
        return;
      }
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Subscribing…"; }

      var fd = new FormData();
      fd.append("fields[email]", email);
      fd.append("ml-submit", "1");
      fd.append("anticsrf", "true");

      var finish = function () {
        showMsg(
          "ok",
          'Thanks! Check your inbox to confirm your subscription. ' +
          '<a href="assets/calmoniq-2026-canadian-tax-limits.pdf" target="_blank" rel="noopener">Download the 2026 guide →</a>'
        );
        form.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Subscribe & get the free guide"; }
      };
      fetch(endpoint, { method: "POST", body: fd, mode: "no-cors" }).then(finish, finish);
    });
  }
  function showMsg(kind, html) {
    if (!msg) return;
    msg.hidden = false;
    msg.className = "form-msg " + kind;
    msg.innerHTML = html;
  }

  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
