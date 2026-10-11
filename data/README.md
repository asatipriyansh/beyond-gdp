# Beyond GDP — Data Catalog & Provenance

This directory stores the raw and processed statistical datasets utilized throughout the Beyond GDP research platform.

## Directory Structure

```text
data/
├── raw/
│   └── world2023.csv       # Original immutable raw dataset (146 countries)
├── processed/
│   ├── clean.csv           # Cleaned dataset with derived metrics (141 countries)
│   ├── index.csv           # 7-indicator complete sample with index scores (131 countries)
│   ├── countries.json      # Master dossier for all 146 countries (raw, clean, index)
│   ├── summary_stats.json  # Univariate descriptive statistics, IQR, and skewness
│   ├── correlations.json   # Pearson & Spearman correlation matrices and p-values
│   ├── income_quartiles.json # Quartile groupings and median profiles
│   ├── outliers.json       # IQR fences, outlier lists, and OLS regression residuals
│   ├── index_rankings.json # Livability index rankings, top climbers, and fallers
│   └── raw_metadata.json   # Missing data audit and cleaning records
└── README.md
```

## Raw Indicator Dictionary (`world2023.csv`)

| Variable | Full Name | Unit | Primary Source | Coverage ($N=146$) |
| :--- | :--- | :--- | :--- | :--- |
| `Country` | Sovereign Nation Name | Text | UN Member States standard | 146 / 146 (100%) |
| `GDP_bn` | Gross Domestic Product | Billion US$ | World Bank World Development Indicators (2023) | 144 / 146 (98.6%) |
| `Pop_m` | Total Population | Millions | UN Population Division (2023) | 146 / 146 (100%) |
| `LifeExp` | Life Expectancy at Birth | Years | WHO Global Health Observatory | 142 / 146 (97.3%) |
| `CO2_kt` | Carbon Dioxide Emissions | Kilotonnes | Global Carbon Atlas / EDGAR (2023) | 141 / 146 (96.6%) |
| `InfMort` | Infant Mortality Rate | Deaths / 1k live births | UN Inter-agency Group for Child Mortality Estimation | 143 / 146 (97.9%) |
| `Phys` | Physicians Density | Medical doctors / 1,000 people | WHO Global Health Workforce Statistics | 143 / 146 (97.9%) |
| `Unemp` | Total Unemployment Rate | % of total labor force | International Labour Organization (ILOSTAT) | 141 / 146 (96.6%) |
| `Tertiary` | Tertiary School Enrollment | % gross enrollment ratio | UNESCO Institute for Statistics | 136 / 146 (93.2%) |
| `Forest` | Forest Area Coverage | % of total land area | FAO Global Forest Resources Assessment | 145 / 146 (99.3%) |

## Data Provenance & Redistribution

- **Provenance:** The raw dataset aggregates public metrics from official multilateral institutions:
  - World Bank Open Data (licensed under Creative Commons Attribution 4.0 International — CC BY 4.0).
  - World Health Organization Open Data Repository.
  - United Nations Statistics Division.
- **Redistribution Terms:** These datasets are redistributed strictly for academic and educational non-commercial research purposes in accordance with CC BY 4.0 and open government data policies. All source indicators remain the property of their respective originating institutions.
