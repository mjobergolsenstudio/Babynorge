const https = require('https');
const fs = require('fs');
const path = require('path');

const DOMAIN = 'https://babynorge.no';

// =============================================
// BUTIKKER PER KATEGORI
// Bytt ut href med Adtraction-lenker nar du far det opp
// =============================================
const BUTIKKER = {
  'Sovn': [
    { navn: 'Babysam', emoji: '🛍️', beskrivelse: 'Stort utvalg soveposer, babynest og soveutstyr', kode: 'BABY10', rabatt: '10% rabatt', href: 'https://www.babysam.no' },
    { navn: 'Jollyroom', emoji: '🌟', beskrivelse: 'Gode priser pa babymøbler og sengeutstyr', kode: 'JR5', rabatt: '5% pa alt', href: 'https://www.jollyroom.no' },
  ],
  'Mat og amming': [
    { navn: 'Medela', emoji: '🍼', beskrivelse: 'Verdensledende brystpumper og ammeutstyr', kode: 'MEDELA10', rabatt: '10% rabatt', href: 'https://www.medela.com/no' },
    { navn: 'Adams Matkasse', emoji: '🥗', beskrivelse: 'Enkel middagsplanlegging for smaabarnsfamilier', kode: 'BABYNORGE', rabatt: 'Opptil 50% pa forste kasse', href: 'https://www.adamsmatkasse.no' },
  ],
  'Mat': [
    { navn: 'Adams Matkasse', emoji: '🥗', beskrivelse: 'Ferske ravaarer og enkle oppskrifter levert hjem', kode: 'BABYNORGE', rabatt: 'Opptil 50% pa forste kasse', href: 'https://www.adamsmatkasse.no' },
    { navn: 'Babysam', emoji: '🛍️', beskrivelse: 'Alt av babymat, skjeer og matingsutstyr', kode: 'BABY10', rabatt: '10% rabatt', href: 'https://www.babysam.no' },
  ],
  'Klar': [
    { navn: 'Babyshop', emoji: '👶', beskrivelse: 'Skandinavisk design og kvalitetsklaar for barn', kode: 'FRAKT499', rabatt: 'Gratis frakt over 499 kr', href: 'https://www.babyshop.com/no' },
    { navn: 'Name It', emoji: '🧸', beskrivelse: 'Populaere barneklaar i god kvalitet', kode: 'NAME20', rabatt: '20% rabatt', href: 'https://www.nameit.com/no' },
  ],
  'Helse': [
    { navn: 'Apotek 1', emoji: '💊', beskrivelse: 'Vitaminer, babypleie og helseprodukter', kode: null, rabatt: '15% pa babypleie', href: 'https://www.apotek1.no' },
    { navn: 'Babysam', emoji: '🛍️', beskrivelse: 'Babystell, hudpleie og helseutstyr', kode: 'BABY10', rabatt: '10% rabatt', href: 'https://www.babysam.no' },
  ],
  'Sikkerhet': [
    { navn: 'BabyDan', emoji: '🚼', beskrivelse: 'Dansk kvalitet innen barnesikring og grinder', kode: 'DANFRI', rabatt: 'Gratis frakt', href: 'https://www.babydan.com/no' },
    { navn: 'Babysam', emoji: '🛍️', beskrivelse: 'Bilseter, babysikring og trygghetsutstyr', kode: 'BABY10', rabatt: '10% rabatt', href: 'https://www.babysam.no' },
  ],
  'Sommer': [
    { navn: 'Babysam', emoji: '🛍️', beskrivelse: 'Solhatter, UV-drakter og sommerleker', kode: 'BABY10', rabatt: '10% rabatt', href: 'https://www.babysam.no' },
    { navn: 'Babyshop', emoji: '👶', beskrivelse: 'Sommerkolleksjon for de minste', kode: 'FRAKT499', rabatt: 'Gratis frakt over 499 kr', href: 'https://www.babyshop.com/no' },
  ],
  'Reise': [
    { navn: 'Jollyroom', emoji: '🌟', beskrivelse: 'Reisesenger, bareseler og reiseutstyr', kode: 'JR5', rabatt: '5% pa alt', href: 'https://www.jollyroom.no' },
    { navn: 'Babysam', emoji: '🛍️', beskrivelse: 'Alt du trenger for reise med baby', kode: 'BABY10', rabatt: '10% rabatt', href: 'https://www.babysam.no' },
  ],
  'Utstyr': [
    { navn: 'Jollyroom', emoji: '🌟', beskrivelse: 'Stort utvalg vogner, bareseler og tilbehor', kode: 'JR5', rabatt: '5% pa alt', href: 'https://www.jollyroom.no' },
    { navn: 'Babysam', emoji: '🛍️', beskrivelse: 'Norges storste babybutikk', kode: 'BABY10', rabatt: '10% rabatt', href: 'https://www.babysam.no' },
  ],
  'Baby': [
    { navn: 'Babysam', emoji: '🛍️', beskrivelse: 'Alt du trenger til den nye babyen', kode: 'BABY10', rabatt: '10% rabatt', href: 'https://www.babysam.no' },
    { navn: 'Babyshop', emoji: '👶', beskrivelse: 'Kvalitetsutstyr og klaar for de minste', kode: 'FRAKT499', rabatt: 'Gratis frakt over 499 kr', href: 'https://www.babyshop.com/no' },
  ],
  'Graviditet': [
    { navn: 'Apotek 1', emoji: '💊', beskrivelse: 'Folsyre, vitaminer og graviditetsprodukter', kode: null, rabatt: '15% pa graviditetsprodukter', href: 'https://www.apotek1.no' },
    { navn: 'Babysam', emoji: '🛍️', beskrivelse: 'Mammakjoler, amme-BH og graviditetsklaar', kode: 'BABY10', rabatt: '10% rabatt', href: 'https://www.babysam.no' },
  ],
  'Utvikling': [
    { navn: 'Babysam', emoji: '🛍️', beskrivelse: 'Pedagogiske leker og utviklingsverktoy', kode: 'BABY10', rabatt: '10% rabatt', href: 'https://www.babysam.no' },
    { navn: 'Jollyroom', emoji: '🌟', beskrivelse: 'Leker og aktiviteter for alle aldre', kode: 'JR5', rabatt: '5% pa alt', href: 'https://www.jollyroom.no' },
  ],
};

