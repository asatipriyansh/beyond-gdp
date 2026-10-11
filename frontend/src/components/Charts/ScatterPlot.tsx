"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Line,
  ComposedChart,
} from "recharts";

interface ScatterPoint {
  country: string;
  x: number;
  y: number;
  z?: number;
  highlight?: boolean;
  extra?: Record<string, any>;
}

interface ScatterPlotProps {
  data: ScatterPoint[];
  xAxisLabel: string;
  yAxisLabel: string;
  xDomain?: [number | string, number | string];
  yDomain?: [number | string, number | string];
  xScale?: "auto" | "log";
  yScale?: "auto" | "log";
  xUnit?: string;
  yUnit?: string;
  highlightCountries?: string[];
  height?: number;
  showRegressionLine?: boolean;
  regressionSlope?: number;
  regressionIntercept?: number;
}

export default function ScatterPlot({
  data,
  xAxisLabel,
  yAxisLabel,
  xDomain = ["auto", "auto"],
  yDomain = ["auto", "auto"],
  xScale = "auto",
  yScale = "auto",
  xUnit = "",
  yUnit = "",
  highlightCountries = [],
  height = 420,
}: ScatterPlotProps) {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="custom-chart-tooltip">
          <p className="font-bold text-brand-mint text-sm">{p.country}</p>
          <div className="mt-1 space-y-0.5 text-xs text-gray-200">
            <p>
              {xAxisLabel}:{" "}
              <span className="font-mono text-white">
                {typeof p.x === "number"
                  ? p.x.toLocaleString(undefined, { maximumFractionDigits: 2 })
                  : p.x}{" "}
                {xUnit}
              </span>
            </p>
            <p>
              {yAxisLabel}:{" "}
              <span className="font-mono text-white">
                {typeof p.y === "number"
                  ? p.y.toLocaleString(undefined, { maximumFractionDigits: 2 })
                  : p.y}{" "}
                {yUnit}
              </span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const normalPoints = data.filter(
    (d) => !highlightCountries.includes(d.country)
  );
  const highlightedPoints = data.filter((d) =>
    highlightCountries.includes(d.country)
  );

  return (
    <div style={{ width: "100%", height }} className="relative">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#DCE5E2" strokeOpacity={0.7} />
          <XAxis
            type="number"
            dataKey="x"
            name={xAxisLabel}
            domain={xDomain}
            scale={xScale}
            stroke="#172F3B"
            tick={{ fontSize: 11, fill: "#526570" }}
            tickFormatter={(val) =>
              typeof val === "number"
                ? val >= 1000
                  ? `${(val / 1000).toFixed(0)}k`
                  : val.toFixed(1)
                : val
            }
            label={{
              value: xAxisLabel,
              position: "insideBottom",
              offset: -20,
              fill: "#172F3B",
              fontSize: 12,
              fontWeight: 500,
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name={yAxisLabel}
            domain={yDomain}
            scale={yScale}
            stroke="#172F3B"
            tick={{ fontSize: 11, fill: "#526570" }}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: "insideLeft",
              offset: 0,
              fill: "#172F3B",
              fontSize: 12,
              fontWeight: 500,
            }}
          />
          <ZAxis range={[50, 50]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter
            name="Countries"
            data={normalPoints}
            fill="#0D7377"
            fillOpacity={0.75}
            stroke="#102A36"
            strokeWidth={0.5}
          />
          {highlightedPoints.length > 0 && (
            <Scatter
              name="Highlighted"
              data={highlightedPoints}
              fill="#E47D62"
              fillOpacity={0.95}
              stroke="#B24024"
              strokeWidth={1.5}
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
