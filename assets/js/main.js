/* VALIDATE consortium — small progressive enhancements. No dependencies.
   1. Mobile navigation toggle
   2. Member maps: inline the SVG files so the pins get tooltips, keyboard focus and a one-time entrance
   3. Dot-grid figure on the home page (592 models, 19% validated at least once, 9 validated twice or more)
   Everything degrades: without JS the maps show as static images and the figure keeps its caption. */
(function () {
  "use strict";

  /* ---------- 1. Navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Close" : "Menu";
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Menu";
      }
    });
  }

  /* ---------- 2. Member maps ---------- */
  var panels = document.querySelectorAll(".map-panel[data-svg]");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function inlineMap(panel) {
    var url = panel.getAttribute("data-svg");
    if (!window.fetch) return;
    fetch(url).then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); }).then(function (text) {
      var doc = new DOMParser().parseFromString(text, "image/svg+xml");
      var svg = doc.documentElement;
      if (!svg || svg.nodeName !== "svg") return;
      // drop any styles baked into the file; the page stylesheet styles the inline copy
      Array.prototype.forEach.call(svg.querySelectorAll("style"), function (s) { s.parentNode.removeChild(s); });
      var img = panel.querySelector("img");
      var node = document.importNode(svg, true);
      if (img) { panel.replaceChild(node, img); } else { panel.appendChild(node); }
      wirePins(panel, node);
    }).catch(function () { /* keep the static <img> */ });
  }

  function wirePins(panel, svg) {
    var pins = svg.querySelectorAll(".pin");
    var tip = document.createElement("div");
    tip.className = "map-tip";
    tip.setAttribute("role", "status");
    tip.hidden = true;
    panel.appendChild(tip);
    var active = null;

    function show(pin) {
      var city = pin.getAttribute("data-city") || "";
      var country = pin.getAttribute("data-country") || "";
      var inst = (pin.getAttribute("data-inst") || "").split("|");
      tip.innerHTML = "";
      var strong = document.createElement("strong");
      strong.textContent = city + ", " + country;
      tip.appendChild(strong);
      inst.forEach(function (name, i) {
        if (i) tip.appendChild(document.createElement("br"));
        tip.appendChild(document.createTextNode(name));
      });
      tip.hidden = false;
      // position above-right of the pin, flipped when near the panel's right edge
      var pr = panel.getBoundingClientRect();
      var dot = pin.querySelector(".pin-dot") || pin;
      var r = dot.getBoundingClientRect();
      var x = r.left - pr.left + r.width / 2;
      var y = r.top - pr.top;
      tip.style.left = "0px"; tip.style.top = "0px";
      var tw = tip.offsetWidth, th = tip.offsetHeight;
      var left = x + 12, top = y - th - 10;
      if (left + tw > pr.width - 8) left = x - tw - 12;
      if (left < 8) left = 8;
      if (top < 4) top = y + 18;
      tip.style.left = Math.round(left) + "px";
      tip.style.top = Math.round(top) + "px";
      if (active && active !== pin) active.classList.remove("is-active");
      pin.classList.add("is-active");
      active = pin;
    }
    function hide() {
      tip.hidden = true;
      if (active) { active.classList.remove("is-active"); active = null; }
    }

    Array.prototype.forEach.call(pins, function (pin, i) {
      pin.style.setProperty("--i", i);
      pin.addEventListener("mouseenter", function () { show(pin); });
      pin.addEventListener("mouseleave", hide);
      pin.addEventListener("focus", function () { show(pin); });
      pin.addEventListener("blur", hide);
      pin.addEventListener("click", function (e) {
        e.preventDefault();
        if (active === pin && !tip.hidden) { hide(); } else { show(pin); }
      });
      pin.addEventListener("keydown", function (e) { if (e.key === "Escape") { hide(); pin.blur(); } });
    });
    document.addEventListener("click", function (e) { if (!panel.contains(e.target)) hide(); });

    if (!reduceMotion) {
      panel.classList.add("pins-animate");
      // let the entrance play once, then drop the class so the dots never replay
      setTimeout(function () { panel.classList.remove("pins-animate"); }, 2200);
    }
  }

  Array.prototype.forEach.call(panels, inlineMap);

  /* ---------- 3. Dot grid ---------- */
  var grid = document.getElementById("dotgrid");
  if (grid) {
    var n = 100, once = 17, twice = 2; // 112 of 592 validated at least once (18.9%) incl. 9 validated twice or more (1.5%)
    var cells = [];
    for (var i = 0; i < n; i++) cells.push("");
    // fixed-seed shuffle so the scatter is the same on every visit
    var seed = 20250910;
    function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
    var idx = [];
    for (var j = 0; j < n; j++) idx.push(j);
    for (var k = n - 1; k > 0; k--) { var m = Math.floor(rnd() * (k + 1)); var t = idx[k]; idx[k] = idx[m]; idx[m] = t; }
    for (var a = 0; a < twice; a++) cells[idx[a]] = "on on2";
    for (var b = twice; b < twice + once; b++) cells[idx[b]] = "on";
    var frag = document.createDocumentFragment();
    cells.forEach(function (cls) { var s = document.createElement("span"); if (cls) s.className = cls; frag.appendChild(s); });
    grid.appendChild(frag);
  }
})();
