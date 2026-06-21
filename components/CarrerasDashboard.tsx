"use client";

import { useMemo } from "react";
import { Trophy, Flag, Gauge, Timer } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import {
  filtraCategoria,
  mejorRitmo,
  mejorTiempo,
  carrerasPorAnio,
  conteoPorDistancia,
} from "@/lib/data/stats";
import { categoriaDeDistancia } from "@/lib/data/types";
import { formatKm, formatRitmo, formatTiempo, formatFecha, kmDeDistancia } from "@/lib/format";
import { PageHeader, StatCard, ChartCard, Card, LinkButton, Badge } from "@/components/ui";
import { BarsChart, DonutChart, LinesChart, Leyenda, PALETA } from "@/components/charts";

type Cat = "TODAS" | "POPULAR" | "MEDIA" | "MARATON";

const TITULOS: Record<Cat, { title: string; subtitle: string }> = {
  TODAS: { title: "Carreras", subtitle: "Histórico completo de carreras" },
  POPULAR: { title: "Carreras · Populares", subtitle: "Carreras populares (distintas de 21K y 42K)" },
  MEDIA: { title: "Carreras · Medias maratones", subtitle: "Medias maratones (21K)" },
  MARATON: { title: "Carreras · Maratones", subtitle: "Maratones (42K)" },
};

const DIST_COLORS = [PALETA.sky, PALETA.sun, PALETA.mint, PALETA.coral, PALETA.violet, PALETA.brand];

