# Methodology & Mathematical Framework

## 1. Research Question & Scope

> **Primary Research Question:** Is economic prosperity alone sufficient to create a livable and sustainable society, or do multidimensional indicators expose critical blind spots in Gross Domestic Product?

Traditional macroeconomic analyses rely almost exclusively on Gross Domestic Product (GDP) per capita as the proxy for human progress. This investigation evaluates where GDP succeeds as a predictor of welfare, where its marginal utility diminishes, and where it fails to capture health inequities, unemployment shocks, and environmental degradation.

---

## 2. Data Cleaning & Sample Inclusion Criteria

### 2.1 Raw Dataset Audit
- **Source:** Global country metrics snapshot ($2023$).
- **Raw Observations:** 146 sovereign countries.
- **Initial Verification:** Zero duplicate rows; zero duplicate country identifiers.

### 2.2 Gross Tertiary Enrollment Truncation
UNESCO's Gross Enrollment Ratio (GER) for tertiary education compares total enrollment (regardless of age) to the population in the official 5-year post-secondary age group. Because mature students and repeat enrollments inflate the numerator, values exceed 100% in multiple countries:
- Greece: 136.6%
- Australia: 113.1%
- Grenada: 106.9%
- Turkey: 100.6%

To maintain mathematical stability for linear normalization without artificially penalizing countries with high lifelong learning participation, values exceeding 100% are clipped to 100.0%.

### 2.3 Sample Stratification

1. **Raw Dataset ($N = 146$):** All ingested records preserved in `data/raw/world2023.csv`.
2. **Cleaned Analytical Dataset ($N = 141$):** Dropped 5 microstates with missing values in core demographic or economic fields (`LifeExp`, `GDP_bn`, or `Pop_m`):
   - Andorra (missing LifeExp, Pop_m)
   - Eswatini (missing Pop_m)
   - Monaco (missing LifeExp, Pop_m)
   - Nauru (missing LifeExp, Pop_m)
   - North Macedonia (missing LifeExp)
3. **Complete Index Sample ($N = 131$):** Exactly 131 countries possess complete records across all 7 livability indicators and are included in the Exploratory Livability Index.

---

## 3. Statistical Analysis & Transformations

### 3.1 Logarithmic Transformations
Economic and emissions distributions exhibit strong positive right-skewness:
- Raw GDP per capita skewness: $2.49$
- Log₁₀ GDP per capita skewness: $-0.26$

By applying base-10 logarithmic transformation, the relationship between per capita wealth and life expectancy linearizes, aligning with the Preston Curve hypothesis:
$$\log_{10}(\text{GDPpc}_i) = \log_{10}\left(\frac{\text{GDP\_bn}_i \times 10^9}{\text{Pop\_m}_i \times 10^6}\right)$$

### 3.2 Ordinary Least Squares (OLS) Regression
We model life expectancy as a function of log per capita income:
$$\widehat{\text{LifeExp}}_i = \beta_0 + \beta_1 \log_{10}(\text{GDPpc}_i)$$

Fitted parameters ($N = 141$):
- Intercept ($\beta_0$): $34.52$
- Slope ($\beta_1$): $10.00$
- Coefficient of Determination ($R^2$): $0.69$ ($r = 0.83$, $p < 10^{-36}$)
- **Slope per Income Doubling:**
  $$\Delta \text{LifeExp} = \beta_1 \times \log_{10}(2) = 10.00 \times 0.30103 \approx 3.01\text{ years}$$
  *Interpretation: Each doubling of GDP per capita is associated with an average gain of ~3.0 years of life expectancy.*

### 3.3 Residual Diagnostics
Residuals capture deviations from expected longevity:
$$\epsilon_i = \text{LifeExp}_i - \widehat{\text{LifeExp}}_i$$
- **Health Deficit Outliers ($\epsilon_i \ll 0$):** Equatorial Guinea ($-15.2$ yrs), Nigeria ($-13.7$ yrs), Lesotho ($-11.5$ yrs).
- **Health Efficiency Overachievers ($\epsilon_i \gg 0$):** Nicaragua ($+7.0$ yrs), Morocco ($+6.9$ yrs), Albania ($+6.7$ yrs).

### 3.4 Outlier Identification (Tukey's IQR Fences)
For each continuous indicator $X$:
$$\text{IQR} = Q_3 - Q_1$$
$$\text{Upper Fence} = Q_3 + 1.5 \times \text{IQR}$$
$$\text{Lower Fence} = Q_1 - 1.5 \times \text{IQR}$$

---

## 4. Exploratory Livability Index Formulation

The Livability Index aggregates 4 dimensions with equal weights ($25\%$ each):

### 4.1 Directional Normalization (Min-Max)
For positive indicators (higher is better):
$$S^{+}(X) = \frac{X - \min(X)}{\max(X) - \min(X)}$$

For negative indicators (lower is better):
$$S^{-}(X) = \frac{\max(X) - X}{\max(X) - \min(X)} = 1 - S^{+}(X)$$

### 4.2 Sub-Index Formulations
1. **Health Sub-Index ($25\%$):**
   $$H = \frac{S^{+}(\text{LifeExp}) + S^{-}(\text{InfMort}) + S^{+}(\text{Phys})}{3} \times 100$$
2. **Social Development Sub-Index ($25\%$):**
   $$S = S^{+}(\text{Tertiary}) \times 100$$
3. **Economic Stability Sub-Index ($25\%$):**
   $$E = \frac{S^{-}(\text{Unemp}) + S^{+}(\log_{10}\text{GDPpc})}{2} \times 100$$
4. **Environmental Sustainability Sub-Index ($25\%$):**
   $$N = \frac{S^{-}(\log_{10}\text{CO2pc}) + S^{+}(\text{Forest})}{2} \times 100$$

### 4.3 Composite Index & Rank Shifts
$$\text{Index} = \frac{H + S + E + N}{4}$$
$$\Delta \text{Rank} = \text{Rank}_{\text{GDP}} - \text{Rank}_{\text{Index}}$$
- Positive shift ($\Delta \text{Rank} > 0$): Country performs higher in overall livability than in raw GDP rank (e.g., Belarus $+53$).
- Negative shift ($\Delta \text{Rank} < 0$): Sovereign wealth conceals major environmental or social deficits (e.g., Qatar $-63$).
