// =========================================
// BABYGUIDEN.NO – Artikkelgenerator
// Kjøres av GitHub Actions hver mandag
// =========================================

const https = require(‘https’);
const fs = require(‘fs’);
const path = require(‘path’);

const TOPICS = [
{ tittel: ‘Søvnregresjon ved 4 måneder — hva skjer og hva gjør du?’, kategori: ‘Søvn’, emoji: ‘😴’, color: ‘#e8e2f5’ },
{ tittel: ‘Amming vs flaske — fordeler og ulemper’, kategori: ‘Mat & amming’, emoji: ‘🤱’, color: ‘#fde8d0’ },
{ tittel: ‘Babyens første mat — slik starter du fra 4–6 måneder’, kategori: ‘Mat’, emoji: ‘🥣’, color: ‘#fddbd8’ },
{ tittel: ‘Slik får du babyen til å sove gjennom natten’, kategori: ‘Søvn’, emoji: ‘🌙’, color: ‘#e8e2f5’ },
{ tittel: ‘Milepæler 0–12 måneder — hva er normalt?’, kategori: ‘Utvikling’, emoji: ‘🌱’, color: ‘#d4edda’ },
{ tittel: ‘Kolikk hos nyfødt — årsaker og løsninger’, kategori: ‘Baby’, emoji: ‘👶’, color: ‘#fddbd8’ },
{ tittel: ‘Graviditetskvalme — tips som faktisk hjelper’, kategori: ‘Graviditet’, emoji: ‘🤰’, color: ‘#d6ebf5’ },
{ tittel: ‘Termindato beregning — slik regner du ut’, kategori: ‘Graviditet’, emoji: ‘📅’, color: ‘#d6ebf5’ },
{ tittel: ‘Babysikring av hjemmet — komplett sjekkliste’, kategori: ‘Sikkerhet’, emoji: ‘🏠’, color: ‘#d4edda’ },
{ tittel: ‘D-vitamin til baby — alt du trenger å vite’, kategori: ‘Helse’, emoji: ‘☀️’, color: ‘#fff3cd’ },
{ tittel: ‘BLW (Baby Led Weaning) — hva er det og passer det deg?’, kategori: ‘Mat’, emoji: ‘🥦’, color: ‘#fde8d0’ },
{ tittel: ‘Separasjonsangst hos baby — normalt og forbigående’, kategori: ‘Utvikling’, emoji: ‘🫂’, color: ‘#d4edda’ },
{ tittel: ‘Fødselsdepresjon — tegn, hjelp og veien videre’, kategori: ‘Foreldrehelse’, emoji: ‘❤️’, color: ‘#fddbd8’ },
{ tittel: ‘Første trimester — hva du kan forvente’, kategori: ‘Graviditet’, emoji: ‘🤰’, color: ‘#d6ebf5’ },
{ tittel: ‘Tannfrembrudd hos baby — tegn og tips’, kategori: ‘Baby’, emoji: ‘🦷’, color: ‘#fde8d0’ },
];

function callAnthropic(prompt) {
return new Promise((resolve, reject) => {
const body = JSON.stringify({
model: ‘claude-opus-4-5’,
max_tokens: 1800,
messages: [{ role: ‘user’, content: prompt }]
});

```
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
```

});
}

function lagSlug(tittel) {
return tittel.toLowerCase()
.replace(/æ/g,‘ae’).replace(/ø/g,‘o’).replace(/å/g,‘aa’)
.replace(/[^a-z0-9]+/g, ‘-’)
.replace(/^-|-$/g, ‘’);
}

async function genererArtikkel() {
const rootDir = __dirname;
const artiklerDir = path.join(rootDir, ‘artikler’);
if (!fs.existsSync(artiklerDir)) fs.mkdirSync(artiklerDir);

const indexPath = path.join(artiklerDir, ‘index.json’);
let artikler = [];
if (fs.existsSync(indexPath)) {
artikler = JSON.parse(fs.readFileSync(indexPath, ‘utf8’));
}

const brukte = artikler.map(a => a.tittel);
const tilgjengelige = TOPICS.filter(t => !brukte.includes(t.tittel));
const tema = tilgjengelige.length > 0
? tilgjengelige[Math.floor(Math.random() * tilgjengelige.length)]
: TOPICS[Math.floor(Math.random() * TOPICS.length)];

console.log(‘Genererer artikkel:’, tema.tittel);

const prompt = `Du er en varm og kunnskapsrik ekspert på graviditet, baby og småbarn. Skriv en grundig og nyttig artikkel på norsk bokmål om: “${tema.tittel}”

Artikkelen skal:

- Ha en kort, empatisk og engasjerende ingress (2-3 setninger)
- Inneholde 4-6 seksjoner med overskrifter
- Gi konkrete, praktiske råd basert på oppdatert medisinsk kunnskap
- Være varm og støttende i tonen — foreldre skal føle seg sett og ikke alene
- Ha korrekte norske anbefalinger (Helsedirektoratet, norske retningslinjer)
- Avslutte med en oppmuntrende setning
- Totalt 500-700 ord

Formater som HTML med <h2>, <h3>, <p>, <ul>, <li> tagger. Ikke inkluder <!DOCTYPE>, <html>, <head> eller <body> tagger.`;

const innhold = await callAnthropic(prompt);
const slug = lagSlug(tema.tittel);
const dato = new Date().toLocaleDateString(‘nb-NO’, { day: ‘numeric’, month: ‘long’, year: ‘numeric’ });
const datoISO = new Date().toISOString().split(‘T’)[0];

const artikkelHTML = `<!DOCTYPE html>

<html lang="nb">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${tema.tittel} | Babyguiden.no</title>
<meta name="description" content="${tema.tittel} — Les vår guide for nye foreldre.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../style.css">
</head>
<body>
<header class="site-header">
  <div class="header-inner">
    <a href="../index.html" class="logo"><span class="logo-icon">🌿</span> Babyguiden<span class="logo-dot">.no</span></a>
    <nav class="main-nav">
      <a href="../graviditet.html">Graviditet</a>
      <a href="../baby.html">Baby</a>
      <a href="../sovn.html">Søvn</a>
      <a href="../mat.html">Mat</a>
      <a href="../utvikling.html">Utvikling</a>
      <a href="../kalkulator.html" class="nav-cta">Kalkulatorer</a>
    </nav>
    <button class="hamburger" onclick="document.getElementById('mobileMenu').classList.toggle('open')"><span></span><span></span><span></span></button>
  </div>
  <nav class="mobile-menu" id="mobileMenu">
    <a href="../graviditet.html">🤰 Graviditet</a>
    <a href="../baby.html">👶 Baby</a>
    <a href="../sovn.html">😴 Søvn</a>
    <a href="../mat.html">🥣 Mat</a>
    <a href="../utvikling.html">🌱 Utvikling</a>
    <a href="../kalkulator.html">🧮 Kalkulatorer</a>
  </nav>
</header>

<section style="background:linear-gradient(135deg,${tema.color},#fff8f0);padding:70px 24px 50px">
  <div style="max-width:760px;margin:0 auto">
    <div style="margin-bottom:12px"><a href="../index.html" style="color:var(--text-light);font-size:0.85rem">← Tilbake</a></div>
    <div style="font-size:3rem;margin-bottom:16px">${tema.emoji}</div>
    <h1 style="font-family:'Playfair Display',serif;font-size:clamp(1.8rem,4vw,2.8rem);color:var(--text-dark);margin-bottom:14px">${tema.tittel}</h1>
    <div style="color:var(--text-light);font-size:0.85rem;display:flex;gap:16px;flex-wrap:wrap">
      <span>📅 ${dato}</span>
      <span>🏷️ ${tema.kategori}</span>
      <span>⏱️ 5 min lesetid</span>
    </div>
  </div>
</section>

<article style="max-width:760px;margin:0 auto;padding:48px 24px;font-family:'DM Sans',sans-serif;color:var(--text-mid);line-height:1.8">
  ${innhold}

  <div style="background:var(--sage);border-radius:20px;padding:28px;text-align:center;margin-top:40px">
    <h3 style="color:white;font-family:'Playfair Display',serif;margin-bottom:8px">Du er ikke alene 💚</h3>
    <p style="color:rgba(255,255,255,0.85);margin-bottom:20px;font-size:0.9rem">Bruk våre kalkulatorer og guider for å navigere foreldrelivet</p>
    <a href="../kalkulator.html" style="background:white;color:var(--sage-dark);padding:12px 28px;border-radius:50px;font-weight:700;font-size:0.9rem">Se alle verktøy →</a>
  </div>
</article>

<footer class="site-footer" style="background:var(--cream);border-top:1px solid var(--border);padding:32px 24px;margin-top:40px">
  <div style="text-align:center">
    <div class="logo" style="justify-content:center;margin-bottom:8px">🌿 Babyguiden.no</div>
    <p style="font-size:0.78rem;color:var(--text-light)">Innholdet er veiledende og erstatter ikke råd fra lege eller helsesykepleier.</p>
  </div>
</footer>
</body>
</html>`;

fs.writeFileSync(path.join(artiklerDir, `${slug}.html`), artikkelHTML);

const nyArtikkel = {
slug,
tittel: tema.tittel,
kategori: tema.kategori,
emoji: tema.emoji,
color: tema.color,
dato,
datoISO,
lesetid: ‘5 min’,
ingress: `Les vår guide om ${tema.tittel.toLowerCase()} og få praktiske råd for deg og babyen din.`
};

artikler.unshift(nyArtikkel);
if (artikler.length > 50) artikler = artikler.slice(0, 50);
fs.writeFileSync(indexPath, JSON.stringify(artikler, null, 2));

console.log(‘✅ Artikkel generert:’, slug);
}

genererArtikkel().catch(console.error);
