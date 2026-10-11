import os
import json
import unittest

def find_data_dir():
    candidates = [
        "data/processed",
        "frontend/public/data",
        "public/data",
        "../data/processed",
        "../frontend/public/data"
    ]
    for cand in candidates:
        if os.path.exists(os.path.join(cand, "correlations.json")):
            return cand
    raise FileNotFoundError("Could not locate processed data directory containing correlations.json")

class TestBeyondGDPStatistics(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        data_dir = find_data_dir()
        with open(os.path.join(data_dir, "correlations.json")) as f:
            cls.correlations = json.load(f)
        with open(os.path.join(data_dir, "outliers.json")) as f:
            cls.outliers = json.load(f)
        with open(os.path.join(data_dir, "index_rankings.json")) as f:
            cls.index_rankings = json.load(f)
        with open(os.path.join(data_dir, "summary_stats.json")) as f:
            cls.summary_stats = json.load(f)
        with open(os.path.join(data_dir, "raw_metadata.json")) as f:
            cls.raw_metadata = json.load(f)
        with open(os.path.join(data_dir, "countries.json")) as f:
            cls.countries = json.load(f)

    def test_sample_sizes(self):
        """Verify the exact sample sizes reported in project: 146 raw, 141 clean, 131 index."""
        self.assertEqual(self.raw_metadata["raw_row_count"], 146)
        self.assertEqual(self.raw_metadata["clean_row_count"], 141)
        self.assertEqual(self.raw_metadata["index_row_count"], 131)
        self.assertEqual(len(self.countries), 146)

    def test_loggdp_lifeexp_correlation(self):
        """Log GDP per capita vs life expectancy: Pearson r ~ 0.83, slope per doubling ~ 3.01 yrs, R2 ~ 0.69."""
        focal = self.correlations["focal_correlations"]["logGDP_LifeExp"]
        self.assertAlmostEqual(focal["r"], 0.83, places=2)
        self.assertAlmostEqual(focal["slope_per_doubling"], 3.01, places=1)
        self.assertAlmostEqual(focal["r2"], 0.69, places=2)
        self.assertEqual(focal["n"], 141)

    def test_loggdp_logco2_correlation(self):
        """Log GDP per capita vs log CO2 emissions per capita: Pearson r ~ 0.87."""
        focal = self.correlations["focal_correlations"]["logGDP_logCO2pc"]
        self.assertAlmostEqual(focal["r"], 0.87, places=2)

    def test_infmort_lifeexp_correlation(self):
        """Infant mortality vs life expectancy: Pearson r ~ -0.93."""
        focal = self.correlations["focal_correlations"]["InfMort_LifeExp"]
        self.assertAlmostEqual(focal["r"], -0.93, places=2)

    def test_co2_iqr_outliers(self):
        """Verify 8 high-CO2 outliers detected using 1.5x IQR fence."""
        co2_outliers = self.outliers["iqr_outliers"]["CO2pc"]
        self.assertEqual(co2_outliers["high_count"], 8)
        high_countries = [c["Country"] for c in co2_outliers["high_outliers"]]
        expected = ["Qatar", "Kuwait", "Bahrain", "Brunei", "Canada", "Australia", "Luxembourg", "Kazakhstan"]
        for exp in expected:
            self.assertIn(exp, high_countries)

    def test_equatorial_guinea_residual(self):
        """Verify Equatorial Guinea as the worst negative residual (observed -15.2 yrs below fitted)."""
        res = self.outliers["regression_residuals"]["largest_negative_residuals"]
        eq = next(c for c in res if c["Country"] == "Equatorial Guinea")
        self.assertAlmostEqual(eq["residual_LifeExp"], -15.2, places=1)

    def test_index_top_5(self):
        """Verify reported top 5 livability index countries: Finland, Austria, Australia, Norway, New Zealand."""
        countries = self.index_rankings["countries"]
        top_5_names = [c["Country"] for c in countries[:5]]
        self.assertEqual(top_5_names, ["Finland", "Austria", "Australia", "Norway", "New Zealand"])

    def test_index_shifts(self):
        """Verify documented rank shifts: Qatar shifts from GDP 5 to Index 68 (-63), Belarus from 61 to 8 (+53)."""
        countries = {c["Country"]: c for c in self.index_rankings["countries"]}
        
        # Qatar: drops from GDP rank 5 to Index rank 68
        qatar = countries["Qatar"]
        self.assertEqual(qatar["GDPrank"], 5)
        self.assertEqual(qatar["IXrank"], 68)
        self.assertEqual(qatar["shift"], -63)

        # Belarus: climbs from GDP rank 61 to Index rank 8
        belarus = countries["Belarus"]
        self.assertEqual(belarus["GDPrank"], 61)
        self.assertEqual(belarus["IXrank"], 8)
        self.assertEqual(belarus["shift"], 53)

    def test_index_rank_correlation(self):
        """Verify rank correlation between GDP rank and Livability Index rank is ~ 0.83."""
        self.assertAlmostEqual(self.index_rankings["spearman_correlation"], 0.83, places=2)

if __name__ == "__main__":
    unittest.main()
