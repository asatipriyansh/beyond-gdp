# Beyond GDP: What Really Makes a Country Livable?

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black)](https://nextjs.org/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue)](https://python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)](https://tailwindcss.com/)
[![Course](https://img.shields.io/badge/Course-BACSE301-orange)](https://github.com/)

An interactive full-stack exploratory data analysis (EDA) platform and research companion investigating whether economic output alone is sufficient to create a livable and sustainable society.

Developed for **BACSE301: Exploratory Data Analysis (CSE – Data Science)**, Academic Year 2026–27.

---

## 1. Project Overview

### Research Question
> **"Is economic prosperity enough to make a country livable?"**

For decades, Gross Domestic Product (GDP) per capita has served as the default benchmark for national progress. However, aggregate monetary metrics conceal crucial trade-offs: environmental degradation, extreme inequality, underfunded public health systems, and persistent unemployment. 

This research analyzes a global dataset of **146 sovereign nations** across four core dimensions of human flourishing:
1. **Economic Prosperity:** Per capita gross domestic product and unemployment rates.
2. **Health & Healthcare:** Life expectancy at birth, infant mortality rates, and physician density.
3. **Social Development & Education:** Gross tertiary education enrollment.
4. **Environmental Sustainability:** Per capita carbon dioxide emissions and forest cover percentage.

### Key Analytical Findings (Empirically Validated)
- **The Preston Curve & Diminishing Longevity Returns:** Across $N = 141$ countries, $\log_{10}(\text{GDPpc})$ exhibits a strong linear correlation with life expectancy ($r = 0.83$, $R^2 = 0.69$, $p < 10^{-36}$). Each doubling of GDP per capita yields an average gain of **~3.01 years** of life expectancy. In low-income brackets, wealth increases save lives rapidly; beyond ~$25,000 GDP per capita, the longevity curve flattens substantially.
- **The Carbon Paradox:** Per capita wealth strongly correlates with per capita carbon emissions ($r = 0.87$). Economic expansion in the 20th century remains inextricably tied to fossil fuel consumption.
- **Health Efficiency Overachievers & Deficits:**
  - *Deficit Outlier:* **Equatorial Guinea** suffers a life expectancy **15.2 years below** the fitted economic trend line (Observed 58.4 years vs. Predicted 73.6 years at $8,110 GDPpc) due to extreme wealth concentration and minimal public healthcare infrastructure.
  - *Efficiency Overachiever:* **Nicaragua** achieves a life expectancy of **74.3 years** (Predicted 67.3 years, $+7.0$ years residual) at an income of only $1,911 GDPpc through universal community primary care.
- **Decoupling Wealth from Livability:** When evaluating countries across the multidimensional **Livability Index** ($N = 131$), major rank divergences appear:
  - **Qatar** plunges **63 spots** (GDP rank 5 $\to$ Index rank 68) due to extreme carbon emissions (36.5 tonnes/person) and modest educational enrollment relative to wealth.
  - **Belarus** climbs **53 spots** (GDP rank 61 $\to$ Index rank 8) through high tertiary education, low infant mortality, and 43% forest cover.
  - Overall GDP-rank to Livability-rank correlation is $\rho = 0.83$, proving that while wealth matters, it is far from the sole determinant of human well-being.

---

## 2. Technology Stack

- **Frontend Framework:** Next.js 14 (App Router) with TypeScript
- **Styling & Design System:** Tailwind CSS with custom editorial brand palette
- **Data Visualizations:** Recharts (Bivariate Scatter Plots, Regression Residual Bar Charts, 4-Dimension Radar Charts, Correlation Heatmaps)
- **Icons:** Lucide React
- **Data Engineering & Statistics:** Python 3.10+, Pandas, NumPy, SciPy (linregress, pearsonr, spearmanr)
- **Verification & Automated Testing:** Python `unittest` suite (`tests/test_stats.py`)

---

## 3. Repository Architecture

```text
beyond-gdp/
├── frontend/                     # Next.js 14 Web Application
│   ├── src/
│   │   ├── app/                  # 11 App Router routes & layouts
│   │   ├── components/           # Reusable UI cards, badges, charts, nav
│   │   └── lib/                  # Data loaders & dynamic livability calculator
│   ├── public/
│   │   └── data/                 # JSON & CSV artifacts served to client
│   ├── package.json              # Frontend dependency manifest
│   ├── next.config.mjs           # Next.js configuration
│   ├── tsconfig.json             # TypeScript configuration
│   └── tailwind.config.ts        # Design system & color tokens
├── backend/                      # Python Data Processing & Analysis
│   ├── scripts/
│   │   └── process_data.py       # Reproducible ETL & derived metrics pipeline
│   ├── eda.py                    # Baseline exploratory Python analysis script
│   ├── requirements.txt          # Python dependencies manifest
│   └── README.md                 # Backend documentation
├── data/                         # Data Storage & Provenance
│   ├── raw/
│   │   └── world2023.csv         # Immutable raw dataset (146 countries)
│   ├── processed/                # Canonical generated JSON/CSV datasets
│   └── README.md                 # Data dictionary & licensing
├── tests/                        # Automated Statistical Test Suite
│   ├── test_stats.py             # Unit tests validating mathematical accuracy
│   └── README.md                 # Testing instructions
├── docs/                         # Academic Documentation
│   ├── methodology.md            # Formulas, OLS models, and normalization
│   ├── data-sources.md           # Multilateral data provenance registry
│   ├── walkthrough.md            # Engineering walkthrough & bugfix dossier
│   └── presentations/            # Final review slide decks (.pdf, .pptx)
├── .gitignore                    # Comprehensive Git exclusions
├── .env.example                  # Environment template
├── LICENSE                       # MIT License
├── package.json                  # Root orchestration & convenience scripts
└── README.md                     # Project master documentation
```

---

## 4. Website Routes & Interactive Features

| Route | Title | Key Interactive Visualizations & Controls |
| :--- | :--- | :--- |
| `/` | **Research Overview** | Editorial executive cards, 4-dimension overview, Preston Curve scatter plot with hover tooltip cards. |
| `/explore` | **EDA Dashboard** | Variable selector, income quartile filters, distribution histogram, missing data audit, and summary statistics table. |
| `/compare` | **Comparison Studio** | Multi-country selector (2–4 nations), side-by-side indicator matrix, and interactive 4-dimension radar comparison. |
| `/countries` | **Country Directory** | Search by country name, sort by GDP/Life Expectancy/Livability Index, income quartile filters, and CSV export. |
| `/countries/[country]` | **Country Dossier** | Dynamic dossier for all 146 nations with radar profile, percentile meters, raw vs clean metrics, and regression residuals. |
| `/relationships` | **Correlation Explorer** | Bivariate scatter engine, toggleable Pearson & Spearman correlation heatmaps, variable axis selectors, and OLS regression stats. |
| `/environment` | **Environmental Trade-Offs** | Log-log wealth vs emissions scatter plot, emissions quartile analysis, and forest cover trade-off distributions. |
| `/outliers` | **Outliers Dossier** | $1.5\times \text{IQR}$ upper fence tables, OLS regression residual bar chart ($N = 20$), deep-dive case studies, and full residual CSV export. |
| `/livability-index` | **Livability Index Engine** | Real-time interactive weight sliders (Health, Social, Economic, Environmental) with instantaneous recalculation of scores, ranks, and rank shifts. |
| `/methodology` | **Methodology Documentation** | Complete mathematical documentation of min-max scaling, OLS regression formulas, and truncation rules. |
| `/data-sources` | **Data Provenance** | Full registry of originating multilateral sources, metadata citations, and redistribution terms. |

---

## 5. Quickstart & Installation

### Prerequisites
- **Node.js:** v18.17.0 or higher
- **npm:** v9.0.0 or higher
- **Python:** v3.10 or higher

### Option 1: Running the Frontend Immediately (Pre-computed Data Included)

All pre-computed JSON and CSV analytical artifacts are committed in `frontend/public/data/`. You can start the website immediately without running Python:

```bash
# Clone the repository
git clone <repository-url>
cd beyond-gdp

# Install frontend dependencies
npm --prefix frontend install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

### Option 2: Full Setup (Python Pipeline + Frontend)

To run the full reproducibility pipeline from the raw CSV data:

#### 1. Setup Python Environment
```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate       # On macOS / Linux
# .venv\Scripts\activate        # On Windows

# Install Python dependencies
pip install -r backend/requirements.txt
```

#### 2. Regenerate Analytical Artifacts
```bash
python3 backend/scripts/process_data.py
```
*This reads `data/raw/world2023.csv`, executes data cleaning, fits regressions, calculates the livability index, and synchronizes all outputs to `data/processed/` and `frontend/public/data/`.*

#### 3. Run Statistical Verification Tests
```bash
npm test
# Or: python3 -m unittest discover -s tests -p 'test_*.py'
```

#### 4. Run Frontend Production Build & Server
```bash
# Build production bundle
npm run build

# Start production server
npm start
```

---

## 6. Sample Sizes & Statistical Validation

The pipeline enforces three sample sizes matching project findings:
- **Raw Sample ($N = 146$):** 146 sovereign countries in `world2023.csv`. Zero duplicate rows or country identifiers.
- **Cleaned Analytical Sample ($N = 141$):** Dropped 5 microstates with missing demographic/economic fundamentals (`LifeExp`, `GDP_bn`, or `Pop_m`): *Andorra, Eswatini, Monaco, Nauru, and North Macedonia*.
- **Livability Index Complete Sample ($N = 131$):** Exactly 131 countries possess complete observations across all 7 livability indicators (`LifeExp`, `InfMort`, `Phys`, `Unemp`, `Tertiary`, `CO2pc`, `Forest`).

---

## 7. GitHub Collaboration Guidelines

Collaborators and friends can work on the project using the following workflow:

1. **Clone & Branch:**
   ```bash
   git clone <repository-url>
   cd beyond-gdp
   git checkout -b feature/your-feature-name
   ```
2. **Setup Dependencies:**
   ```bash
   npm --prefix frontend install
   python3 -m venv .venv && source .venv/bin/activate
   pip install -r backend/requirements.txt
   ```
3. **Verify Before Committing:**
   ```bash
   # Run statistical unit tests
   npm test
   # Run Next.js production build to check for type and bundling errors
   npm run build
   ```
4. **Push & Create Pull Request:**
   ```bash
   git add .
   git commit -m "feat: describe your enhancement"
   git push origin feature/your-feature-name
   ```

---

## 8. Limitations & Academic Caveats

1. **Cross-Sectional Snapshot:** The dataset represents a cross-sectional snapshot of the year 2023. It does not model longitudinal panel trends or lag effects between educational investment and economic returns.
2. **Missing Indicators:** Due to multilateral reporting gaps, indicators for mental health, subjective well-being (e.g., Cantril Ladder), political freedom, and income inequality (Gini coefficient) were not uniformly available for all 146 countries and are excluded from the index.
3. **Index Weight Sensitivity:** The baseline Livability Index applies equal weights ($25\%$ each) across the 4 dimensions. While this avoids arbitrary favoritism, real-world societal priorities vary. Use the interactive slider engine on `/livability-index` to simulate alternative policy weighting schemes.

---

## 9. Project Credits & Academic Attribution

**Course:** Exploratory Data Analysis — BACSE301  
**Department:** CSE – Data Science  
**Academic Year:** 2026–27  

**Student Researchers:**
- **Priyansh Asati**
- **Medisetty Venkata Guru Sri Harsha**
- **Nayani Balaji**

---

## 10. License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
Multilateral data sources are used under academic fair use and open data licenses (World Bank CC BY 4.0, WHO Open Data).
