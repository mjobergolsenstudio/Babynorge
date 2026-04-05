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
];

function callAnthropic(prompt) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: 'claude-opus-4-5',
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

  const prompt = 'Du er ekspert pa norske babyer og graviditet. Skriv en grundig artikkel pa norsk om: "' + tema.tittel + '". Artikkelen skal ha 4-6 seksjoner med h2-overskrifter, praktiske rad og 500-700 ord. Formater som HTML med h2, p, ul og li tagger. Ikke inkluder DOCTYPE, html, head eller body tagger.';

  const innhold = await callAnthropic(prompt);
  const slug = lagSlug(tema.tittel);
  const dato = new Date().toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' });
  const datoISO = new Date().toISOString().split('T')[0];

  const artikkelHTML = '<!DOCTYPE html>\n<html lang="nb">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>' + tema.tittel + ' | Babyguiden.no</title>\n<link rel="stylesheet" href="../style.css">\n</head>\n<body>\n' + innhold + '\n</body>\n</html>';

  fs.writeFileSync(path.join(artiklerDir, slug + '.html'), artikkelHTML);

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

  artikler.unshift(nyArtikkel);
  if (artikler.length > 50) artikler = artikler.slice(0, 50);
  fs.writeFileSync(indexPath, JSON.stringify(artikler, null, 2));

  console.log('Artikkel generert:', slug);
}

genererArtikkel().catch(console.error);