const DEFAULT_BUTIKKER = [
  { navn: 'Babysam', emoji: '🛍️', beskrivelse: 'Norges storste babybutikk', kode: 'BABY10', rabatt: '10% rabatt', href: 'https://www.babysam.no' },
  { navn: 'Jollyroom', emoji: '🌟', beskrivelse: 'Stort utvalg til gode priser', kode: 'JR5', rabatt: '5% pa alt', href: 'https://www.jollyroom.no' },
];

function lagAffiliateBlokk(kategori) {
  const butikker = BUTIKKER[kategori] || DEFAULT_BUTIKKER;
  const kortHTML = butikker.map(b =>
    '<div style="background:#fdf8f3;border:1px solid #e8ddd4;border-radius:12px;padding:1rem;display:flex;flex-direction:column;gap:0.5rem;">' +
    '<div style="display:flex;align-items:center;gap:0.6rem;"><span style="font-size:1.5rem;">' + b.emoji + '</span>' +
    '<div><div style="font-weight:800;font-size:0.95rem;">' + b.navn + '</div>' +
    '<div style="font-size:0.75rem;color:#8a7060;">' + b.beskrivelse + '</div></div></div>' +
    (b.kode
      ? '<div style="background:#fff;border:1.5px dashed #e8ddd4;border-radius:8px;padding:0.4rem 0.75rem;font-family:monospace;font-weight:800;font-size:0.95rem;letter-spacing:0.06em;">🏷️ ' + b.kode + ' — ' + b.rabatt + '</div>'
      : '<div style="font-size:0.82rem;color:#1a6b2e;font-weight:700;">✅ ' + b.rabatt + ' — ingen kode nodvendig</div>') +
    '<a href="' + b.href + '" target="_blank" rel="noopener" style="display:block;text-align:center;background:#c4714a;color:#fff;font-weight:800;font-size:0.85rem;padding:0.6rem;border-radius:8px;text-decoration:none;">Ga til ' + b.navn + ' →</a>' +
    '</div>'
  ).join('');

  return '<div style="background:#fff;border:1px solid #e8ddd4;border-radius:16px;padding:1.5rem;margin:2.5rem 0;">' +
    '<h3 style="font-family:serif;font-size:1.2rem;margin-bottom:0.4rem;">🛍️ Anbefalte butikker</h3>' +
    '<p style="font-size:0.82rem;color:#8a7060;margin-bottom:1.1rem;">Finn alt du trenger — med gode rabattkoder</p>' +
    '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:0.85rem;">' + kortHTML + '</div>' +
    '<p style="font-size:0.7rem;color:#aaa;margin-top:1rem;text-align:center;">Se alle rabattkoder pa <a href="/rabattkoder.html" style="color:#c4714a;">Babynorge rabattkoder</a></p>' +
    '</div>';
}

