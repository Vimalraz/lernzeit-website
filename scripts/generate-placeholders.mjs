// Generates placeholder SVG imagery for products, blog covers and behind-the-scenes
// shots. Rerun after adding products: node scripts/generate-placeholders.mjs
// Replace any file with a real .jpg/.png later and update the JSON path.
import fs from "fs";
import path from "path";

const root = process.cwd();
const palettes = [
  { main: "#e05a3a", soft: "#fbe9e2", deep: "#bf4326" }, // persimmon
  { main: "#10695e", soft: "#e3efec", deep: "#0b4c44" }, // teal
  { main: "#e9a13b", soft: "#fdf3e2", deep: "#c17f21" }, // gold
];
const ink = "#1b1712";
const FONT = "Inter, 'Segoe UI', Arial, sans-serif";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function svgWrap(inner, w = 1200, h = 900) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${inner}</svg>`;
}

function miniCard(x, y, rot, w, h, fill, label, labelFill) {
  return `<g transform="translate(${x} ${y}) rotate(${rot})">
    <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="26" fill="${fill}" stroke="rgba(27,23,18,0.08)" stroke-width="2"/>
    <text x="0" y="18" text-anchor="middle" font-family="${FONT}" font-size="112" font-weight="700" fill="${labelFill}">${esc(label)}</text>
  </g>`;
}

/* Variant 1 — hero card on soft field */
function productShot1(p, pal) {
  const initial = p.title[0].toUpperCase();
  return svgWrap(`
  <rect width="1200" height="900" fill="${pal.soft}"/>
  <circle cx="1010" cy="140" r="220" fill="${pal.main}" opacity="0.12"/>
  <circle cx="150" cy="780" r="260" fill="${pal.main}" opacity="0.10"/>
  ${miniCard(600, 430, -4, 380, 500, "#ffffff", initial, ink)}
  <text x="600" y="800" text-anchor="middle" font-family="${FONT}" font-size="44" font-weight="600" fill="${ink}">${esc(p.title)}</text>
  <text x="600" y="848" text-anchor="middle" font-family="${FONT}" font-size="26" fill="${pal.deep}">lernzit · ${esc(p.age.label)}</text>`);
}

/* Variant 2 — fanned spread */
function productShot2(p, pal) {
  const letters = p.title.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  return svgWrap(`
  <rect width="1200" height="900" fill="#faf7f1"/>
  <rect x="0" y="620" width="1200" height="280" fill="${pal.soft}"/>
  ${miniCard(390, 430, -12, 300, 400, pal.main, letters[0] ?? "L", "#ffffff")}
  ${miniCard(620, 400, 2, 300, 400, "#ffffff", letters[1] ?? "Z", ink)}
  ${miniCard(850, 440, 11, 300, 400, pal.deep, letters[2] ?? "T", "#ffffff")}
  <text x="600" y="820" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="600" fill="${ink}">${esc(p.comparison.cards)} cards · ${esc(p.comparison.focus)}</text>`);
}

/* Variant 3 — boxed set */
function productShot3(p, pal) {
  return svgWrap(`
  <rect width="1200" height="900" fill="${pal.main}"/>
  <circle cx="1060" cy="120" r="300" fill="#ffffff" opacity="0.08"/>
  <g transform="translate(600 430) rotate(-3)">
    <rect x="-260" y="-210" width="520" height="420" rx="36" fill="#ffffff"/>
    <rect x="-260" y="-210" width="520" height="120" rx="36" fill="${pal.soft}"/>
    <text x="0" y="-132" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="700" fill="${pal.deep}">lernzit</text>
    <text x="0" y="30" text-anchor="middle" font-family="${FONT}" font-size="52" font-weight="700" fill="${ink}">${esc(p.title)}</text>
    <text x="0" y="90" text-anchor="middle" font-family="${FONT}" font-size="30" fill="#5f574c">${esc(p.age.label)}</text>
    <rect x="-90" y="130" width="180" height="52" rx="26" fill="${pal.main}"/>
    <text x="0" y="164" text-anchor="middle" font-family="${FONT}" font-size="26" font-weight="600" fill="#ffffff">${esc(p.difficulty)}</text>
  </g>`);
}

function blogCover(title, pal, motif) {
  const motifs = {
    clock: `<circle cx="930" cy="300" r="150" fill="none" stroke="${pal.main}" stroke-width="16"/><path d="M930 220 v80 l60 40" stroke="${pal.main}" stroke-width="16" fill="none" stroke-linecap="round"/>`,
    cards: `${miniCard(880, 300, -8, 170, 230, pal.main, "A", "#fff")}${miniCard(1010, 320, 9, 170, 230, "#ffffff", "B", ink)}`,
    heart: `<path d="M930 400 c-80 -70 -140 -120 -140 -190 a80 80 0 0 1 140 -50 a80 80 0 0 1 140 50 c0 70 -60 120 -140 190z" fill="${pal.main}"/>`,
    steps: `<rect x="800" y="360" width="110" height="60" rx="14" fill="${pal.main}" opacity="0.45"/><rect x="880" y="290" width="110" height="60" rx="14" fill="${pal.main}" opacity="0.7"/><rect x="960" y="220" width="110" height="60" rx="14" fill="${pal.main}"/>`,
  };
  return svgWrap(`
  <rect width="1200" height="675" fill="${pal.soft}"/>
  <circle cx="120" cy="600" r="220" fill="${pal.main}" opacity="0.10"/>
  ${motifs[motif]}
  <text x="90" y="560" font-family="${FONT}" font-size="52" font-weight="700" fill="${ink}">${esc(title)}</text>
  <text x="90" y="615" font-family="${FONT}" font-size="26" fill="${pal.deep}">lernzit · learning hub</text>`, 1200, 675);
}

function storyShot(label, pal, idx) {
  const scenes = [
    `${miniCard(600, 360, -6, 260, 350, "#ffffff", "?", ink)}<circle cx="880" cy="560" r="90" fill="${pal.main}" opacity="0.25"/>`,
    `<rect x="300" y="250" width="600" height="380" rx="30" fill="#ffffff"/><line x1="360" y1="340" x2="840" y2="340" stroke="${pal.soft}" stroke-width="18" stroke-linecap="round"/><line x1="360" y1="420" x2="760" y2="420" stroke="${pal.soft}" stroke-width="18" stroke-linecap="round"/><line x1="360" y1="500" x2="800" y2="500" stroke="${pal.soft}" stroke-width="18" stroke-linecap="round"/>`,
    `${miniCard(480, 400, -10, 220, 300, pal.main, "1", "#fff")}${miniCard(720, 400, 8, 220, 300, "#ffffff", "2", ink)}`,
    `<circle cx="480" cy="400" r="130" fill="${pal.main}" opacity="0.85"/><circle cx="700" cy="400" r="130" fill="${pal.deep}" opacity="0.7"/><circle cx="590" cy="520" r="130" fill="${pal.soft}"/>`,
  ];
  return svgWrap(`
  <rect width="1200" height="900" fill="${idx % 2 ? "#faf7f1" : pal.soft}"/>
  ${scenes[idx % scenes.length]}
  <text x="600" y="800" text-anchor="middle" font-family="${FONT}" font-size="34" font-weight="600" fill="${ink}">${esc(label)}</text>`);
}

// ——— run ———
const outProducts = path.join(root, "public", "images", "products");
const outBlog = path.join(root, "public", "images", "blog");
const outStory = path.join(root, "public", "images", "story");
for (const d of [outProducts, outBlog, outStory]) fs.mkdirSync(d, { recursive: true });

const productFiles = fs
  .readdirSync(path.join(root, "content", "products"))
  .filter((f) => f.endsWith(".json"));

productFiles.forEach((file, i) => {
  const p = JSON.parse(fs.readFileSync(path.join(root, "content", "products", file), "utf8"));
  const pal = palettes[i % palettes.length];
  const shots = [productShot1(p, pal), productShot2(p, pal), productShot3(p, pal)];
  shots.forEach((svg, k) =>
    fs.writeFileSync(path.join(outProducts, `${p.slug}-${k + 1}.svg`), svg),
  );
});

const covers = [
  ["ten-minute-learning-ritual", "The ten-minute learning ritual", 0, "clock"],
  ["flashcards-science", "Why flashcards work: the science", 1, "cards"],
  ["screen-free-evenings", "Winning back screen-free evenings", 2, "heart"],
  ["school-readiness-checklist", "The gentle school-readiness checklist", 1, "steps"],
];
for (const [slug, title, palIdx, motif] of covers) {
  fs.writeFileSync(path.join(outBlog, `${slug}.svg`), blogCover(title, palettes[palIdx], motif));
}

const storyShots = [
  ["Sketching card concepts", 0],
  ["Choosing words that work", 1],
  ["Print & paper testing", 2],
  ["Family playtesting day", 1],
];
storyShots.forEach(([label, palIdx], i) => {
  fs.writeFileSync(path.join(outStory, `making-${i + 1}.svg`), storyShot(label, palettes[palIdx], i));
});

console.log(`Generated ${productFiles.length * 3} product shots, ${covers.length} blog covers, ${storyShots.length} story shots.`);
