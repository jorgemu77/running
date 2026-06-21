"use client";

import { useMemo, useState } from "react";
import { Route, TrendingUp, Trophy, Gauge, CalendarRange } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import {
  totalKm,
  kmPorAnio,
  kmPorMesDeAnio,
  mediaMensual,
  aniosDisponibles,
} from "@/lib/data/stats";
import { formatKm, mesCorto } from "@/lib/format";
import { PageHeader, StatCard, ChartCard, LinkButton } from "@/components/ui";
import { Select } from "@/components/form";
import { BarsChart, AreaTrend, PALETA } from "@/components/charts";

export default function KilometrosDashboard() {
  const { kilometros } = useAppStore();
  const anios = aniosDisponibles(kilometros);
  const [anio, setAnio] = useState<number>(anios[0] ?? new Date().getFullYear());

  const total = totalKm(kilometros);
  const porAnio = kmPorAnio(kilometros);
  const media = mediaMensual(kilometros);

  const mejorAnio = useMemo(
    () => porAnio.reduce((b, x) => (x.km > b.km ? x : b), porAnio[0] ?? { year: 0, km: 0 }),
    [porAnio],
  );
  const anioActual = porAnio[porAnio.length - 1] ?? { year: 0, km: 0 };

  const dataAnios = porAnio.map((p) => ({ anio: String(p.year), km: Math.round(p.km) }));
  const dataMeses = kmPorMesDeAnio(kilometros, anio).map((m) => ({
    mes: mesCorto(m.month),
    km: Math.round(m.km),
  }));

  // Estacionalidad: media de km por mes a lo largo de todos los años.
  const estacionalidad = useMemo(() => {
    const suma = Array(12).fill(0);
    const cuenta = Array(12).fill(0);
    for (const r of kilometros) {
      suma[r.month - 1] += r.km;
      cuenta[r.month - 1] += 1;
    }
    return suma.map((s, i) => ({
      mes: mesCorto(i + 1),
      km: cuenta[i] ? Math.round(s / cuenta[i]) : 0,
    }));
  }, [kilometros]);

  return (
    <>
      <PageHeader
        title="Kilómetros"
        subtitle="Histórico de kilómetros recorridos por año y mes"
        actions={
          <LinkButton href="/kilometros/registro" variant="primary">
            Registro
          </LinkButton>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Route size={18} />}
          label="Total histórico"
          value={`${formatKm(total)} km`}
          sub={`Desde ${anios[anios.length - 1]}`}
          accent="brand"
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label={`Año ${anioActual.year} (en curso)`}
          value={`${formatKm(anioActual.km)} km`}
          sub="Acumulado del año"
          accent="sky"
        />
        <StatCard
          icon={<Gauge size={18} />}
          label="Media mensual"
          value={`${formatKm(media)} km`}
          sub="Sobre meses registrados"
          accent="mint"
        />
        <StatCard
          icon={<Trophy size={18} />}
          label="Mejor año"
          value={`${formatKm(mejorAnio.km)} km`}
          sub={`En ${mejorAnio.year}`}
          accent="sun"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Kilómetros por año" className="lg:col-span-2">
          <BarsChart
            data={dataAnios}
            xKey="anio"
            bars={[{ key: "km", color: PALETA.brand }]}
            fmt={(v) => `${formatKm(v)} km`}
            height={280}
          />
        </ChartCard>

        <ChartCard title="Media por mes" action={<span className="text-xs text-muted">todos los años</span>}>
          <BarsChart
            data={estacionalidad}
            xKey="mes"
            bars={[{ key: "km", color: PALETA.sky }]}
            fmt={(v) => `${formatKm(v)} km`}
            height={280}
          />
        </ChartCard>
      </div>

      <div className="mt-4">
        <ChartCard
          title={`Kilómetros por mes · ${anio}`}
          action={
            <Select
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className="w-28 py-1.5 text-sm"
            >
              {anios.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          }
        >
          <AreaTrend
            data={dataMeses}
            xKey="mes"
            yKey="km"
            color={PALETA.brand}
            fmt={(v) => `${formatKm(v)} km`}
            height={300}
          />
        </ChartCard>
      </div>
    </>
  );
}
