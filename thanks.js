// Post-download page: starts the right installer and shows first-launch help.
//
// Asset names contain the version (Calmoniq-1.2.1-arm64.dmg), so a static link
// would break on every release. Instead we ask the GitHub API for the latest
// release and pick the asset that matches the visitor's OS. If anything fails
// we fall back to the releases page, which always works.
(function () {
  var API = "https://api.github.com/repos/Jasongayle/calmoniq-desktop-releases/releases/latest";
  var RELEASES = "https://github.com/Jasongayle/calmoniq-desktop-releases/releases/latest";

  var ua = navigator.userAgent;
  var plat = navigator.platform || "";
  var isWindows = /Win/.test(plat) || /Windows/.test(ua);
  var isMac = !isWindows && (/Mac/.test(plat) || /Mac OS X/.test(ua));
  // ?os=mac / ?os=windows lets the buttons on the site force a platform.
  var forced = (location.search.match(/[?&]os=(mac|windows)/) || [])[1];
  if (forced === "mac") { isMac = true; isWindows = false; }
  if (forced === "windows") { isWindows = true; isMac = false; }

  var os = isWindows ? "windows" : "mac"; // default to Mac for other platforms
  var $ = function (id) { return document.getElementById(id); };

  // Show the matching first-launch steps.
  var stepsMac = $("steps-mac"), stepsWin = $("steps-windows");
  if (stepsMac && stepsWin) {
    stepsMac.hidden = os !== "mac";
    stepsWin.hidden = os !== "windows";
  }
  var otherLink = $("other-os");
  if (otherLink) {
    otherLink.textContent = os === "mac" ? "Using Windows instead?" : "Using a Mac instead?";
    otherLink.href = "thanks.html?os=" + (os === "mac" ? "windows" : "mac");
  }

  function pick(assets) {
    var dmgArm = null, dmgIntel = null, exe = null;
    for (var i = 0; i < assets.length; i++) {
      var n = (assets[i].name || "").toLowerCase();
      if (n.indexOf("arm64") > -1 && /\.dmg$/.test(n)) dmgArm = assets[i];
      else if (/\.dmg$/.test(n)) dmgIntel = assets[i];
      else if (/\.exe$/.test(n)) exe = assets[i];
    }
    if (os === "windows") return { main: exe, alt: null };
    // Apple Silicon can't be detected reliably in a browser, so default to it
    // (most Macs sold since 2020) and offer Intel as a visible alternative.
    return { main: dmgArm || dmgIntel, alt: dmgArm ? dmgIntel : null };
  }

  function mb(bytes) { return Math.round((bytes || 0) / 1048576) + " MB"; }

  function start(url) {
    var a = document.createElement("a");
    a.href = url;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (window.cqTrack) window.cqTrack("download-" + os);
  }

  fetch(API, { headers: { Accept: "application/vnd.github+json" } })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (rel) {
      var got = pick(rel.assets || []);
      if (!got.main) throw new Error("no asset");

      var label = os === "windows" ? "for Windows" : "for Mac (Apple Silicon)";
      var meta = $("file-meta");
      if (meta) meta.textContent = "Calmoniq " + String(rel.tag_name || "").replace(/^v/, "") +
        " " + label + " · " + mb(got.main.size);

      var again = $("download-again");
      if (again) { again.href = got.main.browser_download_url; again.hidden = false; }

      var altWrap = $("alt-download");
      if (altWrap && got.alt) {
        altWrap.hidden = false;
        var altLink = $("alt-download-link");
        altLink.href = got.alt.browser_download_url;
        altLink.textContent = "Using an Intel Mac? Download that version (" + mb(got.alt.size) + ")";
      }

      setTimeout(function () { start(got.main.browser_download_url); }, 700);
    })
    .catch(function () {
      var meta = $("file-meta");
      if (meta) meta.textContent = "Choose your installer on the releases page.";
      var again = $("download-again");
      if (again) { again.href = RELEASES; again.hidden = false; again.textContent = "Go to downloads"; }
    });
})();
