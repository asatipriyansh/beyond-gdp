# Beyond GDP — Backend & Data Processing Pipeline

This directory contains the Python data processing and statistical analysis scripts for the **Beyond GDP** research platform.

## Directory Structure

```text
backend/
├── scripts/
│   └── process_data.py     # Main reproducible ETL pipeline
├── eda.py                  # Original baseline exploratory analysis script
├── requirements.txt        # Python dependency manifest
└── README.md               # Backend documentation
```

## Prerequisites

- **Python:** 3.10 or higher
- **Core Libraries:** `pandas`, `numpy`, `scipy`, `matplotlib`, `seaborn`

## Setup & Execution

### 1. Create and Activate Virtual Environment

```bash
# From repository root
python3 -m venv .venv
source .venv/bin/activate    # On macOS / Linux
# .venv\Scripts\activate     # On Windows
```

### 2. Install Dependencies

```bash
pip install -r backend/requirements.txt
```

### 3. Run the Data Pipeline

```bash
python3 backend/scripts/process_data.py
```

## Pipeline Architecture & Transformations

The `process_data.py` script executes the following stages:

1. **Raw Ingestion:** Loads `data/raw/world2023.csv` (146 sovereign nations, 10 primary indicators).
2. **Data Cleaning & Truncation:**
   - Detects and clips gross tertiary enrollment outliers above 100% (e.g., Greece 136.6%, Australia 113.1%, Grenada 106.9%, Turkey 100.6%) to 100%.
   - Drops 5 microstates lacking critical core variables (`LifeExp`, `GDP_bn`, `Pop_m`): Andorra, Eswatini, Monaco, Nauru, and North Macedonia, resulting in $N = 141$ cleaned countries.
3. **Derived Metrics:**
   - $\text{GDPpc} = \frac{\text{GDP\_bn} \times 10^9}{\text{Pop\_m} \times 10^6}$ (GDP per capita in US$)
   - $\text{CO2pc} = \frac{\text{CO2\_kt} \times 1000}{\text{Pop\_m} \times 10^6}$ (CO₂ per capita in metric tonnes)
   - $\log_{10}(\text{GDPpc})$ and $\log_{10}(\text{CO2pc})$ for log-transformed parametric modeling.
4. **OLS Regression & Residual Analysis:**
   - Fits $\text{LifeExp} = 34.52 + 10.00 \times \log_{10}(\text{GDPpc})$ ($R^2 = 0.69$, $p < 0.0001$, slope per doubling $\approx 3.01$ years).
   - Computes raw residuals $\text{LifeExp}_{\text{obs}} - \text{LifeExp}_{\text{fitted}}$ and standardized $z$-scores.
5. **Income Quartiles:** Segments countries into four GDP per capita quartiles (Poorest, Lower-Middle, Upper-Middle, Richest).
6. **Exploratory Livability Index:**
   - Narrows down to $N = 131$ countries with complete coverage across all 7 livability indicators.
   - Calculates 4 dimension sub-indices (Health, Social, Economic, Environmental) via min-max normalization.
   - Calculates 25% equal-weighted composite index, country ranks, and rank shifts against pure GDP rankings.
7. **IQR Outlier Audits:** Evaluates upper fences $Q_3 + 1.5 \times \text{IQR}$ across all continuous dimensions.
8. **Dual-Target Output Delivery:**
   - Automatically populates both `data/processed/` and `frontend/public/data/` with identical, validated JSON and CSV artifacts.