export function CarrerasDashboard({ categoria }: { categoria: Cat }) {
  const { eventos } = useAppStore();
  const carreras = useMemo(() => filtraCategoria(eventos, categoria), [eventos, categoria]);

  const kmTotales = carreras.reduce((acc, r) => acc + kmDeDistancia(r.distancia), 0);
  const mTiempo = mejorTiempo(carreras);
  const mRitmo = mejorRitmo(carreras);
  const nMaratones = carreras.filter((r) => r.distancia === "42K").length;

  const dataAnios = carrerasPorAnio(carreras).map((x) => ({ anio: String(x.year), n: x.n }));

  const dataDistancia = conteoPorDistancia(carreras)
    .sort((a, b) => kmDeDistancia(a.distancia) - kmDeDistancia(b.distancia))
    .map((d, i) => ({ name: d.distancia, value: d.n, color: DIST_COLORS[i % DIST_COLORS.length] }));

  // Ritmo medio por año (segundos/km) para la categoría.
  const ritmoPorAnio = useMemo(() => {
    const map = new Map<number, { suma: number; n: number }>();
    for (const r of carreras) {
      if (r.mediaSeg == null) continue;
      const y = Number(r.fecha.slice(0, 4));
      const cur = map.get(y) ?? { suma: 0, n: 0 };
      cur.suma += r.mediaSeg;
      cur.n += 1;
      map.set(y, cur);
    }
    return [...map.entries()]
      .map(([year, v]) => ({ anio: String(year), ritmo: Math.round(v.suma / v.n) }))
      .sort((a, b) => Number(a.anio) - Number(b.anio));
  }, [carreras]);

  const esDistanciaUnica = categoria === "MEDIA" || categoria === "MARATON";

  // Tabla: ranking por tiempo (distancia única) o mejor marca por distancia.
  const ranking = useMemo(
    () => carreras.filter((r) => r.tiempoSeg != null).sort((a, b) => (a.tiempoSeg! - b.tiempoSeg!)),
    [carreras],
  );

  const mejorPorDistancia = useMemo(() => {
    const map = new Map<string, (typeof carreras)[number]>();
    for (const r of carreras) {
      if (r.tiempoSeg == null) continue;
      const cur = map.get(r.distancia);
      if (!cur || r.tiempoSeg < cur.tiempoSeg!) map.set(r.distancia, r);
    }
    return [...map.values()].sort((a, b) => kmDeDistancia(a.distancia) - kmDeDistancia(b.distancia));
  }, [carreras]);

  const { title, subtitle } = TITULOS[categoria];

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        actions={
          <LinkButton href="/carreras/registro" variant="primary">
            Registro
          </LinkButton>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={<Trophy size={18} />}
          label="Carreras"
          value={carreras.length}
          sub={categoria === "TODAS" ? `${nMaratones} maratones` : subtitle}
          accent="brand"
        />
        <StatCard
          icon={<Flag size={18} />}
          label="Km competidos"
          value={`${formatKm(kmTotales)} km`}
          sub="Suma de distancias"
          accent="sky"
        />
        <StatCard
          icon={<Gauge size={18} />}
          label="Mejor ritmo"
          value={mRitmo ? formatRitmo(mRitmo.mediaSeg) : "—"}
          sub={mRitmo ? mRitmo.carrera : "Sin datos"}
          accent="mint"
        />
        <StatCard
          icon={<Timer size={18} />}
          label="Mejor tiempo"
          value={mTiempo ? formatTiempo(mTiempo.tiempoSeg) : "—"}
          sub={mTiempo ? `${mTiempo.distancia} · ${mTiempo.carrera}` : "Sin datos"}
          accent="sun"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Carreras por año" className="lg:col-span-2">
          <BarsChart
            data={dataAnios}
            xKey="anio"
            bars={[{ key: "n", color: PALETA.brand, name: "Carreras" }]}
            height={280}
          />
        </ChartCard>

        <ChartCard title="Reparto por distancia">
          {dataDistancia.length > 0 ? (
            <div className="flex flex-col gap-4">
              <DonutChart
                data={dataDistancia}
                centerTop={String(carreras.length)}
                centerBottom="carreras"
              />
              <Leyenda
                items={dataDistancia.map((d) => ({
                  name: d.name,
                  color: d.color,
                  value: String(d.value),
                }))}
              />
            </div>
          ) : (
            <p className="text-sm text-muted">Sin datos.</p>
          )}
        </ChartCard>
      </div>

      {ritmoPorAnio.length > 1 && (
        <div className="mt-4">
          <ChartCard
            title="Ritmo medio por año"
            action={<span className="text-xs text-muted">menor es mejor · min:seg /km</span>}
          >
            <LinesChart
              data={ritmoPorAnio}
              xKey="anio"
              lines={[{ key: "ritmo", color: PALETA.sky, name: "Ritmo" }]}
              fmt={(v) => formatRitmo(v)}
              height={260}
            />
          </ChartCard>
        </div>
      )}

      <div className="mt-4">
        <Card padded={false}>
          <div className="flex items-center justify-between gap-2 px-5 py-4">
            <h3 className="font-semibold">
              {esDistanciaUnica ? "Ranking por tiempo" : "Mejor marca por distancia"}
            </h3>
            <Badge color="neutral">
              {esDistanciaUnica ? `${ranking.length} carreras` : `${mejorPorDistancia.length} distancias`}
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-y border-line text-left text-xs uppercase tracking-wide text-muted">
                  {esDistanciaUnica && <th className="px-5 py-3 font-semibold">#</th>}
                  <th className="px-5 py-3 font-semibold">Distancia</th>
                  <th className="px-5 py-3 font-semibold">Carrera</th>
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                  <th className="px-5 py-3 text-right font-semibold">Tiempo</th>
                  <th className="px-5 py-3 text-right font-semibold">Ritmo</th>
                </tr>
              </thead>
              <tbody>
                {(esDistanciaUnica ? ranking : mejorPorDistancia).map((r, i) => (
                  <tr key={r.id} className="border-b border-line last:border-0 hover:bg-page/50">
                    {esDistanciaUnica && (
                      <td className="px-5 py-2.5 font-semibold text-muted">{i + 1}</td>
                    )}
                    <td className="px-5 py-2.5">
                      <Badge color={categoriaDeDistancia(r.distancia) === "MARATON" ? "coral" : categoriaDeDistancia(r.distancia) === "MEDIA" ? "sun" : "sky"}>
                        {r.distancia}
                      </Badge>
                    </td>
                    <td className="px-5 py-2.5 font-medium">{r.carrera}</td>
                    <td className="px-5 py-2.5 text-muted">{formatFecha(r.fecha)}</td>
                    <td className="px-5 py-2.5 text-right font-semibold">{formatTiempo(r.tiempoSeg)}</td>
                    <td className="px-5 py-2.5 text-right">{formatRitmo(r.mediaSeg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
}
