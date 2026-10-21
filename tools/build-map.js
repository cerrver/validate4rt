// Builds two inline SVG maps for the VALIDATE site:
//   membermap-world.svg  — Natural Earth 1 projection, Natural Earth 110m land (lightly simplified)
//   membermap-europe.svg — conic equal-area Europe panel, Natural Earth 50m land (simplified)
// Pins = member cities. Each pin carries data-* attributes used by assets/js/main.js for tooltips,
// a <title> for native tooltips, and tabindex for keyboard access.
const fs = require("fs");
const d3 = require("d3-geo");
const topojson = require("topojson-client");
const ts = require("topojson-simplify");

function simplifiedLand(file, q, islandFactor) {
  let t = ts.presimplify(JSON.parse(JSON.stringify(require(file))));
  const w = ts.quantile(t, q);
  t = ts.simplify(t, w);
  t = ts.filter(t, ts.filterAttachedWeight(t, w * islandFactor));
  return topojson.feature(t, t.objects.land);
}

const cities = [
  { id: "new-york", city: "New York", country: "USA", ll: [-74.006, 40.713], inst: ["Memorial Sloan Kettering Cancer Center"] },
  { id: "houston", city: "Houston", country: "USA", ll: [-95.370, 29.760], inst: ["The University of Texas MD Anderson Cancer Center"] },
  { id: "tampa", city: "Tampa", country: "USA", ll: [-82.457, 27.951], inst: ["Moffitt Cancer Center"] },
  { id: "philadelphia", city: "Philadelphia", country: "USA", ll: [-75.165, 39.953], inst: ["University of Pennsylvania"] },
  { id: "ann-arbor", city: "Ann Arbor", country: "USA", ll: [-83.743, 42.281], inst: ["University of Michigan"] },
  { id: "toronto", city: "Toronto", country: "Canada", ll: [-79.383, 43.653], inst: ["Princess Margaret Cancer Centre"] },
  { id: "manchester", city: "Manchester", country: "United Kingdom", ll: [-2.244, 53.483], inst: ["The University of Manchester"], eu: true },
  { id: "groningen", city: "Groningen", country: "Netherlands", ll: [6.566, 53.219], inst: ["University Medical Center Groningen"], eu: true },
  { id: "amsterdam", city: "Amsterdam", country: "Netherlands", ll: [4.897, 52.370], inst: ["Netherlands Cancer Institute"], eu: true },
  { id: "milan", city: "Milan", country: "Italy", ll: [9.190, 45.464], inst: ["IRCCS Ospedale San Raffaele", "Fondazione IRCCS Istituto Nazionale dei Tumori"], eu: true },
  { id: "naples", city: "Naples", country: "Italy", ll: [14.268, 40.852], inst: ["CNR Institute of Biostructures and Bioimaging"], eu: true },
  { id: "barcelona", city: "Barcelona", country: "Spain", ll: [2.173, 41.385], inst: ["Vall d’Hebron Institute of Oncology"], eu: true },
  { id: "lund", city: "Lund", country: "Sweden", ll: [13.193, 55.705], inst: ["Lund University"], eu: true },
  { id: "stockholm", city: "Stockholm", country: "Sweden", ll: [18.069, 59.329], inst: ["Karolinska Institutet"], eu: true },
  { id: "copenhagen", city: "Copenhagen", country: "Denmark", ll: [12.568, 55.676], inst: ["Rigshospitalet and DTU Health Tech"], eu: true },
  { id: "odense", city: "Odense", country: "Denmark", ll: [10.403, 55.403], inst: ["Odense University Hospital"], eu: true },
  { id: "trondheim", city: "Trondheim", country: "Norway", ll: [10.396, 63.430], inst: ["Norwegian University of Science and Technology"], eu: true },
  { id: "perth", city: "Perth", country: "Australia", ll: [115.857, -31.953], inst: ["Sir Charles Gairdner Hospital and The University of Western Australia"] },
];
const nCountries = new Set(cities.map(c => c.country)).size;
const STYLE = `<style>.map-land{fill:#dde5ef}.map-euframe{fill:none;stroke:#002650;stroke-width:1;stroke-dasharray:3 2;opacity:.55}.map-frame{fill:none}.pin-dot{fill:#e9a400;stroke:#002650;stroke-width:1.5}.pin-halo{fill:#e9a400;opacity:.22}.pin-label{font:500 13px "IBM Plex Sans",Arial,sans-serif;fill:#002650;paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round}.membermap--world .pin--eu .pin-dot{r:3.5;stroke-width:1}.membermap--world .pin--eu .pin-halo{opacity:0}</style>\n`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const r1 = (n) => Math.round(n * 10) / 10;

