const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const visualQueue = [
  'dashboard.svg', 'obd.svg', 'inventory.svg', 'work-order.svg',
  'mobile-app.svg', 'obd.svg', 'work-order.svg', 'mobile-app.svg',
];

const iconQueue = [
  ['bar-chart-3', 'users', 'map-pin'],
  ['radio', 'phone-outgoing', 'clipboard-list'],
  ['package', 'bookmark', 'triangle-alert'],
  ['user-cog', 'list-todo', 'trending-up'],
  ['car', 'smartphone', 'bell-ring'],
  ['scan-line', 'alert-circle', 'lightbulb'],
  ['map-pin', 'file-check-2', 'route'],
  ['calendar', 'credit-card', 'file-text'],
];

function visualBlock(svg) {
  return `<div class="seg-card__visual">
                            <div class="seg-card__visual-frame">
                              <div class="seg-card__visual-glow" aria-hidden="true"></div>
                              <img src="assets/icons/solution/${svg}" alt="" class="seg-card__visual-icon" width="120" height="120" loading="lazy">
                            </div>
                          </div>`;
}

function featuresFromList(listHtml, icons) {
  const keys = [...listHtml.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]);
  const items = keys.map((key, i) => `                              <li class="seg-card__feature">
                                <span class="seg-card__feature-icon" aria-hidden="true"><i data-lucide="${icons[i] || 'check'}"></i></span>
                                <span class="seg-card__feature-text" data-i18n="${key}"></span>
                              </li>`).join('\n');
  return `<ul class="seg-card__features">\n${items}\n                            </ul>`;
}

let listIdx = 0;
html = html.replace(/<ul class="seg-card__list">[\s\S]*?<\/ul>/g, (listHtml) => {
  const icons = iconQueue[listIdx] || iconQueue[iconQueue.length - 1];
  listIdx += 1;
  return featuresFromList(listHtml, icons);
});

let visualIdx = 0;
html = html.replace(/<div class="seg-card__visual">\s*<lottie-player[\s\S]*?<\/div>/g, () => {
  const svg = visualQueue[visualIdx] || visualQueue[visualQueue.length - 1];
  visualIdx += 1;
  return visualBlock(svg);
});

html = html.replace(
  /<span class="seg-card__label" data-i18n="([^"]+)">([^<]*)<\/span>/g,
  '<div class="seg-card__head"><span class="seg-card__label" data-i18n="$1">$2</span></div>'
);

html = html.replace(
  /<a href="#" class="seg-card__cta" data-i18n="([^"]+)">([^<]*)<\/a>/g,
  '<a href="#planes" class="seg-card__cta" data-i18n="$1">$2<i data-lucide="chevron-right" aria-hidden="true"></i></a>'
);

const navBlock = `
                    <div class="seg-card__nav">
                      <button type="button" class="seg-card__nav-btn" data-seg-prev aria-label="Anterior"><i data-lucide="chevron-left" aria-hidden="true"></i></button>
                      <span class="seg-card__nav-hint" data-i18n="segments.nav.hint">Cambia de paso con las flechas</span>
                      <button type="button" class="seg-card__nav-btn" data-seg-next aria-label="Siguiente"><i data-lucide="chevron-right" aria-hidden="true"></i></button>
                    </div>`;

html = html.replace(
  /(<div class="seg-card__slides">[\s\S]*?<\/div>\s*)(<\/div>\s*<\/article>)/g,
  `$1${navBlock}\n                  $2`
);

html = html.replace(/\s*<div class="segments__steps" aria-hidden="true">[\s\S]*?<\/div>\s*/g, '\n');

html = html.replace(
  '<section class="section segments section--light" id="segmentos">',
  '<section class="section segments section--light" id="segmentos" data-seg-root data-seg-active="b2b">'
);

html = html.replace(
  '<div class="segments__group is-active" id="segmentos-talleres" data-seg-panel="b2b">',
  `<div class="segments__group is-active" id="segmentos-talleres" data-seg-panel="b2b">
            <header class="segments__group-head">
              <span class="segments__group-badge segments__group-badge--b2b"><i data-lucide="wrench" aria-hidden="true"></i><span data-i18n="segments.tab.b2b">Talleres</span></span>
              <p class="segments__group-desc" data-i18n="segments.b2b.desc">Dueños, administradores y mecánicos de talleres de reparación automotriz.</p>
            </header>`
);

html = html.replace(
  '<div class="segments__group" id="segmentos-propietarios" data-seg-panel="b2c">',
  `<div class="segments__group" id="segmentos-propietarios" data-seg-panel="b2c">
            <header class="segments__group-head">
              <span class="segments__group-badge segments__group-badge--b2c"><i data-lucide="car" aria-hidden="true"></i><span data-i18n="segments.tab.b2c">Propietarios</span></span>
              <p class="segments__group-desc" data-i18n="segments.b2c.desc">Clientes finales que llevan su auto al taller y usan la app móvil.</p>
            </header>`
);

fs.writeFileSync(indexPath, html);
console.log('patched lists:', listIdx, 'visuals:', visualIdx);
