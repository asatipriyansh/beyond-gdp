"use client";

import React from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface RadarItem {
  dimension: string;
  [countryName: string]: string | number;
}

interface RadarComparisonProps {
  data: RadarItem[];
  countries: Array<{ name: string; color: string }>;
  height?: number;
}

export default function RadarComparison({
  data,
  countries,
  height = 400,
}: RadarComparisonProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-chart-tooltip">
          <p className="font-bold text-brand-mint text-xs mb-1">{label}</p>
          <div className="space-y-1">
            {payload.map((entry: any, index: number) => (
              <p key={index} className="text-xs text-gray-200">
                <span style={{ color: entry.color }}>●</span> {entry.name}:{" "}
                <span className="font-mono text-white font-semibold">
                  {typeof entry.value === "number"
                    ? entry.value.toFixed(1)
                    : entry.value}{" "}
                  / 100
                </span>
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#DCE5E2" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "#172F3B", fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke="#526570"
            tick={{ fontSize: 10, fill: "#526570" }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
          {countries.map((c) => (
            <Radar
              key={c.name}
              name={c.name}
              dataKey={c.name}
              stroke={c.color}
              fill={c.color}
              fillOpacity={0.25}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
