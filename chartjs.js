/* Sample data with small randomization helpers */
const DATA = {
  brands: { labels: ['Dell','HP','Lenovo','Apple','Asus','Acer','MSI'], values: [780,720,690,420,380,330,200] },
  ram: { labels: ['4GB','8GB','12GB','16GB','32GB'], values: [260,1680,520,980,180] },
  cpu: { labels: ['Intel i3','Intel i5','Intel i7','Ryzen 5','Ryzen 7','Apple M1/M2'], values: [410,1380,940,520,340,220] },
  storage: { ssd: 2700, hdd: 1276 },
  resolution: { labels: ['1366x768','1600x900','1920x1080','2560x1600','2880x1800','3840x2160'], values: [620,260,1960,430,180,200] },
  scatter: { x: [11.6,13.3,14.0,15.6,17.3], y: [4,8,12,16,32] }
};

function jitter(val, pct=0.06) {
  const delta = val * pct;
  const sign = Math.random() > 0.5 ? 1 : -1;
  return Math.max(0, Math.round(val + sign * Math.random() * delta));
}

/* Palette and gradient helpers */
const COLORS = {
  cyan: '#7cf0ff', magenta: '#ff7ce5', lime: '#00ffa3', purple: '#a78bfa', yellow: '#ffd166'
};

function gradient(ctx, c1, c2) {
  const g = ctx.createLinearGradient(0, 0, 0, 320);
  g.addColorStop(0, c1);
  g.addColorStop(1, c2);
  return g;
}

let charts = {};

