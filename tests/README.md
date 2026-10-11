# Beyond GDP — Automated Statistical Verification Suite

This directory contains the Python unit test suite that guarantees mathematical and statistical integrity across all analytical artifacts consumed by the Beyond GDP frontend.

## Directory Structure

```text
tests/
├── test_stats.py       # Comprehensive statistical unit test suite
└── README.md           # Testing instructions & test catalogue
```

## Running the Test Suite

You can execute the test suite via npm or standard Python `unittest`:

```bash
# Option 1: Via root npm script
npm test

# Option 2: Directly via Python
python3 -m unittest discover -s tests -p 'test_*.py'

# Option 3: Direct script invocation
python3 tests/test_stats.py
```

## Test Specifications & Validation Criteria

| Test Name | Validated Assertion | Baseline Target |
| :--- | :--- | :--- |
| `test_sample_sizes` | Raw ($N=146$), Clean ($N=141$), Index Complete ($N=131$) counts | $146, 141, 131$ |
| `test_loggdp_lifeexp_correlation` | $\log_{10}(\text{GDPpc})$ vs $\text{LifeExp}$ Pearson $r$, slope/doubling, $R^2$ | $r \approx 0.83$, slope $\approx 3.01$ yrs, $R^2 \approx 0.69$ |
| `test_loggdp_logco2_correlation` | $\log_{10}(\text{GDPpc})$ vs $\log_{10}(\text{CO2pc})$ Pearson $r$ | $r \approx 0.87$ |
| `test_infmort_lifeexp_correlation` | Infant Mortality vs Life Expectancy Pearson $r$ | $r \approx -0.93$ |
| `test_co2_iqr_outliers` | CO₂ $1.5\times \text{IQR}$ upper fence detection count & country membership | 8 nations (Qatar, Kuwait, Bahrain, Brunei, Canada, Australia, Luxembourg, Kazakhstan) |
| `test_equatorial_guinea_residual` | Worst negative life expectancy regression residual | Observed $58.4$ vs Fitted $73.6$ ($\approx -15.2$ yrs) |
| `test_index_top_5` | Top 5 nations in 4-dimension composite livability index | Finland, Austria, Australia, Norway, New Zealand |
| `test_index_shifts` | Qatar rank drop (GDP rank 5 $\to$ Index rank 68, shift $-63$); Belarus climb (GDP 61 $\to$ Index 8, shift $+53$) | Exact documented rank shifts |
| `test_index_rank_correlation` | Spearman correlation between GDP rank and Livability Index | $\rho \approx 0.83$ |
