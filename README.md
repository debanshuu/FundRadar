# FundRadar

### Mutual Fund Comparison & Research Platform

A full-stack web application for searching, comparing, and analyzing Indian mutual funds using real-time NAV data — built to help investors spot portfolio overlap before they invest.

**Live Demo:** https://fund-radar.vercel.app

---

## What it does

Search any SEBI-registered mutual fund and get everything you need to compare it:

- **Fund Search** — search by fund name or AMC
- **NAV History Chart** — interactive chart with adjustable time ranges (1W to 3Y)
- **Side-by-Side Comparison** — compare up to 3 funds at once across 1M–3Y returns
- **CAGR Calculator** — enter an amount and date to calculate annualised returns
- **Holdings Overlap Checker** — see how much two funds share in their top holdings, with a diversification warning when overlap is high

---

## Features

- **Real-Time NAV Data** — pulled live from MFAPI.in, covering all SEBI-registered Indian mutual funds
- **Interactive Charts** — Chart.js visualizations across multiple time ranges
- **Best Performer Highlighting** — comparison table auto-highlights the top fund per metric
- **Curated Overlap Data** — top holdings manually compiled for 20+ popular funds across Large Cap, Mid Cap, Small Cap, Flexi Cap, ELSS, Index, and Hybrid categories
- **Responsive Design** — works on mobile and desktop

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Chart.js, React Router |
| Backend | Node.js, Express.js |
| Data Source | MFAPI.in |
| Deployment | Vercel (frontend), Render (backend) |

---

## REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/funds/search?q= | Search funds by name or AMC |
| GET | /api/funds/:schemeCode | Get NAV history and metadata |
| POST | /api/funds/compare | Compare multiple funds |
| POST | /api/overlap/check | Get holdings overlap between two funds |

---

## Run Locally

**Clone the repo:**
```bash
git clone https://github.com/debanshuu/FundRadar.git
cd FundRadar
```

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
```

**Create a `.env` file in `client/`:**
```
VITE_API_BASE_URL=http://localhost:5050/api
```

**Run:**
```bash
npm run dev
```

---

Made by **Debanshu Brahma**
