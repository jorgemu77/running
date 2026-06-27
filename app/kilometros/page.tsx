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
import { formatInt, formatNum, mesCorto } from "@/lib/format";
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
  const dataMeses = kmPorMesDeAnio(kilometros, anio)
    .map((m) => ({ mes: mesCorto(m.month), km: Math.round(m.km) }))
    .filter((m) => m.km > 0);

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
        icon={<Route size={26} />}
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
          value={`${formatInt(total)} km`}
          sub={`Desde ${anios[anios.length - 1]}`}
          accent="brand"
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label={`Año ${anioActual.year} (en curso)`}
          value={`${formatInt(anioActual.km)} km`}
          sub="Acumulado del año"
          accent="sky"
        />
        <StatCard
          icon={<Gauge size={18} />}
          label="Media mensual histórico"
          value={`${formatInt(media)} km`}
          sub="Sobre meses registrados"
          accent="mint"
        />
        <StatCard
          icon={<Trophy size={18} />}
          label="Mejor año"
          value={`${formatInt(mejorAnio.km)} km`}
          sub={`En ${mejorAnio.year}`}
          accent="sun"
        />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <ChartCard title="Kilómetros por año">
          <BarsChart
            data={dataAnios}
            xKey="anio"
            bars={[{ key: "km", color: PALETA.brand }]}
            fmt={formatNum}
            height={300}
          />
        </ChartCard>

        <ChartCard title="Kilómetros por mes" action={<span className="text-xs text-muted">media histórica | todos los años</span>}>
          <BarsChart
            data={estacionalidad}
            xKey="mes"
            bars={[{ key: "km", color: PALETA.sky }]}
            fmt={formatNum}
            height={300}
          />
        </ChartCard>

        <ChartCard
          title={`Kilómetros por mes y año | ${anio}`}
          action={
            <div className="w-24">
              <Select
                value={anio}
                onChange={(e) => setAnio(Number(e.target.value))}
                className="py-1.5 text-sm"
              >
                {anios.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Select>
            </div>
          }
        >
          <AreaTrend
            data={dataMeses}
            xKey="mes"
            yKey="km"
            color={PALETA.brand}
            fmt={formatNum}
            height={300}
          />
        </ChartCard>
      </div>
    </>
  );
}