// =============================================
// TOPICS
// =============================================
const TOPICS = [
  { tittel: 'Sovnregresjon ved 4 maneder - hva skjer og hva gjor du?', kategori: 'Sovn', emoji: '😴', color: '#e8e2f5' },
  { tittel: 'Amming vs flaske - fordeler og ulemper', kategori: 'Mat og amming', emoji: '🤱', color: '#fde8d0' },
  { tittel: 'Babyens forste mat - slik starter du fra 4-6 maneder', kategori: 'Mat', emoji: '🥣', color: '#fddbd8' },
  { tittel: 'Slik far du babyen til a sove gjennom natten', kategori: 'Sovn', emoji: '🌙', color: '#e8e2f5' },
  { tittel: 'Milepaler 0-12 maneder - hva er normalt?', kategori: 'Utvikling', emoji: '🌱', color: '#d4edda' },
  { tittel: 'Kolikk hos nyfodt - arsaker og losninger', kategori: 'Baby', emoji: '👶', color: '#fddbd8' },
  { tittel: 'Graviditetskvalme - tips som faktisk hjelper', kategori: 'Graviditet', emoji: '🤰', color: '#d6ebf5' },
  { tittel: 'Termindato beregning - slik regner du ut', kategori: 'Graviditet', emoji: '📅', color: '#d6ebf5' },
  { tittel: 'Babysikring av hjemmet - komplett sjekkliste', kategori: 'Sikkerhet', emoji: '🏠', color: '#d4edda' },
  { tittel: 'D-vitamin til baby - alt du trenger a vite', kategori: 'Helse', emoji: '☀️', color: '#fff3cd' },
  { tittel: 'Baby i sommervarmen - slik holder du babyen kjolig', kategori: 'Sommer', emoji: '☀️', color: '#fff3cd' },
  { tittel: 'Solkrem til baby - hvilken er trygg og nar kan du bruke den?', kategori: 'Sommer', emoji: '🧴', color: '#fde8d0' },
  { tittel: 'Baby i basseng - alder, sikkerhet og tips', kategori: 'Sommer', emoji: '🏊', color: '#d6ebf5' },
  { tittel: 'Sovn om sommeren - slik far babyen nok sovn i lys og varme', kategori: 'Sovn', emoji: '😴', color: '#e8e2f5' },
  { tittel: 'Hva skal baby ha pa seg i varmen? Klesguide for sommeren', kategori: 'Klar', emoji: '👕', color: '#d4edda' },
  { tittel: 'Overoppheting hos baby - tegn, fare og forebygging', kategori: 'Helse', emoji: '🌡️', color: '#fddbd8' },
  { tittel: 'Baby og sol - slik beskytter du mot solbrenthet', kategori: 'Sommer', emoji: '🕶️', color: '#fff3cd' },
  { tittel: 'Amming om sommeren - ekstra vaeske og varmerad', kategori: 'Mat og amming', emoji: '🤱', color: '#fde8d0' },
  { tittel: 'Baby og mygg - er myggmiddel trygt og hva virker?', kategori: 'Helse', emoji: '🦟', color: '#d4edda' },
  { tittel: 'Utstyr til strand og sommer med baby - hva trenger du egentlig?', kategori: 'Utstyr', emoji: '🏖️', color: '#d6ebf5' },
  { tittel: 'Baby pa ferie - rad for flyreise, biltur og hotell', kategori: 'Reise', emoji: '✈️', color: '#d6ebf5' },
  { tittel: 'Varmeutslett hos baby - arsak og behandling', kategori: 'Helse', emoji: '🔴', color: '#fddbd8' },
  { tittel: 'Babymat om sommeren - hva er trygt i varmen?', kategori: 'Mat', emoji: '🥗', color: '#fddbd8' },
  { tittel: 'Baby i bil om sommeren - temperatur og sikkerhet', kategori: 'Sikkerhet', emoji: '🚗', color: '#d4edda' },
  { tittel: 'Lette soveposer og nattklaar til baby om sommeren', kategori: 'Sovn', emoji: '🌙', color: '#e8e2f5' },
  { tittel: 'Solhatt og UV-drakt til baby - hva du bor kjope', kategori: 'Klar', emoji: '👒', color: '#fff3cd' },
  { tittel: 'Baby og varme netter - slik far dere sovet', kategori: 'Sovn', emoji: '🌙', color: '#e8e2f5' },
  { tittel: 'Badedag med baby - tips til bading ute og inne', kategori: 'Sommer', emoji: '🛁', color: '#d6ebf5' },
  { tittel: 'Tegn pa dehydrering hos baby - hva du skal se etter', kategori: 'Helse', emoji: '💧', color: '#fddbd8' },
  { tittel: 'Baby i hage og natur - allergi, insekter og plantegifter', kategori: 'Sikkerhet', emoji: '🌿', color: '#d4edda' },
  { tittel: 'Reise til varmere strok med baby - forberedelser og helserad', kategori: 'Reise', emoji: '🌍', color: '#d6ebf5' },
  { tittel: 'Sommerbursdag med baby - praktiske tips', kategori: 'Baby', emoji: '🎂', color: '#fde8d0' },
  { tittel: 'Forste sommer med nyfodt - hva ingen forteller deg', kategori: 'Baby', emoji: '👶', color: '#fddbd8' },
  { tittel: 'Myggnett til vogn og barneseng - trygt og effektivt', kategori: 'Utstyr', emoji: '🛡️', color: '#d4edda' },
  { tittel: 'Baby og hoy UV-indeks - nar er solen farlig?', kategori: 'Helse', emoji: '☀️', color: '#fff3cd' },
];

