// =============================================
// BABYGUIDEN.NO – Hoved JavaScript
// =============================================

// --- HAMBURGER MENY ---
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

// --- NEWSLETTER FORM ---
function handleNewsletter(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = '✅ Du er påmeldt!';
  btn.style.background = '#4E7A52';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Meld meg på';
    btn.style.background = '';
    btn.disabled = false;
    e.target.reset();
  }, 4000);
}

// --- SMOOTH SCROLL ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- ANIMATE ON SCROLL ---
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.cat-card, .urgent-card, .age-card, .ms-card, .thread-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// =============================================
// KALKULATORER
// =============================================

// Termindatokalkulator
function beregnTermin() {
  const sisteDate = document.getElementById('sisteMenstruasjon');
  const syklusInput = document.getElementById('syklusLengde');
  if (!sisteDate || !sisteDate.value) return;

  const siste = new Date(sisteDate.value);
  const syklus = parseInt(syklusInput?.value || 28);
  const dager = 280 + (syklus - 28);

  const termin = new Date(siste.getTime() + dager * 24 * 60 * 60 * 1000);

  const datoStr = termin.toLocaleDateString('nb-NO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const iDag = new Date();
  const ukerGravid = Math.floor((iDag - siste) / (7 * 24 * 60 * 60 * 1000));
  const dagerGravid = Math.floor((iDag - siste) / (24 * 60 * 60 * 1000)) % 7;
  const ukerIgjen = Math.max(0, Math.floor((termin - iDag) / (7 * 24 * 60 * 60 * 1000)));

  const result = document.getElementById('terminResult');
  if (result) {
    result.innerHTML = `
      <div class="result-label">Din termindato er</div>
      <div class="result-value">${datoStr}</div>
      <div class="result-sub">Du er nå i uke ${ukerGravid}+${dagerGravid} · Ca. ${ukerIgjen} uker igjen</div>
    `;
  }
}

// Ammekalkulator
function beregnAmming() {
  const antallInput = document.getElementById('ammingAntall');
  const minuttInput = document.getElementById('ammingMinutt');
  if (!antallInput || !minuttInput) return;

  const antall = parseFloat(antallInput.value) || 0;
  const minutter = parseFloat(minuttInput.value) || 0;
  const totalt = antall * minutter;
  const mlEstimat = Math.round(antall * 80); // ca 80ml per amming

  const result = document.getElementById('ammingResult');
  if (result) {
    result.innerHTML = `
      <div class="result-label">Estimat per dag</div>
      <div class="result-value">${mlEstimat} ml</div>
      <div class="result-sub">${totalt} minutter amming · ${antall} ganger per dag</div>
    `;
  }
}

// Vekstkalkulator
function beregnVekst() {
  const vektInput = document.getElementById('babyVekt');
  const hoydInput = document.getElementById('babyHoyde');
  const aldInput = document.getElementById('babyAlder');
  if (!vektInput || !aldInput) return;

  const vekt = parseFloat(vektInput.value);
  const alder = parseInt(aldInput.value);
  const hoyde = parseFloat(hoydInput?.value || 0);

  // Enkel referanse (WHO 50. persentil for gutter, ca)
  const referanseVekt = {
    0: 3.3, 1: 4.5, 2: 5.6, 3: 6.4, 4: 7.0, 5: 7.5,
    6: 7.9, 7: 8.3, 8: 8.6, 9: 8.9, 10: 9.2, 11: 9.4, 12: 9.6
  };
  const ref = referanseVekt[alder] || 8;
  const pst = Math.round((vekt / ref) * 50);
  const vurdering = pst >= 40 && pst <= 60 ? 'Normal vekst 👍' : pst < 40 ? 'Under median – snakk med helsesykepleier' : 'Over median – normalt for mange';

  const result = document.getElementById('vekstResult');
  if (result) {
    result.innerHTML = `
      <div class="result-label">Vurdering</div>
      <div class="result-value">${vurdering}</div>
      <div class="result-sub">Referansevekt ${alder} mnd: ~${ref} kg · Ditt barn: ${vekt} kg</div>
    `;
  }
}

// Søvnkalkulator
function beregnSovn() {
  const aldInput = document.getElementById('sovnAlder');
  if (!aldInput) return;
  const alder = parseInt(aldInput.value);

  const sovnData = {
    0: { total: '14–17', natt: '8–9', lur: '3–5 lurer' },
    1: { total: '14–16', natt: '8–9', lur: '3–4 lurer' },
    2: { total: '13–16', natt: '9–10', lur: '3–4 lurer' },
    3: { total: '12–15', natt: '10–11', lur: '2–3 lurer' },
    4: { total: '12–15', natt: '10–11', lur: '2–3 lurer' },
    5: { total: '12–14', natt: '10–11', lur: '2 lurer' },
    6: { total: '12–14', natt: '10–11', lur: '2 lurer' },
    9: { total: '12–14', natt: '10–12', lur: '2 lurer' },
    12: { total: '11–14', natt: '10–12', lur: '1–2 lurer' },
    18: { total: '11–14', natt: '11–12', lur: '1 lur' },
    24: { total: '11–13', natt: '11–12', lur: '1 lur (noen slutter)' },
  };

  const keys = Object.keys(sovnData).map(Number).sort((a, b) => a - b);
  const nearest = keys.reduce((prev, curr) => Math.abs(curr - alder) < Math.abs(prev - alder) ? curr : prev);
  const data = sovnData[nearest];

  const result = document.getElementById('sovnResult');
  if (result) {
    result.innerHTML = `
      <div class="result-label">Anbefalt søvn ved ${alder} måneder</div>
      <div class="result-value">${data.total} timer/dag</div>
      <div class="result-sub">Natt: ${data.natt} timer · Lurer: ${data.lur}</div>
    `;
  }
}

// Graviditetsuke-kalkulator
function beregnUke() {
  const dateInput = document.getElementById('befruktningsDato');
  if (!dateInput || !dateInput.value) return;

  const bef = new Date(dateInput.value);
  const iDag = new Date();
  const dager = Math.floor((iDag - bef) / (24 * 60 * 60 * 1000)) + 14; // LMP-ekv
  const uker = Math.floor(dager / 7);
  const restDager = dager % 7;
  const igjen = Math.max(0, 280 - dager);
  const ukerIgjen = Math.floor(igjen / 7);

  const result = document.getElementById('ukeResult');
  if (result) {
    result.innerHTML = `
      <div class="result-label">Du er i graviditetsuke</div>
      <div class="result-value">Uke ${uker}+${restDager}</div>
      <div class="result-sub">Ca. ${ukerIgjen} uker igjen til termin</div>
    `;
  }
}

// =============================================
// FORUM FUNKSJONALITET
// =============================================

const forumData = [
  { id: 1, cat: 'Søvn', title: '«9 måneder gammel – vekner 6 ganger i natt. Hjelp!»', body: 'Sønnen min på 9 mnd har alltid vært en dårlig sover, men nå er det blitt enda verre. Vi prøvde å legge ham ned våken men han bare skriker. Har noen erfaringer med dette?', votes: 34, replies: 47, time: '2 timer siden', hot: true },
  { id: 2, cat: 'Mat', title: '«Datteren min på 8 mnd nekter all mat – bare bryst. Er dette normalt?»', body: 'Vi startet med fast føde ved 6 mnd men nå er det som om hun har glemt det helt. Spiser ikke en eneste bit mat, bare bryst dag og natt.', votes: 28, replies: 31, time: '4 timer siden', hot: true },
  { id: 3, cat: 'Røffe perioder', title: '«Uke 6 med kolikk. Jeg gråter mer enn babyen nå.»', body: 'Sønnen min er 6 uker og gråter fra kl 17 til midnatt hver eneste dag. Vi har prøvd alt. Kolikkmage, babymassasje, hvit støy. Ingenting hjelper. Jeg er helt ødelagt.', votes: 89, replies: 93, time: '6 timer siden', hot: true },
  { id: 4, cat: 'Graviditet', title: '«Uke 34 – panikk over fødsel. Noen som vil snakke?»', body: 'Jeg er førstegangsfødende og panikken setter inn nå. Redd for smertene, redd for noe skal gå galt. Har noen vært gjennom dette og kommet ut på den andre siden?', votes: 62, replies: 58, time: '1 dag siden', hot: false },
  { id: 5, cat: 'Utvikling', title: '«Sønnen min på 12 mnd sier ikke et eneste ord – bekymret»', body: 'Alle sier at det er normalt men jeg er virkelig bekymret. Alle andre babyer i gruppen sier "mama" og "dada". Han gjør lyder men ingen tydelige ord.', votes: 41, replies: 67, time: '1 dag siden', hot: false },
  { id: 6, cat: 'Søvn', title: '«4-månedersregresjonen tok meg på senga – tips?»', body: 'Ingen forberedte meg på dette. Dottern min sov 5-6 timer i strekk og nå er vi tilbake til hvert 1,5-2. time. Er dette virkelig normalt?', votes: 55, replies: 72, time: '2 dager siden', hot: false },
  { id: 7, cat: 'Mat', title: '«BLW vs tradisjonell: Hva valgte dere og angrer dere?»', body: 'Vi starter matintroduksjon neste uke og er split på metode. Baby-ledet er spennende men litt skremmende. Hva har fungert for dere?', votes: 33, replies: 44, time: '2 dager siden', hot: false },
  { id: 8, cat: 'Røffe perioder', title: '«Tannpining + vekstspurt = ren overlevelse»', body: 'Er det noen som kombinerer tannpining og vekstspurt akkurat nå? Babyen min er 7 mnd og det er kaos. Smertestillende hjelper ikke lenger.', votes: 29, replies: 38, time: '3 dager siden', hot: false },
];

let activeCategory = 'Alle';
let likedThreads = new Set();

function renderForum(category = 'Alle') {
  const list = document.getElementById('forumThreadList');
  if (!list) return;

  const filtered = category === 'Alle' ? forumData : forumData.filter(t => t.cat === category);
  list.innerHTML = '';

  filtered.forEach(thread => {
    const div = document.createElement('div');
    div.className = 'forum-thread-item';
    div.innerHTML = `
      <div class="thread-votes">
        <button class="vote-btn" onclick="voteThread(${thread.id}, this)" title="Støtt">❤️</button>
        <span class="vote-count" id="vote-${thread.id}">${thread.votes}</span>
      </div>
      <div class="thread-content">
        <div class="thread-category">${thread.cat} ${thread.hot ? '🔥' : ''}</div>
        <h4>${thread.title}</h4>
        <p class="thread-excerpt">${thread.body}</p>
        <div class="thread-meta">
          <span>💬 ${thread.replies} svar</span>
          <span>🕐 ${thread.time}</span>
          <span onclick="openThread(${thread.id})" style="cursor:pointer;color:var(--sage-dark);font-weight:600;">Les tråden →</span>
        </div>
      </div>
    `;
    list.appendChild(div);
  });
}

function voteThread(id, btn) {
  if (likedThreads.has(id)) {
    likedThreads.delete(id);
    const data = forumData.find(t => t.id === id);
    data.votes--;
    btn.style.transform = '';
  } else {
    likedThreads.add(id);
    const data = forumData.find(t => t.id === id);
    data.votes++;
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => btn.style.transform = 'scale(1)', 300);
  }
  const el = document.getElementById(`vote-${id}`);
  const data = forumData.find(t => t.id === id);
  if (el) el.textContent = data.votes;
}