function pin(x, y, c, cls, rHalo, rDot, label) {
  const tip = `${c.city}, ${c.country}: ${c.inst.join("; ")}`;
  let s = `<g class="pin${cls}" data-city="${esc(c.city)}" data-country="${esc(c.country)}" data-inst="${esc(c.inst.join("|"))}" tabindex="0" transform="translate(${x},${y})" aria-label="${esc(tip)}"><title>${esc(tip)}</title><g class="pin-g"><circle class="pin-halo" r="${rHalo}"/><circle class="pin-dot" r="${rDot}"/></g>`;
  if (label) s += `<text class="pin-label" x="${label[0]}" y="${label[1]}" text-anchor="${label[2]}">${esc(c.city)}</text>`;
  return s + `</g>\n`;
}

// ---------- World map ----------
const W = 960;
const world = d3.geoNaturalEarth1().rotate([-12, 0]).fitWidth(W, { type: "Sphere" });
const xL = world([-130, 45])[0], xR = world([158, -34])[0];
const yT = world([0, 78])[1], yB = world([0, -46])[1];
const vb = [r1(xL), r1(yT), r1(xR - xL), r1(yB - yT)];
const wpath = d3.geoPath(world).digits(1);
const landW = simplifiedLand("world-atlas/land-110m.json", 0.35, 6);
let w = `<svg class="membermap membermap--world" viewBox="${vb.join(" ")}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="mapw-title mapw-desc">\n`;
w += `<title id="mapw-title">World map of VALIDATE member institutions</title>\n`;
w += `<desc id="mapw-desc">Member institutions in ${cities.length} cities across ${nCountries} countries in North America, Europe and Australia; the European members are enlarged in the adjacent panel. The full list is in the Members section.</desc>\n`;
w += STYLE;
w += `<path class="map-land" d="${wpath(landW)}"/>\n`;
// outline of the Europe panel region on the world map
// d3-geo wants exterior rings wound clockwise (interior on the right); counter-clockwise = the complement
const euBox = { type: "Polygon", coordinates: [[[-13, 34.5], [-13, 67], [31, 67], [31, 34.5], [-13, 34.5]]] };
w += `<path class="map-euframe" d="${wpath(euBox)}"/>\n`;
w += `<g class="map-pins">\n`;
for (const c of cities) {
  const [x, y] = world(c.ll).map(r1);
  w += pin(x, y, c, c.eu ? " pin--eu" : "", 12, 5.5, null);
}
w += `</g>\n</svg>\n`;
fs.writeFileSync("membermap-world.svg", w);

// ---------- Europe panel ----------
const IW = 420, IH = 400;
const eu = d3.geoConicEqualArea().parallels([40, 62]).rotate([-9, 0]).fitSize([IW, IH], euBox).clipExtent([[0, 0], [IW, IH]]);
const epath = d3.geoPath(eu).digits(1);
const landE = simplifiedLand("world-atlas/land-50m.json", 0.22, 5);
let e = `<svg class="membermap membermap--europe" viewBox="0 0 ${IW} ${IH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="mape-title mape-desc">\n`;
e += `<title id="mape-title">European VALIDATE member institutions</title>\n`;
e += `<desc id="mape-desc">Enlarged view of the European member cities: Manchester, Groningen, Amsterdam, Milan, Naples, Barcelona, Lund, Stockholm, Copenhagen, Odense and Trondheim.</desc>\n`;
e += STYLE;
e += `<rect class="map-frame" x="0.5" y="0.5" width="${IW - 1}" height="${IH - 1}"/>\n`;
e += `<path class="map-land" d="${epath(landE)}"/>\n`;
e += `<g class="map-pins">\n`;
// label offsets (dx, dy, anchor), chosen so labels do not collide
const off = {
  manchester: [-11, 5, "end"], groningen: [11, 9, "start"], amsterdam: [-11, 13, "end"], milan: [11, 5, "start"],
  naples: [11, 5, "start"], barcelona: [11, 5, "start"], lund: [11, 5, "start"], stockholm: [11, 5, "start"],
  copenhagen: [-11, -3, "end"], odense: [-11, 15, "end"], trondheim: [11, 5, "start"],
};
const nudge = { copenhagen: -2.5, lund: 2.5 }; // horizontal displacement (panel units, ≈15 km) so the two dots do not merge
for (const c of cities.filter(c => c.eu)) {
  let [x, y] = eu(c.ll).map(r1);
  x = r1(x + (nudge[c.id] || 0));
  e += pin(x, y, c, "", 12, 5, off[c.id]);
}
e += `</g>\n</svg>\n`;
fs.writeFileSync("membermap-europe.svg", e);
fs.writeFileSync("cities.json", JSON.stringify(cities, null, 1));
console.log("world viewBox", vb, "bytes", w.length, "| europe bytes", e.length, "| cities", cities.length, "countries", nCountries);
// print europe pin coords for a sanity check
for (const c of cities.filter(c => c.eu)) console.log(c.id, eu(c.ll).map(r1));
