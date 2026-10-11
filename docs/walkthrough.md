# Beyond GDP — Project Walkthrough & Implementation Dossier

## Executive Summary

The **Beyond GDP** research platform is a full-stack data analytics and interactive web platform developed for the course **BACSE301: Exploratory Data Analysis (CSE Data Science)**, Academic Year 2026–27.

The platform investigates the fundamental question: **"Is economic prosperity enough to make a country livable?"** It evaluates a 146-country dataset across four primary dimensions:
1. **Economic Prosperity** (GDP per capita, Unemployment)
2. **Health & Healthcare** (Life Expectancy, Infant Mortality, Physician Density)
3. **Social Development & Education** (Tertiary Education Enrollment)
4. **Environmental Sustainability** (CO₂ per capita, Forest Cover)

---

## Key Achievements & Milestones

### 1. Root-Cause Diagnosis & Fix of the Outliers Page Crash
- **Symptom:** `/outliers` crashed on load with `"Application error: a client-side exception has occurred"`.
- **Root Cause:** The component was destructuring non-existent keys (`iqr_thresholds`, `regression_model`, and `residuals`) from `outliers.json` (which actually stores `iqr_outliers` and `regression_residuals`). Attempting to spread `residuals.bottom_performers_negative` threw an uncaught `TypeError: Cannot read properties of undefined` on client hydration.
- **Resolution:**
  - Safely mapped `iqr_outliers` and `regression_residuals` with optional chaining and structural fallbacks.
  - Augmented `backend/scripts/process_data.py` to output the complete `all_residuals` array ($N = 141$).
  - Ensured `ExportButton` exports all 141 country residuals.
  - Re-tested with static production build and verified HTTP 200 and error-free rendering.

### 2. Professional Repository Reorganization
- Reorganized the workspace into standard GitHub-ready domains:
  - `frontend/`: Complete Next.js 14 App Router application with Tailwind CSS, Recharts, and TypeScript.
  - `backend/`: Python ETL pipeline (`process_data.py`), baseline exploratory script (`eda.py`), and `requirements.txt`.
  - `data/`: Isolated `raw/` and `processed/` data stores with full data dictionaries.
  - `tests/`: Automated statistical test suite (`test_stats.py`) with 9 comprehensive unit tests.
  - `docs/`: Academic documentation, mathematical methodology, data source provenance, and presentation slides.
  - Root: Convenience `package.json`, `.gitignore`, `.env.example`, `LICENSE`, and comprehensive `README.md`.

### 3. Rigorous Statistical Verification
All numerical findings match the project presentations and empirical calculations:
- $N = 146$ raw countries $\to$ $N = 141$ cleaned countries $\to$ $N = 131$ complete livability index sample.
- $\log_{10}(\text{GDPpc})$ vs Life Expectancy Pearson $r = 0.83$ ($R^2 = 0.69$, slope per doubling $\approx 3.01$ years).
- $\log_{10}(\text{GDPpc})$ vs $\log_{10}(\text{CO2pc})$ Pearson $r = 0.87$.
- Infant Mortality vs Life Expectancy Pearson $r = -0.93$.
- 8 high-CO₂ outliers flagged by $1.5\times \text{IQR}$ fences (Qatar, Kuwait, Bahrain, Brunei, Canada, Australia, Luxembourg, Kazakhstan).
- Worst health deficit residual: Equatorial Guinea (Observed $58.4$ yrs vs Fitted $73.6$ yrs, residual $-15.2$ yrs).
- Top 5 Livability Index countries: Finland, Austria, Australia, Norway, New Zealand.
- Documented rank shifts: Qatar (GDP rank 5 $\to$ Index rank 68, shift $-63$); Belarus (GDP rank 61 $\to$ Index rank 8, shift $+53$).
- Spearman correlation between GDP rank and Livability Index: $\rho = 0.83$.

---

## 11 Interactive Routes Overview

1. **`/` (Overview & Homepage):** Research introduction, editorial executive cards, and Preston Curve scatter plot.
2. **`/explore` (EDA Dashboard):** Interactive distribution histograms, box plots, income quartile cross-tabulations, and missing data audit.
3. **`/compare` (Comparison Studio):** Side-by-side indicator matrix and 4-dimension radar chart comparisons across any 2–4 nations.
4. **`/countries` (Country Directory):** Searchable, filterable directory of all 146 countries with sorting by income, region, and livability score.
5. **`/countries/[country]` (Dynamic Country Dossier):** Pre-rendered static profile pages for every sovereign nation in the dataset.
6. **`/relationships` (Bivariate Explorer):** Scatter plot engine with log/linear toggles, regression lines, and interactive Pearson/Spearman heatmaps.
7. **`/environment` (Environmental Trade-offs):** Log-log carbon-wealth analysis, decoupling visualizer, and forest cover analysis.
8. **`/outliers` (Anomaly & Residual Dossier):** $1.5\times \text{IQR}$ fence tables, OLS regression residual bar chart, and deep-dive case studies.
9. **`/livability-index` (Exploratory Index Simulator):** Real-time interactive dimension weight sliders (Health, Social, Economic, Environmental) with instantaneous recalculation of scores, ranks, and rank shifts.
10. **`/methodology` (Statistical Methodology):** Comprehensive academic documentation of formulas, transformations, and sample selection criteria.
11. **`/data-sources` (Data Provenance & Registry):** Citation registry for World Bank, WHO, UN, UNESCO, and ILO datasets.
