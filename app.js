/* Data loading: optional data.json, otherwise fallback to sample data */
async function loadData() {
  try {
    const res = await fetch('data.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('No data.json');
    return await res.json();
  } catch (e) {
    return getSampleData();
  }
}

function getSampleData() {
  return {
    brandCounts: { labels: ['Dell','HP','Lenovo','Apple','Asus','Acer','MSI'], values: [780, 720, 690, 420, 380, 330, 200] },
    ramDistribution: { labels: ['4GB','8GB','12GB','16GB','32GB'], values: [260, 1680, 520, 980, 180] },
    cpuCounts: { labels: ['Intel i3','Intel i5','Intel i7','Ryzen 5','Ryzen 7','Apple M1/M2'], values: [410, 1380, 940, 520, 340, 220] },
    storageRatio: { ssd: 2700, hdd: 1276 },
    resolutionPopularity: { labels: ['1366x768','1600x900','1920x1080','2560x1600','2880x1800','3840x2160'], values: [620, 260, 1960, 430, 180, 200] }
  };
}

/* Neon palette */
const colors = {
  accent: '#7cf0ff',
  accent2: '#a78bfa',
  accent3: '#00ffa3',
  muted: 'rgba(255,255,255,0.6)'
};

function neonGlow(layoutUpdates = {}) {
  return {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#e6e9f0' },
    margin: { t: 30, r: 16, b: 36, l: 42 },
    xaxis: { gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.12)' },
    yaxis: { gridcolor: 'rgba(255,255,255,0.08)', zerolinecolor: 'rgba(255,255,255,0.12)' },
    ...layoutUpdates
  };
}

function animateIntro(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.filter = 'drop-shadow(0 0 10px rgba(124,240,255,.35))';
  setTimeout(() => { el.style.filter = 'none'; }, 600);
}

function renderBrandChart(data) {
  const trace = {
    type: 'pie',
    labels: data.labels,
    values: data.values,
    hole: 0.45,
    marker: { colors: ['#7cf0ff','#a78bfa','#00ffa3','#ff7ce5','#ffd166','#06d6a0','#118ab2'], line: { color: 'rgba(255,255,255,0.2)', width: 2 } },
    textinfo: 'label+percent',
    hoverinfo: 'label+value+percent'
  };
  Plotly.newPlot('brandChart', [trace], neonGlow({ showlegend: false }));
  Plotly.animate('brandChart', { data: [{ values: data.values.map(v=>v*1.02) }] }, { frame: { duration: 800 } });
  animateIntro('brandChart');
}

function renderRamChart(data) {
  const trace = {
    type: 'bar',
    x: data.labels,
    y: data.values.map(() => 0),
    marker: { color: colors.accent, line: { color: 'rgba(255,255,255,0.3)', width: 1 } }
  };
  Plotly.newPlot('ramChart', [trace], neonGlow());
  Plotly.animate('ramChart', { data: [{ y: data.values }] }, { transition: { duration: 800, easing: 'cubic-in-out' } });
  animateIntro('ramChart');
}

function renderCpuChart(data) {
  const trace = {
    type: 'bar',
    x: data.values.map(() => 0),
    y: data.labels,
    orientation: 'h',
    marker: { color: colors.accent2 }
  };
  Plotly.newPlot('cpuChart', [trace], neonGlow({ margin: { t: 30, r: 16, b: 36, l: 120 } }));
  Plotly.animate('cpuChart', { data: [{ x: data.values }] }, { transition: { duration: 900, easing: 'cubic-in-out' } });
  animateIntro('cpuChart');
}

function renderStorageGauge(data) {
  const total = data.ssd + data.hdd;
  const ssdPct = Math.round((data.ssd / total) * 100);
  const hddPct = 100 - ssdPct;
  const trace = {
    type: 'pie',
    values: [ssdPct, hddPct],
    labels: ['SSD','HDD'],
    hole: 0.6,
    marker: { colors: ['#00ffa3','#ff7c7c'] },
    textinfo: 'label+percent',
  };
  Plotly.newPlot('storageChart', [trace], neonGlow({ showlegend: false }));
  Plotly.animate('storageChart', { data: [{ values: [ssdPct + 2, hddPct - 2] }] }, { transition: { duration: 700 } });
  animateIntro('storageChart');
}

function renderResolutionChart(data) {
  const trace = {
    type: 'scatter',
    mode: 'lines+markers',
    x: data.labels,
    y: data.values.map(() => 0),
    line: { color: '#7cf0ff', width: 3 },
    fill: 'tozeroy',
    fillcolor: 'rgba(124, 240, 255, 0.12)'
  };
  Plotly.newPlot('resolutionChart', [trace], neonGlow());
  Plotly.animate('resolutionChart', { data: [{ y: data.values }] }, { transition: { duration: 1000, easing: 'cubic-in-out' } });
  animateIntro('resolutionChart');
}

function resizeHandler() { Plotly.Plots.resize(document.getElementById('brandChart')); Plotly.Plots.resize(document.getElementById('ramChart')); Plotly.Plots.resize(document.getElementById('cpuChart')); Plotly.Plots.resize(document.getElementById('storageChart')); Plotly.Plots.resize(document.getElementById('resolutionChart')); }

async function init() {
  const dataset = await loadData();
  renderBrandChart(dataset.brandCounts);
  renderRamChart(dataset.ramDistribution);
  renderCpuChart(dataset.cpuCounts);
  renderStorageGauge(dataset.storageRatio);
  renderResolutionChart(dataset.resolutionPopularity);
  window.addEventListener('resize', resizeHandler);
}

document.addEventListener('DOMContentLoaded', init);

// Scroll reveal for info sections
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Simple contact form automation (demo): validates and shows a status message
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const status = document.getElementById('formStatus');
    status.textContent = 'Sending…';
    // Placeholder automation: simulate send; replace with real endpoint later
    await new Promise(r => setTimeout(r, 800));
    status.textContent = `Thanks ${name}! I will get back to you at ${email}.`;
    form.reset();
  });
}


