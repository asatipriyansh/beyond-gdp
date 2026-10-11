export interface RawIndicatorData {
  gdp_bn: number | null;
  pop_m: number | null;
  life_exp: number | null;
  co2_kt: number | null;
  inf_mort: number | null;
  physicians: number | null;
  unemployment: number | null;
  tertiary: number | null;
  forest: number | null;
}

export interface CleanIndicatorData {
  gdp_pc: number;
  log_gdp: number;
  co2_pc: number | null;
  log_co2_pc: number | null;
  life_exp: number;
  inf_mort: number | null;
  physicians: number | null;
  unemployment: number | null;
  tertiary: number | null;
  forest: number | null;
  income_quartile: string;
  fitted_life_exp: number;
  residual_life_exp: number;
  residual_zscore: number;
}

export interface IndexData {
  index_score: number;
  gdp_rank: number;
  index_rank: number;
  rank_shift: number;
  health_score: number;
  social_score: number;
  economic_score: number;
  environmental_score: number;
}

export interface CountryRecord {
  country: string;
  in_clean_dataset: boolean;
  in_index_dataset: boolean;
  raw: RawIndicatorData;
  clean: CleanIndicatorData | null;
  index: IndexData | null;
}

export interface UnivariateStat {
  count: number;
  missing: number;
  mean: number;
  std: number;
  median: number;
  min: number;
  q25: number;
  q75: number;
  max: number;
  iqr: number;
  skew: number;
}

export type SummaryStats = Record<string, UnivariateStat>;

export interface FocalCorrelation {
  r: number;
  n: number;
  r2?: number;
  slope?: number;
  intercept?: number;
  slope_per_doubling?: number;
  p_value?: number;
}

export interface CorrelationsData {
  variables: string[];
  labels: string[];
  pearson: (number | null)[][];
  spearman: (number | null)[][];
  p_values: (number | null)[][];
  focal_correlations: Record<string, FocalCorrelation>;
}

export interface IQROutlierDetail {
  q1: number;
  q3: number;
  iqr: number;
  lower_fence: number;
  upper_fence: number;
  high_count: number;
  low_count: number;
  high_outliers: Array<{ Country: string; [key: string]: any }>;
  low_outliers: Array<{ Country: string; [key: string]: any }>;
}

export interface OutliersData {
  iqr_outliers: Record<string, IQROutlierDetail>;
  regression_residuals: {
    regression: FocalCorrelation;
    residual_sd: number;
    largest_negative_residuals: Array<{
      Country: string;
      GDPpc: number;
      LifeExp: number;
      fitted_LifeExp: number;
      residual_LifeExp: number;
    }>;
    largest_positive_residuals: Array<{
      Country: string;
      GDPpc: number;
      LifeExp: number;
      fitted_LifeExp: number;
      residual_LifeExp: number;
    }>;
    all_residuals?: Array<{
      Country: string;
      GDPpc: number;
      LifeExp: number;
      fitted_LifeExp: number;
      residual_LifeExp: number;
      residual_zscore?: number;
    }>;
  };
}

export interface IndexDatasetItem {
  Country: string;
  GDP_bn: number;
  Pop_m: number;
  LifeExp: number;
  CO2_kt: number;
  InfMort: number;
  Phys: number;
  Unemp: number;
  Tertiary: number;
  Forest: number;
  GDPpc: number;
  CO2pc: number;
  logGDP: number;
  logCO2pc: number;
  health_score: number;
  social_score: number;
  economic_score: number;
  environmental_score: number;
  Index: number;
  GDPrank: number;
  IXrank: number;
  shift: number;
}

export interface IndexRankingsData {
  sample_size: number;
  spearman_correlation: number;
  spearman_pvalue: number;
  pearson_correlation: number;
  countries: IndexDatasetItem[];
  top_climbers: Array<{
    Country: string;
    GDPrank: number;
    IXrank: number;
    shift: number;
    Index: number;
    GDPpc: number;
  }>;
  top_fallers: Array<{
    Country: string;
    GDPrank: number;
    IXrank: number;
    shift: number;
    Index: number;
    GDPpc: number;
  }>;
}

export interface IncomeQuartileData {
  country_count: number;
  min_gdp: number;
  max_gdp: number;
  median_gdp: number;
  median_life_exp: number;
  median_inf_mort: number | null;
  median_phys: number | null;
  median_co2: number | null;
  median_forest: number | null;
  countries: string[];
}

export type IncomeQuartiles = Record<string, IncomeQuartileData>;
