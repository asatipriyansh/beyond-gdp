import { IndexDatasetItem } from "./types";

export interface DimensionWeights {
  health: number;
  social: number;
  economic: number;
  environmental: number;
}

export interface RecalculatedCountry {
  Country: string;
  GDPpc: number;
  GDPrank: number;
  health_score: number;
  social_score: number;
  economic_score: number;
  environmental_score: number;
  custom_index: number;
  custom_rank: number;
  rank_shift: number;
}

export function recalculateLivabilityIndex(
  countries: IndexDatasetItem[],
  weights: DimensionWeights
): {
  recalculatedCountries: RecalculatedCountry[];
  spearmanCorr: number;
  topClimbers: RecalculatedCountry[];
  topFallers: RecalculatedCountry[];
} {
  const totalWeight =
    weights.health + weights.social + weights.economic + weights.environmental;
  const safeTotal = totalWeight > 0 ? totalWeight : 1;

  const wH = weights.health / safeTotal;
  const wS = weights.social / safeTotal;
  const wE = weights.economic / safeTotal;
  const wN = weights.environmental / safeTotal;

  // Calculate composite score for each
  const list = countries.map((c) => {
    const customScore =
      wH * c.health_score +
      wS * c.social_score +
      wE * c.economic_score +
      wN * c.environmental_score;

    return {
      Country: c.Country,
      GDPpc: c.GDPpc,
      GDPrank: c.GDPrank,
      health_score: c.health_score,
      social_score: c.social_score,
      economic_score: c.economic_score,
      environmental_score: c.environmental_score,
      custom_index: Math.round(customScore * 100) / 100,
      custom_rank: 0,
      rank_shift: 0,
    };
  });

  // Sort by custom_index descending to assign ranks
  list.sort((a, b) => b.custom_index - a.custom_index);

  list.forEach((item, index) => {
    item.custom_rank = index + 1;
    item.rank_shift = item.GDPrank - item.custom_rank;
  });

  // Calculate Spearman rank correlation between GDPrank and custom_rank
  // formula: 1 - (6 * sum(d^2)) / (n * (n^2 - 1))
  const n = list.length;
  let sumD2 = 0;
  list.forEach((c) => {
    const d = c.GDPrank - c.custom_rank;
    sumD2 += d * d;
  });
  const spearman = 1 - (6 * sumD2) / (n * (n * n - 1));

  // Top climbers and fallers
  const climbers = [...list]
    .sort((a, b) => b.rank_shift - a.rank_shift)
    .slice(0, 10);
  const fallers = [...list]
    .sort((a, b) => a.rank_shift - b.rank_shift)
    .slice(0, 10);

  return {
    recalculatedCountries: list,
    spearmanCorr: Math.round(spearman * 1000) / 1000,
    topClimbers: climbers,
    topFallers: fallers,
  };
}
