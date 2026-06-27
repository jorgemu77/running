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
  LabelList,
} from "recharts";
import { formatNum, formatInt, formatRitmo, formatRitmoCorto, formatTiempo } from "@/lib/format";

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
  rojo: "#ef4444",
};

export const CATEGORIA_COLOR = {
  POPULAR: PALETA.sky,
  MEDIA: PALETA.sun,
  MARATON: PALETA.coral,
} as const;

// Tipo de carrera
export const TIPO_COLOR = {
  COMPETENCIA: PALETA.brand,
  ACOMPAÑAMIENTO: PALETA.sky,
} as const;

const axisProps = {
  tick: { fontSize: 11, fill: PALETA.muted },
  axisLine: false,
  tickLine: false,
};

type Fmt = (value: number) => string;

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

/* ---------- Barras (con etiqueta de valor encima) ---------- */

export function BarsChart({
  data,
  xKey,
  bars,
  height = 260,
  fmt = formatNum,
  yMax,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  bars: { key: string; color: string; name?: string }[];
  height?: number;
  fmt?: Fmt;
  yMax?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 22, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={PALETA.grid} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} domain={yMax ? [0, yMax] : undefined} />
        <Tooltip
          {...tooltipStyle()}
          separator=""
          formatter={(value) => [fmt(Number(value)), ""]}
          cursor={{ fill: "rgba(123,132,147,0.06)" }}
        />
        {bars.map((b) => (
          <Bar key={b.key} dataKey={b.key} name={b.name ?? b.key} fill={b.color} radius={[6, 6, 0, 0]} maxBarSize={46}>
            <LabelList
              dataKey={b.key}
              position="top"
              fontSize={11}
              fontWeight={600}
              fill={PALETA.ink}
              formatter={(value: unknown) => fmt(Number(value))}
            />
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------- Barras apiladas por TIPO de carrera ---------- */

export function CarrerasPorAnioChart({
  data,
  height = 280,
  yMax,
  showTotal = true,
}: {
  data: { anio: string; COMPETENCIA: number; ACOMPAÑAMIENTO: number }[];
  height?: number;
  yMax?: number;
  showTotal?: boolean;
}) {
  const totales = data.map((d) => d.COMPETENCIA + d.ACOMPAÑAMIENTO);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 22, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={PALETA.grid} />
        <XAxis dataKey="anio" {...axisProps} />
        <YAxis {...axisProps} allowDecimals={false} domain={yMax ? [0, yMax] : undefined} />
        <Tooltip {...tooltipStyle()} cursor={{ fill: "rgba(123,132,147,0.06)" }} />
        <Bar dataKey="COMPETENCIA" name="Competencia" stackId="a" fill={TIPO_COLOR.COMPETENCIA} maxBarSize={46}>
          <LabelList
            dataKey="COMPETENCIA"
            position="center"
            fontSize={11}
            fontWeight={700}
            fill={PALETA.ink}
            formatter={(value: unknown) => (Number(value) > 0 ? formatInt(Number(value)) : "")}
          />
        </Bar>
        <Bar dataKey="ACOMPAÑAMIENTO" name="Acompañamiento" stackId="a" fill={TIPO_COLOR.ACOMPAÑAMIENTO} radius={[6, 6, 0, 0]} maxBarSize={46}>
          <LabelList
            dataKey="ACOMPAÑAMIENTO"
            position="center"
            fontSize={11}
            fontWeight={700}
            fill={PALETA.ink}
            formatter={(value: unknown) => (Number(value) > 0 ? formatInt(Number(value)) : "")}
          />
          {showTotal && (
            <LabelList
              dataKey="ACOMPAÑAMIENTO"
              position="top"
              content={(props: { x?: string | number; y?: string | number; width?: string | number; index?: number }) => {
                const { x, y, width, index } = props;
                if (index == null) return null;
                const total = totales[index];
                const cx = Number(x) + Number(width) / 2;
                return (
                  <text x={cx} y={Number(y) - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={PALETA.ink}>
                    {formatInt(total)}
                  </text>
                );
              }}
            />
          )}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ---------- Área (tendencia, con etiquetas) ---------- */

export function AreaTrend({
  data,
  xKey,
  yKey,
  color = PALETA.brand,
  height = 260,
  fmt = formatNum,
}: {
  data: Record<string, unknown>[];
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  fmt?: Fmt;
}) {
  const gid = `grad-${yKey}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 24, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={PALETA.grid} />
        <XAxis dataKey={xKey} {...axisProps} />
        <YAxis {...axisProps} width={44} tick={{ fontSize: 13, fill: PALETA.muted }} />
        <Tooltip {...tooltipStyle()} separator="" formatter={(value) => [fmt(Number(value)), ""]} />
        <Area type="monotone" dataKey={yKey} stroke={color} strokeWidth={2.5} fill={`url(#${gid})`} dot={{ r: 3, fill: color }} activeDot={{ r: 5 }}>
          <LabelList
            dataKey={yKey}
            position="top"
            fontSize={10}
            fontWeight={600}
            fill={PALETA.ink}
            formatter={(value: unknown) => fmt(Number(value))}
          />
        </Area>
      </AreaChart>
    </ResponsiveContainer>
  );
}

/* ---------- Ritmo medio por carrera (línea con puntos) ---------- */

export type RitmoPunto = {
  label: string;
  ritmo: number; // segundos/km
  alerta?: boolean;
  carrera?: string;
  lugar?: string;
  tiempo?: number | null; // tiempo neto en segundos
};

function RitmoTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: RitmoPunto }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div
      style={{
        borderRadius: 12,
        border: "1px solid #eef1f6",
        boxShadow: "0 4px 16px rgba(16,24,40,0.08)",
        background: "#fff",
        padding: "8px 10px",
        fontSize: 12,
      }}
    >
      {p.carrera && <div style={{ fontWeight: 700, marginBottom: 2 }}>{p.carrera}</div>}
      {p.lugar && <div style={{ color: "#7b8493" }}>{p.lugar}</div>}
      <div>Tiempo: {formatTiempo(p.tiempo)}</div>
      <div>Ritmo: {formatRitmo(p.ritmo)}</div>
    </div>
  );
}

export function RitmoChart({
  data,
  height = 260,
}: {
  data: RitmoPunto[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke={PALETA.grid} />
        <XAxis dataKey="label" {...axisProps} />
        {/* Eje Y visible (min/Km), horquilla fija 3:00–6:00 */}
        <YAxis
          {...axisProps}
          width={44}
          domain={[180, 360]}
          ticks={[180, 240, 300, 360]}
          tickFormatter={(v) => formatRitmoCorto(Number(v))}
        />
        <Tooltip content={<RitmoTooltip />} />
        <Line
          type="monotone"
          dataKey="ritmo"
          stroke={PALETA.sky}
          strokeWidth={2.5}
          dot={(props: { cx?: number; cy?: number; index?: number; payload?: { alerta?: boolean } }) => {
            const { cx, cy, index, payload } = props;
            const rojo = payload?.alerta;
            return (
              <circle
                key={index}
                cx={cx}
                cy={cy}
                r={4.5}
                fill={rojo ? PALETA.rojo : PALETA.sky}
                stroke="#fff"
                strokeWidth={1.5}
              />
            );
          }}
          activeDot={{ r: 6 }}
        >
          <LabelList
            dataKey="ritmo"
            position="top"
            fontSize={12}
            fontWeight={600}
            fill={PALETA.ink}
            formatter={(value: unknown) => formatRitmoCorto(Number(value))}
          />
        </Line>
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
  fmt = formatInt,
}: {
  data: { name: string; value: number; color: string }[];
  height?: number;
  centerTop?: string;
  centerBottom?: string;
  fmt?: Fmt;
}) {
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={2} stroke="none">
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle()} formatter={(value) => [fmt(Number(value)), ""]} />
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