function filterForum(category, btn) {
  activeCategory = category;
  document.querySelectorAll('.forum-cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderForum(category);
}

function openNewPostModal() {
  const modal = document.getElementById('newPostModal');
  if (modal) modal.classList.remove('hidden');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) modal.classList.add('hidden');
}

function submitNewPost(e) {
  e.preventDefault();
  const title = document.getElementById('postTitle')?.value;
  const cat = document.getElementById('postCategory')?.value;
  const body = document.getElementById('postBody')?.value;

  if (!title || !cat || !body) return;

  forumData.unshift({
    id: Date.now(),
    cat,
    title: `«${title}»`,
    body,
    votes: 0,
    replies: 0,
    time: 'Akkurat nå',
    hot: false
  });

  renderForum(activeCategory);
  closeModal('newPostModal');
  e.target.reset();

  // Show toast
  showToast('Innlegget ditt er publisert! 🎉');
}

function openThread(id) {
  // For demo, show a toast
  showToast('Tråden åpnes... (koble til backend for full visning)');
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
    background: var(--sage-dark); color: white; padding: 14px 28px;
    border-radius: 50px; font-weight: 600; font-size: 0.9rem;
    z-index: 9999; box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    animation: toastIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

// =============================================
// TRIMESTER TABS (graviditet.html)
// =============================================

function switchTrimester(num) {
  document.querySelectorAll('.trim-tab').forEach((t, i) => {
    t.classList.toggle('active', i === num - 1);
  });
  document.querySelectorAll('.trimester-content').forEach((c, i) => {
    c.classList.toggle('active', i === num - 1);
  });
}

// =============================================
// MILEPÆL FILTER (utvikling.html)
// =============================================

function filterMilepæler(cat) {
  document.querySelectorAll('.milestones-filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
  document.querySelectorAll('.milestone-item').forEach(item => {
    const match = cat === 'Alle' || item.dataset.cat === cat;
    item.style.display = match ? 'flex' : 'none';
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderForum();
});