function createCharts() {
  const easing = 'easeInOutCubic';
  // Shadow/glow plugin for nicer look
  const glow = {
    id: 'glow',
    beforeDatasetDraw(chart, args, opts) {
      const {ctx} = chart;
      ctx.save();
      ctx.shadowColor = 'rgba(124,240,255,0.25)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    },
    afterDatasetDraw(chart, args, opts) {
      chart.ctx.restore();
    }
  };
  Chart.register(glow);

  // Brand Pie (rotating)
  const brandCtx = document.getElementById('brandPie').getContext('2d');
  charts.brandPie = new Chart(brandCtx, {
    type: 'pie',
    data: { labels: DATA.brands.labels, datasets: [{ data: DATA.brands.values, backgroundColor: [COLORS.cyan, COLORS.purple, COLORS.lime, COLORS.magenta, COLORS.yellow, '#06d6a0', '#118ab2'], borderColor: 'rgba(255,255,255,0.25)', borderWidth: 2 }] },
    options: { responsive: true, animation: { animateRotate: true, duration: 1600, easing }, rotation: -0.5 * Math.PI, plugins: { legend: { labels: { color: '#e6e9f0' } } } }
  });

  // RAM Bar (vertical grow)
  const ramCtx = document.getElementById('ramBar').getContext('2d');
  charts.ramBar = new Chart(ramCtx, {
    type: 'bar',
    data: { labels: DATA.ram.labels, datasets: [{ data: DATA.ram.values.map(()=>0), backgroundColor: gradient(ramCtx, 'rgba(124,240,255,0.85)', 'rgba(167,139,250,0.4)'), borderRadius: 8 }] },
    options: { responsive: true, animation: { duration: 1200, easing }, scales: { x: { ticks: { color: '#cdd3df' }, grid: { color: 'rgba(255,255,255,0.06)' } }, y: { ticks: { color: '#cdd3df' }, grid: { color: 'rgba(255,255,255,0.06)' } } }, plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10,12,28,.9)', borderColor: 'rgba(124,240,255,.35)', borderWidth: 1 } } }
  });

  // CPU Horizontal Bar (staggered)
  const cpuCtx = document.getElementById('cpuHBar').getContext('2d');
  charts.cpuHBar = new Chart(cpuCtx, {
    type: 'bar',
    data: { labels: DATA.cpu.labels, datasets: [{ data: DATA.cpu.values.map(()=>0), backgroundColor: gradient(cpuCtx, 'rgba(167,139,250,0.85)', 'rgba(124,240,255,0.35)') }] },
    options: { indexAxis: 'y', responsive: true, animation: { duration: 1200, easing, delay: ctx => ctx.dataIndex * 120 }, scales: { x: { ticks: { color: '#cdd3df' }, grid: { color: 'rgba(255,255,255,0.06)' } }, y: { ticks: { color: '#cdd3df' }, grid: { color: 'rgba(255,255,255,0.06)' } } }, plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10,12,28,.9)', borderColor: 'rgba(124,240,255,.35)', borderWidth: 1 } } }
  });

  // Storage Doughnut
  const storageCtx = document.getElementById('storageDoughnut').getContext('2d');
  charts.storageDoughnut = new Chart(storageCtx, {
    type: 'doughnut',
    data: { labels: ['SSD','HDD'], datasets: [{ data: [0, 0], backgroundColor: [COLORS.lime, '#ff7c7c'], borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)' }] },
    options: { cutout: '62%', responsive: true, animation: { animateRotate: true, duration: 1100, easing }, plugins: { legend: { labels: { color: '#e6e9f0' } }, tooltip: { backgroundColor: 'rgba(10,12,28,.9)', borderColor: 'rgba(124,240,255,.35)', borderWidth: 1 } } }
  });

  // Resolution Line (wave)
  const resCtx = document.getElementById('resolutionLine').getContext('2d');
  charts.resolutionLine = new Chart(resCtx, {
    type: 'line',
    data: { labels: DATA.resolution.labels, datasets: [{ data: DATA.resolution.values.map(()=>0), fill: true, borderWidth: 3, borderColor: COLORS.cyan, backgroundColor: gradient(resCtx, 'rgba(124,240,255,0.35)', 'rgba(124,240,255,0.06)'), tension: 0.35, pointRadius: 3, pointBackgroundColor: COLORS.cyan }] },
    options: { responsive: true, animation: { duration: 1200, easing }, scales: { x: { ticks: { color: '#cdd3df' }, grid: { color: 'rgba(255,255,255,0.06)' } }, y: { ticks: { color: '#cdd3df' }, grid: { color: 'rgba(255,255,255,0.06)' } } }, plugins: { legend: { display: false }, tooltip: { backgroundColor: 'rgba(10,12,28,.9)', borderColor: 'rgba(124,240,255,.35)', borderWidth: 1 } } }
  });

  // Scatter RAM vs Inches
  const scatterCtx = document.getElementById('ramVsInchesScatter').getContext('2d');
  charts.ramVsInchesScatter = new Chart(scatterCtx, {
    type: 'scatter',
    data: { datasets: [{ label: 'RAM vs Inches', data: DATA.scatter.x.map((x,i)=>({ x, y: 0 })), pointRadius: 5, pointBackgroundColor: COLORS.magenta, borderColor: COLORS.magenta, showLine: false }] },
    options: { responsive: true, scales: { x: { title: { display: true, text: 'Inches', color: '#cdd3df' }, ticks: { color: '#cdd3df' }, grid: { color: 'rgba(255,255,255,0.06)' } }, y: { title: { display: true, text: 'RAM (GB)', color: '#cdd3df' }, ticks: { color: '#cdd3df' }, grid: { color: 'rgba(255,255,255,0.06)' } } }, plugins: { legend: { labels: { color: '#e6e9f0' } }, tooltip: { backgroundColor: 'rgba(10,12,28,.9)', borderColor: 'rgba(124,240,255,.35)', borderWidth: 1 } }, animation: { duration: 1000, easing } }
  });

  // Kick in animations to actual values after initial render
  setTimeout(() => {
    charts.ramBar.data.datasets[0].data = DATA.ram.values;
    charts.cpuHBar.data.datasets[0].data = DATA.cpu.values;
    charts.storageDoughnut.data.datasets[0].data = [DATA.storage.ssd, DATA.storage.hdd];
    charts.resolutionLine.data.datasets[0].data = DATA.resolution.values;
    charts.ramVsInchesScatter.data.datasets[0].data = DATA.scatter.x.map((x,i)=>({ x, y: DATA.scatter.y[i] }));
    Object.values(charts).forEach(c => c.update());
  }, 150);

  // Continuous rotation for pie
  setInterval(() => {
    const opt = charts.brandPie.options;
    opt.rotation = (opt.rotation || 0) + 0.08; // rotate slightly
    charts.brandPie.update('none');
  }, 1200);
}

function randomizeData() {
  document.getElementById('spinner').style.display = 'inline-block';
  DATA.brands.values = DATA.brands.values.map(v => jitter(v));
  DATA.ram.values = DATA.ram.values.map(v => jitter(v));
  DATA.cpu.values = DATA.cpu.values.map(v => jitter(v));
  const totalStorage = DATA.storage.ssd + DATA.storage.hdd;
  const ssd = jitter(DATA.storage.ssd);
  const hdd = Math.max(0, totalStorage - ssd);
  DATA.storage = { ssd, hdd };
  DATA.resolution.values = DATA.resolution.values.map(v => jitter(v));
  DATA.scatter.y = DATA.scatter.y.map(v => jitter(v));

  // Update charts smoothly
  charts.brandPie.data.datasets[0].data = DATA.brands.values;
  charts.ramBar.data.datasets[0].data = DATA.ram.values;
  charts.cpuHBar.data.datasets[0].data = DATA.cpu.values;
  charts.storageDoughnut.data.datasets[0].data = [DATA.storage.ssd, DATA.storage.hdd];
  charts.resolutionLine.data.datasets[0].data = DATA.resolution.values;
  charts.ramVsInchesScatter.data.datasets[0].data = DATA.scatter.x.map((x,i)=>({ x, y: DATA.scatter.y[i] }));

  Object.values(charts).forEach(c => c.update());
  setTimeout(()=> document.getElementById('spinner').style.display = 'none', 400);
}

function periodicUpdates() {
  // Optional continuous motion
  return setInterval(() => {
    // small wave for line
    charts.resolutionLine.data.datasets[0].data = charts.resolutionLine.data.datasets[0].data.map((v,i)=> v + Math.sin(Date.now()/800 + i)*2);
    // subtle bounce for scatter
    charts.ramVsInchesScatter.data.datasets[0].data = charts.ramVsInchesScatter.data.datasets[0].data.map(p => ({ x: p.x, y: p.y + Math.sin(Date.now()/900 + p.x)*0.5 }));
    charts.resolutionLine.update('active');
    charts.ramVsInchesScatter.update('active');
  }, 1200);
}

document.addEventListener('DOMContentLoaded', () => {
  createCharts();
  const timer = periodicUpdates();
  document.getElementById('refreshBtn').addEventListener('click', randomizeData);
  window.addEventListener('beforeunload', () => clearInterval(timer));
});