function callAnthropic(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1800,
      messages: [{ role: 'user', content: prompt }]
    });
    const options = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data).content[0].text); }
        catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function lagSlug(tittel) {
  return tittel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function oppdaterSitemap(artikler) {
  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  const datoISO = new Date().toISOString().split('T')[0];
  const statiske = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/artikler.html', priority: '0.8', changefreq: 'weekly' },
    { url: '/forum.html', priority: '0.7', changefreq: 'weekly' },
    { url: '/rabattkoder.html', priority: '0.7', changefreq: 'weekly' },
  ];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const s of statiske) {
    xml += '  <url>\n    <loc>' + DOMAIN + s.url + '</loc>\n    <lastmod>' + datoISO + '</lastmod>\n    <changefreq>' + s.changefreq + '</changefreq>\n    <priority>' + s.priority + '</priority>\n  </url>\n';
  }
  for (const a of artikler) {
    xml += '  <url>\n    <loc>' + DOMAIN + '/artikler/' + a.slug + '.html</loc>\n    <lastmod>' + (a.datoISO || datoISO) + '</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n';
  }
  xml += '</urlset>';
  fs.writeFileSync(sitemapPath, xml, 'utf8');
  console.log('Sitemap oppdatert:', artikler.length, 'artikler +', statiske.length, 'statiske sider');
}

