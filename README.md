# Laptop Data Analysis — Python + Interactive Dashboards

Analyze 3,976 laptops across brands to uncover trends in RAM, CPU/GPU, storage (SSD/HDD), screen resolutions, and OS. This repo contains a clean EDA notebook and modern, animated web dashboards (Plotly + Chart.js) with a responsive neon UI and a 3D bubbles background.

## Features
- Preprocessing: column cleanup, `Ram`→`ram_gb`, `ScreenResolution`→width/height/ppi, `Memory` split into `ssd_gb`/`hdd_gb`
- EDA: shape/info/stats, brand counts, average RAM/Inches, top CPU/GPU/OS, correlation heatmap
- Visualizations: notebook figures to `visualizations/`, Plotly and Chart.js dashboards in `web/`
- Optional: export notebook aggregates to `web/data.json` for the sites

## Structure
```
.
├─ laptop_analysis.ipynb
├─ web/
│  ├─ index.html        # Plotly dashboard
│  ├─ chartjs.html      # Chart.js dashboard
│  ├─ styles.css        # Shared responsive neon styling
│  ├─ app.js            # Plotly logic
│  ├─ chartjs.js        # Chart.js logic
│  ├─ threebg.js        # 3D bubbles background
│  └─ data.json         # (optional) exported data
└─ visualizations/      # created at runtime by notebook
```

## Run the notebook
1) Place `laptop_data.csv` in the repo root.
2) Open `laptop_analysis.ipynb` and Run All.
3) Figures save to `visualizations/`.
4) (Optional) Run the export cell to create `web/data.json`.

## Run the web dashboards
```bash
cd web
python -m http.server 8080
# Plotly:   http://localhost:8080/
# Chart.js: http://localhost:8080/chartjs.html
```
- Uses built-in sample data by default; can load `data.json` if exported.

## Tech
- Python: Pandas, NumPy, Matplotlib, Seaborn, Plotly
- Web: HTML, CSS, JavaScript, Chart.js, Plotly.js, Three.js

## Author
Saiprushna Odnam — B.Tech CSE (Data Science)

> “Data is a precious thing and will last longer than the systems themselves.”

## License
For educational use. Add a LICENSE file to specify terms.
