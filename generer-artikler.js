const https = require('https');
const fs = require('fs');
const path = require('path');

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
  { tittel: 'Tannfrembrudd hos baby - tegn og tips', kategori: 'Helse', emoji: '🦷', color: '#fff3cd' },
  { tittel: 'Barneforsikring - trenger du det?', kategori: 'Okonomi', emoji: '🛡️', color: '#d6ebf5' },
  { tittel: 'Barselsdepresjon - symptomer og hjelp', kategori: 'Helse', emoji: '💙', color: '#d6ebf5' },
  { tittel: 'BLW - baby-ledet avvenning fra start', kategori: 'Mat', emoji: '🥕', color: '#fddbd8' },
  { tittel: 'Foreldrepenger 2025 - slik fungerer det', kategori: 'Okonomi', emoji: '💰', color: '#d4edda' },
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
        try {
          const parsed = JSON.parse(data);
          resolve(parsed.content[0].text);
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function lagSlug(tittel) {
  return tittel.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function genererArtikkel() {
  const rootDir = __dirname;
  const artiklerDir = path.join(rootDir, 'artikler');
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

  const prompt = `Du er ekspert pa norske babyer og graviditet. Skriv en grundig artikkel pa norsk om: "${tema.tittel}". 
Artikkelen skal ha 4-6 seksjoner med h2-overskrifter, praktiske rad og 500-700 ord. 
Formater som HTML med h2, p, ul og li tagger. 
Ikke inkluder DOCTYPE, html, head eller body tagger.
Skriv engasjerende og varm tekst som hjelper norske foreldre.`;

  const innhold = await callAnthropic(prompt);
  const slug = lagSlug(tema.tittel);
  const dato = new Date().toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });
  const datoISO = new Date().toISOString().split('T')[0];

  const nyArtikkel = {
    slug,
    tittel: tema.tittel,
    kategori: tema.kategori,
    emoji: tema.emoji,
    color: tema.color,
    dato,
    datoISO,
    lesetid: '5 min',
    ingress: 'Les var guide om ' + tema.tittel.toLowerCase()
  };

  const artikkelHTML = `<!DOCTYPE html>
<html lang="nb">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${tema.tittel} | Babynorge.no</title>
<meta name="description" content="${nyArtikkel.ingress}">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Nunito',sans-serif;background:#fdf8f3;color:#2a1f14;line-height:1.7;}
nav{background:#fff;border-bottom:1px solid #e8ddd4;padding:0 1.5rem;position:sticky;top:0;z-index:100;box-shadow:0 2px 12px rgba(0,0,0,0.06);}
.nav-inner{max-width:800px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:60px;}
.nav-logo{font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:900;color:#c4714a;text-decoration:none;}
.nav-back{font-size:0.85rem;font-weight:600;color:#8a7060;text-decoration:none;}
.nav-back:hover{color:#c4714a;}
.hero{background:linear-gradient(135deg,${tema.color},#fdf8f3);padding:2.5rem 1.5rem 2rem;border-bottom:1px solid #e8ddd4;}
.hero-inner{max-width:800px;margin:0 auto;}
.hero-tag{display:inline-flex;align-items:center;gap:0.35rem;background:#fff;border:1px solid #e8ddd4;border-radius:20px;padding:0.3rem 0.85rem;font-size:0.72rem;font-weight:700;color:#c4714a;margin-bottom:1rem;}
.hero h1{font-family:'Playfair Display',serif;font-size:clamp(1.6rem,4vw,2.4rem);font-weight:900;line-height:1.25;margin-bottom:0.75rem;}
.hero-meta{font-size:0.78rem;color:#8a7060;display:flex;gap:1rem;flex-wrap:wrap;}
.article-body{max-width:800px;margin:0 auto;padding:2rem 1.5rem 4rem;}
.article-body h2{font-family:'Playfair Display',serif;font-size:1.4rem;font-weight:700;margin:2rem 0 0.75rem;color:#2a1f14;padding-top:1rem;border-top:1px solid #e8ddd4;}
.article-body h2:first-child{border-top:none;margin-top:0;}
.article-body h3{font-size:1.1rem;font-weight:700;margin:1.5rem 0 0.5rem;color:#2a1f14;}
.article-body p{margin-bottom:1rem;font-size:0.97rem;color:#3a2a1a;}
.article-body ul,.article-body ol{margin:0.75rem 0 1rem 1.5rem;}
.article-body li{margin-bottom:0.5rem;font-size:0.97rem;color:#3a2a1a;}
.article-body strong{color:#2a1f14;font-weight:700;}
.affiliate-strip{background:linear-gradient(135deg,#fff8ec,#fff3dc);border:1.5px solid #f0d080;border-radius:14px;padding:1.2rem 1.4rem;margin:2.5rem 0 1.5rem;}
.affiliate-strip h3{font-size:0.95rem;font-weight:700;margin-bottom:0.4rem;}
.affiliate-strip p{font-size:0.8rem;color:#8a7060;margin-bottom:0.75rem;}
.aff-btns{display:flex;gap:0.5rem;flex-wrap:wrap;}
.aff-btn{background:#3d6b42;color:#fff;border:none;padding:0.55rem 1rem;border-radius:8px;font-family:'Nunito',sans-serif;font-size:0.78rem;font-weight:700;text-decoration:none;display:inline-block;}
.aff-btn:hover{background:#2a5030;}
.back-btn{display:inline-flex;align-items:center;gap:0.4rem;background:#c4714a;color:#fff;padding:0.65rem 1.3rem;border-radius:50px;font-family:'Nunito',sans-serif;font-size:0.85rem;font-weight:700;text-decoration:none;margin-top:1rem;}
footer{background:#2a1f14;color:rgba(255,255,255,0.5);padding:1.5rem;text-align:center;font-size:0.72rem;margin-top:3rem;}
footer a{color:#f2c4b8;}
@media(max-width:600px){.hero{padding:1.5rem 1rem;}.article-body{padding:1.5rem 1rem 3rem;}}
</style>
</head>
<body>
<nav>
  <div class="nav-inner">
    <a href="/" class="nav-logo">🍼 Babynorge</a>
    <a href="/artikler.html" class="nav-back">← Alle artikler</a>
  </div>
</nav>
<div class="hero">
  <div class="hero-inner">
    <div class="hero-tag">${tema.emoji} ${tema.kategori}</div>
    <h1>${tema.tittel}</h1>
    <div class="hero-meta">
      <span>📅 ${dato}</span>
      <span>⏱ 5 min lesetid</span>
      <span>✍️ Babynorge redaksjonen</span>
    </div>
  </div>
</div>
<div class="article-body">
${innhold}
<div class="affiliate-strip">
  <h3>🛍️ Produkter vi anbefaler</h3>
  <p>Finn alt du trenger til babyen hos våre samarbeidspartnere.</p>
  <div class="aff-btns">
    <a href="https://www.babysam.no" target="_blank" class="aff-btn">Babysam</a>
    <a href="https://www.babyshop.no" target="_blank" class="aff-btn">Babyshop</a>
    <a href="https://www.adamsmatkasse.no" target="_blank" class="aff-btn">Adams Matkasse</a>
  </div>
</div>
<a href="/artikler.html" class="back-btn">← Tilbake til alle artikler</a>
</div>
<footer>
  <p>© 2025 Babynorge.no · <a href="/personvern.html">Personvern</a> · Innholdet er veiledende og erstatter ikke råd fra lege.</p>
</footer>
</body>
</html>`;

  fs.writeFileSync(path.join(artiklerDir, slug + '.html'), artikkelHTML);

  artikler.unshift(nyArtikkel);
  if (artikler.length > 50) artikler = artikler.slice(0, 50);
  fs.writeFileSync(indexPath, JSON.stringify(artikler, null, 2));

  console.log('Artikkel generert:', slug);
}

genererArtikkel().catch(console.error);
