import os
import json
import numpy as np
import pandas as pd
from scipy import stats

def main():
    print("--- Starting Beyond GDP Data Processing Pipeline ---")
    
    # Determine base directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    if "backend" in script_dir:
        repo_root = os.path.abspath(os.path.join(script_dir, "../.."))
    else:
        repo_root = os.getcwd()

    # Find raw dataset
    raw_path_candidates = [
        os.path.join(repo_root, "data/raw/world2023.csv"),
        os.path.join(repo_root, "world2023.csv"),
        "data/raw/world2023.csv",
        "world2023.csv"
    ]
    raw_csv_path = None
    for cand in raw_path_candidates:
        if os.path.exists(cand):
            raw_csv_path = cand
            break

    if not raw_csv_path:
        raise FileNotFoundError(f"Could not locate world2023.csv. Checked: {raw_path_candidates}")

    print(f"Reading raw data from: {raw_csv_path}")
    raw_df = pd.read_csv(raw_csv_path)
    raw_rows = len(raw_df)
    print(f"Loaded raw dataset: {raw_rows} countries, {len(raw_df.columns)} columns")

    # Output directories
    out_dirs = [
        os.path.join(repo_root, "data/processed"),
        os.path.join(repo_root, "frontend/public/data"),
    ]
    # If legacy public/data exists, keep it in sync too
    if os.path.exists(os.path.join(repo_root, "public/data")):
        out_dirs.append(os.path.join(repo_root, "public/data"))

    for d in out_dirs:
        os.makedirs(d, exist_ok=True)

    # Missing counts on raw
    raw_missing = raw_df.isna().sum().to_dict()
    raw_duplicates = int(raw_df.duplicated().sum())
    raw_country_duplicates = int(raw_df["Country"].duplicated().sum())

    # Raw metadata per country
    raw_country_info = {}
    for _, row in raw_df.iterrows():
        country = row["Country"]
        null_cols = [c for c in raw_df.columns if pd.isna(row[c])]
        raw_country_info[country] = {
            "has_life_exp": not pd.isna(row["LifeExp"]),
            "has_gdp": not pd.isna(row["GDP_bn"]),
            "has_pop": not pd.isna(row["Pop_m"]),
            "missing_columns": null_cols,
            "missing_count": len(null_cols)
        }

    # 2. Cleaning & Derived Variables
    clean_df = raw_df.copy()
    
    # Cap Tertiary at 100
    tertiary_over_100_countries = list(clean_df[clean_df["Tertiary"] > 100]["Country"])
    clean_df["Tertiary_raw"] = clean_df["Tertiary"]
    clean_df["Tertiary"] = clean_df["Tertiary"].clip(upper=100)

    # Drop countries missing LifeExp, GDP_bn, or Pop_m
    dropped_countries = list(clean_df[clean_df[["LifeExp", "GDP_bn", "Pop_m"]].isna().any(axis=1)]["Country"])
    clean_df = clean_df.dropna(subset=["LifeExp", "GDP_bn", "Pop_m"]).reset_index(drop=True)
    clean_rows = len(clean_df)
    print(f"Cleaned dataset: {clean_rows} countries (dropped {len(dropped_countries)}: {dropped_countries})")

    # Derived variables
    clean_df["GDPpc"] = (clean_df["GDP_bn"] * 1e9) / (clean_df["Pop_m"] * 1e6)
    clean_df["CO2pc"] = (clean_df["CO2_kt"] * 1000) / (clean_df["Pop_m"] * 1e6)
    clean_df["logGDP"] = np.log10(clean_df["GDPpc"])
    clean_df["logCO2pc"] = clean_df["CO2pc"].apply(lambda v: np.log10(v) if pd.notna(v) and v > 0 else np.nan)

    # 3. Linear Regression & Residuals: Life Expectancy vs log GDP
    sl = stats.linregress(clean_df["logGDP"], clean_df["LifeExp"])
    slope = float(sl.slope)
    intercept = float(sl.intercept)
    r_val = float(sl.rvalue)
    r2_val = float(r_val ** 2)
    p_val = float(sl.pvalue)
    slope_per_doubling = float(slope * np.log10(2))

    clean_df["fitted_LifeExp"] = intercept + slope * clean_df["logGDP"]
    clean_df["residual_LifeExp"] = clean_df["LifeExp"] - clean_df["fitted_LifeExp"]
    clean_df["residual_zscore"] = (clean_df["residual_LifeExp"] - clean_df["residual_LifeExp"].mean()) / clean_df["residual_LifeExp"].std()

    # 4. Income Quartiles
    clean_df["income_quartile"] = pd.qcut(
        clean_df["GDPpc"], 4, labels=["Q1 (Poorest)", "Q2 (Lower-Middle)", "Q3 (Upper-Middle)", "Q4 (Richest)"]
    )

    quartile_stats = {}
    for q_label, group in clean_df.groupby("income_quartile", observed=True):
        quartile_stats[str(q_label)] = {
            "country_count": len(group),
            "min_gdp": round(float(group["GDPpc"].min()), 2),
            "max_gdp": round(float(group["GDPpc"].max()), 2),
            "median_gdp": round(float(group["GDPpc"].median()), 2),
            "median_life_exp": round(float(group["LifeExp"].median()), 2),
            "median_inf_mort": round(float(group["InfMort"].median()), 2) if group["InfMort"].notna().any() else None,
            "median_phys": round(float(group["Phys"].median()), 2) if group["Phys"].notna().any() else None,
            "median_co2": round(float(group["CO2pc"].median()), 2) if group["CO2pc"].notna().any() else None,
            "median_forest": round(float(group["Forest"].median()), 2) if group["Forest"].notna().any() else None,
            "countries": list(group["Country"])
        }

    # 5. Exploratory Livability Index
    index_cols = ["LifeExp", "InfMort", "Phys", "Unemp", "Tertiary", "CO2pc", "Forest"]
    index_df = clean_df.dropna(subset=index_cols).copy().reset_index(drop=True)
    index_rows = len(index_df)
    print(f"Complete data index sample: {index_rows} countries")

    def min_max(s):
        return (s - s.min()) / (s.max() - s.min())

    # Dimension components
    # Health: LifeExp (+), InfMort (-), Phys (+)
    h_score = (min_max(index_df["LifeExp"]) + (1 - min_max(index_df["InfMort"])) + min_max(index_df["Phys"])) / 3.0
    # Social: Tertiary (+)
    s_score = min_max(index_df["Tertiary"])
    # Economic: Unemployment (-), logGDP (+)
    e_score = ((1 - min_max(index_df["Unemp"])) + min_max(index_df["logGDP"])) / 2.0
    # Environmental: logCO2pc (-), Forest (+)
    n_score = ((1 - min_max(np.log10(index_df["CO2pc"]))) + min_max(index_df["Forest"])) / 2.0

    index_df["health_score"] = round(h_score * 100, 2)
    index_df["social_score"] = round(s_score * 100, 2)
    index_df["economic_score"] = round(e_score * 100, 2)
    index_df["environmental_score"] = round(n_score * 100, 2)

    # Composite Index (equal weights: 25% each)
    comp_mean = (h_score + s_score + e_score + n_score) / 4.0
    index_df["Index"] = round(comp_mean * 100, 2)
    index_df["GDPrank"] = index_df["GDPpc"].rank(ascending=False).astype(int)
    index_df["IXrank"] = index_df["Index"].rank(ascending=False).astype(int)
    index_df["shift"] = index_df["GDPrank"] - index_df["IXrank"]

    # Spearman rank correlation between GDPpc and Livability Index
    spearman_gdp_ix = stats.spearmanr(index_df["GDPpc"], index_df["Index"])
    pearson_gdp_ix = stats.pearsonr(index_df["GDPpc"], index_df["Index"])

    # Build dictionary for quick index lookup
    index_map = {}
    for _, row in index_df.iterrows():
        index_map[row["Country"]] = {
            "index_score": float(row["Index"]),
            "gdp_rank": int(row["GDPrank"]),
            "index_rank": int(row["IXrank"]),
            "rank_shift": int(row["shift"]),
            "health_score": float(row["health_score"]),
            "social_score": float(row["social_score"]),
            "economic_score": float(row["economic_score"]),
            "environmental_score": float(row["environmental_score"])
        }

    # 6. Outlier Analysis
    numeric_indicators = ["GDPpc", "LifeExp", "InfMort", "Phys", "Unemp", "Tertiary", "CO2pc", "Forest"]
    outliers_summary = {}

    for col in numeric_indicators:
        series = clean_df[col].dropna()
        q1 = float(series.quantile(0.25))
        q3 = float(series.quantile(0.75))
        iqr = q3 - q1
        lo = q1 - 1.5 * iqr
        hi = q3 + 1.5 * iqr

        cols_to_keep = ["Country", col] if col == "GDPpc" else ["Country", col, "GDPpc"]
        high_outliers = clean_df[clean_df[col] > hi][cols_to_keep].sort_values(col, ascending=False).to_dict("records")
        low_outliers = clean_df[clean_df[col] < lo][cols_to_keep].sort_values(col).to_dict("records")

        outliers_summary[col] = {
            "q1": round(q1, 3),
            "q3": round(q3, 3),
            "iqr": round(iqr, 3),
            "lower_fence": round(lo, 3),
            "upper_fence": round(hi, 3),
            "high_count": len(high_outliers),
            "low_count": len(low_outliers),
            "high_outliers": high_outliers,
            "low_outliers": low_outliers
        }

    # Log-log CO2 vs GDP regression
    co2_valid = clean_df.dropna(subset=["CO2pc", "GDPpc"]).copy()
    co2_valid = co2_valid[co2_valid["CO2pc"] > 0]
    sl_co2 = stats.linregress(np.log10(co2_valid["GDPpc"]), np.log10(co2_valid["CO2pc"]))

    # 7. Descriptive Statistics Summary Table
    desc_stats = {}
    for col in numeric_indicators:
        s = clean_df[col].dropna()
        desc_stats[col] = {
            "count": int(s.count()),
            "missing": int(clean_df[col].isna().sum()),
            "mean": round(float(s.mean()), 3),
            "std": round(float(s.std()), 3),
            "median": round(float(s.median()), 3),
            "min": round(float(s.min()), 3),
            "q25": round(float(s.quantile(0.25)), 3),
            "q75": round(float(s.quantile(0.75)), 3),
            "max": round(float(s.max()), 3),
            "iqr": round(float(s.quantile(0.75) - s.quantile(0.25)), 3),
            "skew": round(float(s.skew()), 3)
        }

    # Add logGDP and logCO2pc stats
    desc_stats["logGDP"] = {
        "count": int(clean_df["logGDP"].count()),
        "missing": 0,
        "mean": round(float(clean_df["logGDP"].mean()), 3),
        "std": round(float(clean_df["logGDP"].std()), 3),
        "median": round(float(clean_df["logGDP"].median()), 3),
        "min": round(float(clean_df["logGDP"].min()), 3),
        "q25": round(float(clean_df["logGDP"].quantile(0.25)), 3),
        "q75": round(float(clean_df["logGDP"].quantile(0.75)), 3),
        "max": round(float(clean_df["logGDP"].max()), 3),
        "iqr": round(float(clean_df["logGDP"].quantile(0.75) - clean_df["logGDP"].quantile(0.25)), 3),
        "skew": round(float(clean_df["logGDP"].skew()), 3)
    }

    # 8. Correlation Analysis (Matrices)
    corr_vars = [
        ("logGDP", "log GDP pc"),
        ("LifeExp", "Life exp."),
        ("InfMort", "Infant mort."),
        ("Phys", "Physicians"),
        ("Unemp", "Unemployment"),
        ("Tertiary", "Tertiary enrol."),
        ("logCO2pc", "log CO₂ pc"),
        ("Forest", "Forest %")
    ]
    var_keys = [k for k, _ in corr_vars]
    var_labels = [lbl for _, lbl in corr_vars]

    pearson_matrix = []
    spearman_matrix = []
    p_values_pearson = []

    for v1 in var_keys:
        p_row = []
        s_row = []
        pval_row = []
        for v2 in var_keys:
            if v1 == v2:
                p_row.append(1.0)
                s_row.append(1.0)
                pval_row.append(0.0)
            else:
                pair_df = clean_df[[v1, v2]].dropna()
                if len(pair_df) > 1:
                    pr = stats.pearsonr(pair_df[v1], pair_df[v2])
                    sr = stats.spearmanr(pair_df[v1], pair_df[v2])
                    p_row.append(round(float(pr.statistic), 3))
                    s_row.append(round(float(sr.statistic), 3))
                    pval_row.append(float(pr.pvalue))
                else:
                    p_row.append(None)
                    s_row.append(None)
                    pval_row.append(None)
        pearson_matrix.append(p_row)
        spearman_matrix.append(s_row)
        p_values_pearson.append(pval_row)

    correlations_output = {
        "variables": var_keys,
        "labels": var_labels,
        "pearson": pearson_matrix,
        "spearman": spearman_matrix,
        "p_values": p_values_pearson,
        "focal_correlations": {
            "logGDP_LifeExp": {
                "r": round(r_val, 4),
                "r2": round(r2_val, 4),
                "slope": round(slope, 4),
                "intercept": round(intercept, 4),
                "slope_per_doubling": round(slope_per_doubling, 4),
                "p_value": p_val,
                "n": len(clean_df.dropna(subset=["logGDP", "LifeExp"]))
            },
            "logGDP_logCO2pc": {
                "r": round(float(sl_co2.rvalue), 4),
                "r2": round(float(sl_co2.rvalue**2), 4),
                "slope": round(float(sl_co2.slope), 4),
                "intercept": round(float(sl_co2.intercept), 4),
                "p_value": float(sl_co2.pvalue),
                "n": len(co2_valid)
            },
            "InfMort_LifeExp": {
                "r": round(float(stats.pearsonr(clean_df.dropna(subset=["InfMort", "LifeExp"])["InfMort"], clean_df.dropna(subset=["InfMort", "LifeExp"])["LifeExp"]).statistic), 4),
                "n": len(clean_df.dropna(subset=["InfMort", "LifeExp"]))
            },
            "logGDP_Phys": {
                "r": round(float(stats.pearsonr(clean_df.dropna(subset=["logGDP", "Phys"])["logGDP"], clean_df.dropna(subset=["logGDP", "Phys"])["Phys"]).statistic), 4),
                "n": len(clean_df.dropna(subset=["logGDP", "Phys"]))
            },
            "logGDP_Tertiary": {
                "r": round(float(stats.pearsonr(clean_df.dropna(subset=["logGDP", "Tertiary"])["logGDP"], clean_df.dropna(subset=["logGDP", "Tertiary"])["Tertiary"]).statistic), 4),
                "n": len(clean_df.dropna(subset=["logGDP", "Tertiary"]))
            },
            "logGDP_Unemp": {
                "r": round(float(stats.pearsonr(clean_df.dropna(subset=["logGDP", "Unemp"])["logGDP"], clean_df.dropna(subset=["logGDP", "Unemp"])["Unemp"]).statistic), 4),
                "n": len(clean_df.dropna(subset=["logGDP", "Unemp"]))
            },
            "logGDP_Forest": {
                "r": round(float(stats.pearsonr(clean_df.dropna(subset=["logGDP", "Forest"])["logGDP"], clean_df.dropna(subset=["logGDP", "Forest"])["Forest"]).statistic), 4),
                "n": len(clean_df.dropna(subset=["logGDP", "Forest"]))
            },
            "CO2pc_LifeExp": {
                "r": round(float(stats.pearsonr(clean_df.dropna(subset=["CO2pc", "LifeExp"])["CO2pc"], clean_df.dropna(subset=["CO2pc", "LifeExp"])["LifeExp"]).statistic), 4),
                "n": len(clean_df.dropna(subset=["CO2pc", "LifeExp"]))
            }
        }
    }

    # 9. Master Country List (All 146 countries)
    all_countries_list = []
    for _, raw_row in raw_df.iterrows():
        name = raw_row["Country"]
        c_match = clean_df[clean_df["Country"] == name]
        in_clean = len(c_match) > 0
        in_index = name in index_map

        record = {
            "country": name,
            "in_clean_dataset": in_clean,
            "in_index_dataset": in_index,
            "raw": {
                "gdp_bn": float(raw_row["GDP_bn"]) if pd.notna(raw_row["GDP_bn"]) else None,
                "pop_m": float(raw_row["Pop_m"]) if pd.notna(raw_row["Pop_m"]) else None,
                "life_exp": float(raw_row["LifeExp"]) if pd.notna(raw_row["LifeExp"]) else None,
                "co2_kt": float(raw_row["CO2_kt"]) if pd.notna(raw_row["CO2_kt"]) else None,
                "inf_mort": float(raw_row["InfMort"]) if pd.notna(raw_row["InfMort"]) else None,
                "physicians": float(raw_row["Phys"]) if pd.notna(raw_row["Phys"]) else None,
                "unemployment": float(raw_row["Unemp"]) if pd.notna(raw_row["Unemp"]) else None,
                "tertiary": float(raw_row["Tertiary"]) if pd.notna(raw_row["Tertiary"]) else None,
                "forest": float(raw_row["Forest"]) if pd.notna(raw_row["Forest"]) else None,
            }
        }

        if in_clean:
            c_row = c_match.iloc[0]
            record["clean"] = {
                "gdp_pc": round(float(c_row["GDPpc"]), 2),
                "log_gdp": round(float(c_row["logGDP"]), 4),
                "co2_pc": round(float(c_row["CO2pc"]), 3) if pd.notna(c_row["CO2pc"]) else None,
                "log_co2_pc": round(float(c_row["logCO2pc"]), 4) if pd.notna(c_row["logCO2pc"]) else None,
                "life_exp": round(float(c_row["LifeExp"]), 2),
                "inf_mort": round(float(c_row["InfMort"]), 2) if pd.notna(c_row["InfMort"]) else None,
                "physicians": round(float(c_row["Phys"]), 2) if pd.notna(c_row["Phys"]) else None,
                "unemployment": round(float(c_row["Unemp"]), 2) if pd.notna(c_row["Unemp"]) else None,
                "tertiary": round(float(c_row["Tertiary"]), 2) if pd.notna(c_row["Tertiary"]) else None,
                "forest": round(float(c_row["Forest"]), 2) if pd.notna(c_row["Forest"]) else None,
                "income_quartile": str(c_row["income_quartile"]),
                "fitted_life_exp": round(float(c_row["fitted_LifeExp"]), 2),
                "residual_life_exp": round(float(c_row["residual_LifeExp"]), 2),
                "residual_zscore": round(float(c_row["residual_zscore"]), 3),
            }
        else:
            record["clean"] = None

        if in_index:
            record["index"] = index_map[name]
        else:
            record["index"] = None

        all_countries_list.append(record)

    all_countries_list.sort(key=lambda x: x["country"])

    # Prepare index rankings
    idx_sorted = index_df.sort_values("Index", ascending=False).to_dict("records")
    index_rankings_payload = {
        "sample_size": index_rows,
        "spearman_correlation": round(float(spearman_gdp_ix.statistic), 4),
        "spearman_pvalue": float(spearman_gdp_ix.pvalue),
        "pearson_correlation": round(float(pearson_gdp_ix.statistic), 4),
        "countries": idx_sorted,
        "top_climbers": index_df.sort_values("shift", ascending=False).head(10)[["Country", "GDPrank", "IXrank", "shift", "Index", "GDPpc"]].to_dict("records"),
        "top_fallers": index_df.sort_values("shift").head(10)[["Country", "GDPrank", "IXrank", "shift", "Index", "GDPpc"]].to_dict("records")
    }

    outliers_payload = {
        "iqr_outliers": outliers_summary,
        "regression_residuals": {
            "regression": correlations_output["focal_correlations"]["logGDP_LifeExp"],
            "residual_sd": round(float(clean_df["residual_LifeExp"].std()), 3),
            "largest_negative_residuals": clean_df.sort_values("residual_LifeExp").head(10)[["Country", "GDPpc", "LifeExp", "fitted_LifeExp", "residual_LifeExp"]].to_dict("records"),
            "largest_positive_residuals": clean_df.sort_values("residual_LifeExp", ascending=False).head(10)[["Country", "GDPpc", "LifeExp", "fitted_LifeExp", "residual_LifeExp"]].to_dict("records"),
            "all_residuals": clean_df.sort_values("residual_LifeExp")[["Country", "GDPpc", "LifeExp", "fitted_LifeExp", "residual_LifeExp", "residual_zscore"]].to_dict("records")
        }
    }

    raw_metadata_payload = {
        "raw_row_count": raw_rows,
        "clean_row_count": clean_rows,
        "index_row_count": index_rows,
        "missing_counts": raw_missing,
        "duplicate_rows": raw_duplicates,
        "duplicate_countries": raw_country_duplicates,
        "tertiary_clipped_countries": tertiary_over_100_countries,
        "dropped_from_clean": dropped_countries,
        "countries": raw_country_info
    }

    # 10. Write JSON Artifacts to all target directories
    for d in out_dirs:
        with open(os.path.join(d, "countries.json"), "w") as f:
            json.dump(all_countries_list, f, indent=2)
        with open(os.path.join(d, "summary_stats.json"), "w") as f:
            json.dump(desc_stats, f, indent=2)
        with open(os.path.join(d, "correlations.json"), "w") as f:
            json.dump(correlations_output, f, indent=2)
        with open(os.path.join(d, "income_quartiles.json"), "w") as f:
            json.dump(quartile_stats, f, indent=2)
        with open(os.path.join(d, "outliers.json"), "w") as f:
            json.dump(outliers_payload, f, indent=2)
        with open(os.path.join(d, "index_rankings.json"), "w") as f:
            json.dump(index_rankings_payload, f, indent=2)
        with open(os.path.join(d, "raw_metadata.json"), "w") as f:
            json.dump(raw_metadata_payload, f, indent=2)
        
        # CSV exports
        clean_df.to_csv(os.path.join(d, "clean.csv"), index=False)
        index_df.to_csv(os.path.join(d, "index.csv"), index=False)

    print(f"Data processing complete! All artifacts saved in: {', '.join(out_dirs)}")

if __name__ == "__main__":
    main()
