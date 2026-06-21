"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";

export const PALETA = {
  brand: "#bcd93a",
  sky: "#7bb7f0",
  sun: "#f7cf4f",
  mint: "#a8de72",
  coral: "#f4978e",
  violet: "#b79df0",
  ink: "#1b2230",
  muted: "#7b8493",
  grid: "#eef1f6",
};

export const CATEGORIA_COLOR = {
  POPULAR: PALETA.sky,
  MEDIA: PALETA.sun,
  MARATON: PALETA.coral,
} as const;

const axisProps = {
  tick: { fontSize: 11, fill: PALETA.muted },
  axisLine: false,
  tickLine: false,
};

type TooltipFmt = (value: number) => string;

function tooltipStyle() {
  return {
    contentStyle: {
      borderRadius: 12,
      border: "1px solid #eef1f6",
      boxShadow: "0 4px 16px rgba(16,24,40,0.08)",
      fontSize: 12,
    },
  };
}

/* ---------- Barras ---------- */

export function BarsChart({
  data,
  xKey,
  bars,
  height = 260,
  fmt,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  bars: { key: string; color: string; name?: string }[];
  height?: number;
  fmt?: TooltipFmt;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={PALETA.grid} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip
          {...tooltipStyle()}
          formatter={(value) => [fmt ? fmt(Number(value)) : String(value ?? ""), ""]}
          cursor={{ fill: "rgba(123,132,147,0.06)" }}
        />
        {bars.map((b) => (
          <Bar
            key={b.key}
            dataKey={b.key}
            name={b.name ?? b.key}
            fill={b.color}
            radius={[6, 6, 0, 0]}
            maxBarSize={46}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------- Línea / Área ---------- */

export function AreaTrend({
  data,
  xKey,
  yKey,
  color = PALETA.brand,
  height = 260,
  fmt,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  fmt?: TooltipFmt;
}) {
  const gid = `grad-${yKey}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={PALETA.grid} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle()} formatter={(value) => [fmt ? fmt(Number(value)) : String(value ?? ""), ""]} />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={color}
          strokeWidth={2.5}
          fill={`url(#${gid})`}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function LinesChart({
  data,
  xKey,
  lines,
  height = 260,
  fmt,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  lines: { key: string; color: string; name?: string }[];
  height?: number;
  fmt?: TooltipFmt;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={PALETA.grid} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} />
        <Tooltip {...tooltipStyle()} formatter={(value) => [fmt ? fmt(Number(value)) : String(value ?? ""), ""]} />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.name ?? l.key}
            stroke={l.color}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ---------- Donut ---------- */

export function DonutChart({
  data,
  height = 240,
  centerTop,
  centerBottom,
  fmt,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
  centerTop?: string;
  centerBottom?: string;
  fmt?: TooltipFmt;
}) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="62%"
            outerRadius="92%"
            paddingAngle={2}
            stroke="none"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle()} formatter={(value) => [fmt ? fmt(Number(value)) : String(value ?? ""), ""]} />
        </PieChart>
      </ResponsiveContainer>
      {(centerTop || centerBottom) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          {centerTop && <span className="text-2xl font-bold">{centerTop}</span>}
          {centerBottom && <span className="text-xs text-muted">{centerBottom}</span>}
        </div>
      )}
    </div>
  );
}

export function Leyenda({
  items,
}: {
  items: { name: string; color: string; value?: string }[];
}) {
  return (
    <ul className="flex flex-col gap-2">
      {items.map((i) => (
        <li key={i.name} className="flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: i.color }} />
          <span className="text-muted">{i.name}</span>
          {i.value && <span className="ml-auto font-semibold">{i.value}</span>}
        </li>
      ))}
    </ul>
  );
}
