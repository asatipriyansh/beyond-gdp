"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

interface ResidualItem {
  Country: string;
  residual_LifeExp: number;
  GDPpc: number;
  LifeExp: number;
  fitted_LifeExp: number;
}

interface ResidualChartProps {
  data: ResidualItem[];
  height?: number;
}

export default function ResidualChart({
  data,
  height = 420,
}: ResidualChartProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload as ResidualItem;
      const isPos = d.residual_LifeExp >= 0;
      return (
        <div className="custom-chart-tooltip">
          <p className="font-bold text-brand-mint text-sm">{d.Country}</p>
          <div className="mt-1 space-y-0.5 text-xs text-gray-200">
            <p>
              Residual:{" "}
              <span
                className={`font-mono font-bold ${
                  isPos ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isPos ? "+" : ""}
                {d.residual_LifeExp.toFixed(1)} years
              </span>
            </p>
            <p>
              Actual Life Exp:{" "}
              <span className="font-mono text-white">
                {d.LifeExp.toFixed(1)} yrs
              </span>
            </p>
            <p>
              Fitted (Predicted):{" "}
              <span className="font-mono text-white">
                {d.fitted_LifeExp.toFixed(1)} yrs
              </span>
            </p>
            <p>
              GDP per capita:{" "}
              <span className="font-mono text-white">
                ${Math.round(d.GDPpc).toLocaleString()}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#DCE5E2" strokeOpacity={0.7} />
          <XAxis
            type="number"
            stroke="#172F3B"
            tick={{ fontSize: 11, fill: "#526570" }}
            label={{
              value: "Life Expectancy Residual (Years: Observed − Fitted)",
              position: "insideBottom",
              offset: -10,
              fill: "#172F3B",
              fontSize: 12,
              fontWeight: 500,
            }}
          />
          <YAxis
            type="category"
            dataKey="Country"
            stroke="#172F3B"
            tick={{ fontSize: 11, fill: "#172F3B" }}
            width={95}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="#102A36" strokeWidth={1.5} />
          <Bar dataKey="residual_LifeExp" radius={[2, 2, 2, 2]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.residual_LifeExp >= 0 ? "#159A91" : "#E47D62"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