async function genererArtikkel() {
  const artiklerDir = path.join(__dirname, 'artikler');
  if (!fs.existsSync(artiklerDir)) fs.mkdirSync(artiklerDir);

  const indexPath = path.join(artiklerDir, 'index.json');
  let artikler = [];
  if (fs.existsSync(indexPath)) {
    artikler = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  }

  const brukte = artikler.map(a => a.tittel);
  const tilgjengelige = TOPICS.filter(t => !brukte.includes(t.tittel));
  const tema = tilgjengelige.length > 0
    ? tilgjengelige[Math.floor(Math.random() * tilgjengelige.length)]
    : TOPICS[Math.floor(Math.random() * TOPICS.length)];

  console.log('Genererer artikkel:', tema.tittel);

  const prompt = 'Du er ekspert pa norske babyer og graviditet. Skriv en grundig artikkel pa norsk om: "' + tema.tittel + '". Artikkelen skal ha 4-6 seksjoner med h2-overskrifter, praktiske rad og 500-700 ord. Formater som HTML med h2, p, ul og li tagger. Ikke inkluder DOCTYPE, html, head eller body tagger.';

  const innhold = await callAnthropic(prompt);
  const slug = lagSlug(tema.tittel);
  const dato = new Date().toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });
  const datoISO = new Date().toISOString().split('T')[0];
  const affiliateBlokk = lagAffiliateBlokk(tema.kategori);

  const artikkelHTML = '<!DOCTYPE html>\n<html lang="nb">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>' + tema.tittel + ' | Babynorge.no</title>\n<meta name="description" content="Les var guide om ' + tema.tittel.toLowerCase() + '">\n<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">\n<style>\n*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Nunito,sans-serif;background:#fdf8f3;color:#2a1f14;line-height:1.7;}nav{background:#fff;border-bottom:1px solid #e8ddd4;padding:0 1.5rem;position:sticky;top:0;z-index:100;}.nav-inner{max-width:800px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:60px;}.nav-logo{font-family:"Playfair Display",serif;font-size:1.3rem;font-weight:900;color:#c4714a;text-decoration:none;}.nav-back{font-size:0.85rem;font-weight:600;color:#8a7060;text-decoration:none;}.hero{background:#fff3cd;padding:2.5rem 1.5rem 2rem;border-bottom:1px solid #e8ddd4;}.hero-inner{max-width:800px;margin:0 auto;}.hero h1{font-family:"Playfair Display",serif;font-size:2rem;font-weight:900;margin-bottom:0.75rem;}.hero-meta{font-size:0.82rem;color:#8a7060;display:flex;gap:1rem;flex-wrap:wrap;margin-top:0.5rem;}.article-body{max-width:800px;margin:0 auto;padding:2rem 1.5rem 4rem;}.article-body h2{font-family:"Playfair Display",serif;font-size:1.4rem;font-weight:700;margin:2rem 0 0.75rem;color:#c4714a;}.article-body p{margin-bottom:1rem;}.article-body ul{margin:0.5rem 0 1rem 1.5rem;}.article-body li{margin-bottom:0.4rem;}.back-btn{display:inline-block;margin-top:1.5rem;color:#c4714a;font-weight:700;text-decoration:none;}footer{background:#2a1f14;color:rgba(255,255,255,0.5);padding:1.5rem;text-align:center;font-size:0.72rem;}footer a{color:#f2c4b8;}\n</style>\n</head>\n<body>\n<nav><div class="nav-inner"><a href="/" class="nav-logo">🍼 Babynorge</a><a href="/artikler.html" class="nav-back">← Alle artikler</a></div></nav>\n<div class="hero"><div class="hero-inner"><div>' + tema.emoji + ' ' + tema.kategori + '</div><h1>' + tema.tittel + '</h1><div class="hero-meta"><span>📅 ' + dato + '</span><span>⏱ 5 min lesetid</span></div></div></div>\n<div class="article-body">\n' + innhold + '\n' + affiliateBlokk + '\n<a href="/artikler.html" class="back-btn">← Tilbake til alle artikler</a>\n</div>\n<footer><p>© 2025 Babynorge.no · <a href="/personvern.html">Personvern</a> · <a href="/rabattkoder.html">Rabattkoder</a> · Innholdet er veiledende og erstatter ikke rad fra lege.</p></footer>\n</body>\n</html>';

  fs.writeFileSync(path.join(artiklerDir, slug + '.html'), artikkelHTML);

  const nyArtikkel = {
    slug, tittel: tema.tittel, kategori: tema.kategori,
    emoji: tema.emoji, color: tema.color, dato, datoISO,
    lesetid: '5 min', ingress: 'Les var guide om ' + tema.tittel.toLowerCase()
  };

  artikler.unshift(nyArtikkel);
  if (artikler.length > 50) artikler = artikler.slice(0, 50);
  fs.writeFileSync(indexPath, JSON.stringify(artikler, null, 2));

  oppdaterSitemap(artikler);
  console.log('Ferdig:', slug);
}

genererArtikkel().catch(console.error);
