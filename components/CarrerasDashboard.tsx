"use client";

import { useMemo } from "react";
import { Trophy, Flag, Gauge, Timer } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { filtraCategoria, mejorRitmo, mejorTiempo } from "@/lib/data/stats";
import { categoriaDeDistancia, type RaceRecord } from "@/lib/data/types";
import { formatInt, formatRitmo, formatTiempo, formatFecha, kmDeDistancia } from "@/lib/format";
import { PageHeader, StatCard, ChartCard, Card, LinkButton, Badge } from "@/components/ui";
import {
  CarrerasPorAnioChart,
  DonutChart,
  RitmoChart,
  Leyenda,
  PALETA,
  TIPO_COLOR,
} from "@/components/charts";

type Cat = "TODAS" | "POPULAR" | "MEDIA" | "MARATON";

const TITULOS: Record<Cat, string> = {
  TODAS: "Carreras",
  POPULAR: "Carreras | Populares",
  MEDIA: "Carreras | Medias maratones",
  MARATON: "Carreras | Maratones",
};

const KM_LABEL: Record<Cat, string> = {
  TODAS: "Km totales carreras",
  POPULAR: "Km totales populares",
  MEDIA: "Km totales medias",
  MARATON: "Km totales maratones",
};

const MEJOR_LABEL: Record<Cat, string> = {
  TODAS: "Mejor resultado",
  POPULAR: "Mejor resultado",
  MEDIA: "Mejor 21K",
  MARATON: "Mejor 42K",
};

// Tope del eje Y y si se muestra el total encima de las barras apiladas.
const Y_MAX_ANIOS: Record<Cat, number> = { TODAS: 6, POPULAR: 6, MEDIA: 4, MARATON: 3 };
const MOSTRAR_TOTAL: Record<Cat, boolean> = {
  TODAS: false,
  POPULAR: false,
  MEDIA: false,
  MARATON: true,
};

// Color fijo por distancia (evita colisiones al ciclar colores).
const DIST_COLOR: Record<string, string> = {
  "5K": PALETA.sky,
  "7K": PALETA.sun,
  "10K": PALETA.mint,
  "11K": PALETA.coral,
  "12K": PALETA.violet,
  "20k": PALETA.brand,
  "21K": "#f0a868",
  "26K": "#5cc7bf",
  "42K": "#e87fb3",
};

function tipoTexto(t: RaceRecord["tipo"]): string {
  return t === "COMPETENCIA" ? "Competencia" : "Acompañam.";
}
function estiloTexto(e: RaceRecord["estilo"]): string {
  return e === "ASFALTO" ? "Asfalto" : "Trail";
}
function colorDistancia(d: RaceRecord["distancia"]) {
  const c = categoriaDeDistancia(d);
  return c === "MARATON" ? "coral" : c === "MEDIA" ? "sun" : "sky";
}

export function CarrerasDashboard({ categoria }: { categoria: Cat }) {
  const { eventos, kilometros } = useAppStore();
  const carreras = useMemo(() => filtraCategoria(eventos, categoria), [eventos, categoria]);

  const kmTotales = carreras.reduce((acc, r) => acc + kmDeDistancia(r.distancia), 0);
  const mRitmo = mejorRitmo(carreras);

  // Mejor resultado: TODAS = maratón más rápida; resto = más rápida de la categoría.
  const mejorResultado = useMemo(() => {
    if (categoria === "TODAS") return mejorTiempo(carreras.filter((r) => r.distancia === "42K"));
    return mejorTiempo(carreras);
  }, [carreras, categoria]);

  const n42 = eventos.filter((r) => r.distancia === "42K").length;
  const n21 = eventos.filter((r) => r.distancia === "21K").length;

  const subtituloCarreras: Record<Cat, string> = {
    TODAS: `Incluyen ${n42} x 42K y ${n21} x 21K`,
    POPULAR: "Carreras populares",
    MEDIA: "Medias maratones",
    MARATON: "Maratones",
  };

  // Rango de años con registros de kilómetros (para incluir años a 0).
  const rangoAnios = useMemo(() => {
    const ys = kilometros.map((k) => k.year);
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }, [kilometros]);

  // Carreras por año, apiladas por tipo.
  const dataAnios = useMemo(
    () =>
      rangoAnios.map((year) => {
        const delAnio = carreras.filter((r) => Number(r.fecha.slice(0, 4)) === year);
        return {
          anio: String(year),
          COMPETENCIA: delAnio.filter((r) => r.tipo === "COMPETENCIA").length,
          ACOMPAÑAMIENTO: delAnio.filter((r) => r.tipo === "ACOMPAÑAMIENTO").length,
        };
      }),
    [rangoAnios, carreras],
  );

  // Reparto por distancia.
  const dataDistancia = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of carreras) map.set(r.distancia, (map.get(r.distancia) ?? 0) + 1);
    return [...map.entries()]
      .sort((a, b) => kmDeDistancia(a[0]) - kmDeDistancia(b[0]))
      .map(([name, value]) => ({ name, value, color: DIST_COLOR[name] ?? PALETA.muted }));
  }, [carreras]);

  // Reparto por estilo.
  const dataEstilo = useMemo(() => {
    const asfalto = carreras.filter((r) => r.estilo === "ASFALTO").length;
    const trail = carreras.filter((r) => r.estilo === "TRAIL").length;
    return [
      { name: "Asfalto", value: asfalto, color: PALETA.sky },
      { name: "Trail", value: trail, color: PALETA.mint },
    ].filter((d) => d.value > 0);
  }, [carreras]);

  // Ritmo por carrera (cada carrera con ritmo, ordenadas por fecha).
  const dataRitmo = useMemo(
    () =>
      carreras
        .filter((r) => r.mediaSeg != null)
        .slice()
        .sort((a, b) => a.fecha.localeCompare(b.fecha))
        .map((r) => ({
          label: r.fecha.slice(0, 4),
          ritmo: r.mediaSeg as number,
          alerta: categoria === "MEDIA" ? r.tipo === "ACOMPAÑAMIENTO" : false,
          carrera: r.carrera,
          lugar: r.lugar,
          tiempo: r.tiempoSeg,
        })),
    [carreras, categoria],
  );

  const esDistanciaUnica = categoria === "MEDIA" || categoria === "MARATON";
  const showRepartoDistancia = categoria === "TODAS" || categoria === "POPULAR";
  const showRepartoEstilo = categoria === "POPULAR";
  const showRitmo = categoria === "MEDIA" || categoria === "MARATON";

  const ranking = useMemo(
    () => carreras.filter((r) => r.tiempoSeg != null).sort((a, b) => a.tiempoSeg! - b.tiempoSeg!),
    [carreras],
  );
  const mejorPorDistancia = useMemo(() => {
    const map = new Map<string, RaceRecord>();
    for (const r of carreras) {
      if (r.tiempoSeg == null) continue;
      const cur = map.get(r.distancia);
      if (!cur || r.tiempoSeg < cur.tiempoSeg!) map.set(r.distancia, r);
    }
    return [...map.values()].sort((a, b) => kmDeDistancia(a.distancia) - kmDeDistancia(b.distancia));
  }, [carreras]);

  const filasTabla = esDistanciaUnica ? ranking : mejorPorDistancia;

  return (
    <>
      <PageHeader
        title={TITULOS[categoria]}
        icon={<Trophy size={26} />}
        actions={
          <LinkButton href="/carreras/registro" variant="primary">
            Registro
          </LinkButton>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Trophy size={18} />} label="Carreras" value={carreras.length} sub={subtituloCarreras[categoria]} accent="brand" />
        <StatCard icon={<Flag size={18} />} label={KM_LABEL[categoria]} value={`${formatInt(kmTotales)} km`} sub="Suma de distancias" accent="sky" />
        <StatCard icon={<Gauge size={18} />} label="Mejor ritmo" value={mRitmo ? formatRitmo(mRitmo.mediaSeg) : "—"} sub={mRitmo ? mRitmo.carrera : "Sin datos"} accent="mint" />
        <StatCard icon={<Timer size={18} />} label={MEJOR_LABEL[categoria]} value={mejorResultado ? formatTiempo(mejorResultado.tiempoSeg) : "—"} sub={mejorResultado ? `${mejorResultado.distancia} | ${mejorResultado.carrera}` : "Sin datos"} accent="sun" />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <ChartCard title="Carreras por año">
          <CarrerasPorAnioChart
            data={dataAnios}
            height={300}
            yMax={Y_MAX_ANIOS[categoria]}
            showTotal={MOSTRAR_TOTAL[categoria]}
          />
          <div className="mt-3">
            <Leyenda
              items={[
                { name: "Competencia", color: TIPO_COLOR.COMPETENCIA },
                { name: "Acompañamiento", color: TIPO_COLOR.ACOMPAÑAMIENTO },
              ]}
            />
          </div>
        </ChartCard>

        {(showRepartoDistancia || showRepartoEstilo) && (
          <div className={showRepartoEstilo ? "grid grid-cols-1 gap-4 lg:grid-cols-2" : ""}>
            {showRepartoDistancia && (
              <ChartCard title="Reparto por distancia">
                {dataDistancia.length > 0 ? (
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <div className="w-full sm:flex-1">
                      <DonutChart data={dataDistancia} centerTop={String(carreras.length)} centerBottom="carreras" />
                    </div>
                    <div className="w-full shrink-0 sm:w-44">
                      <Leyenda items={dataDistancia.map((d) => ({ name: d.name, color: d.color, value: String(d.value) }))} />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted">Sin datos.</p>
                )}
              </ChartCard>
            )}
            {showRepartoEstilo && (
              <ChartCard title="Reparto por estilo">
                {dataEstilo.length > 0 ? (
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                    <div className="w-full sm:flex-1">
                      <DonutChart data={dataEstilo} centerTop={String(carreras.length)} centerBottom="carreras" />
                    </div>
                    <div className="w-full shrink-0 sm:w-44">
                      <Leyenda items={dataEstilo.map((d) => ({ name: d.name, color: d.color, value: String(d.value) }))} />
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted">Sin datos.</p>
                )}
              </ChartCard>
            )}
          </div>
        )}

        {showRitmo && dataRitmo.length > 0 && (
          <ChartCard title="Ritmo medio por carrera">
            <RitmoChart data={dataRitmo} height={280} />
            {categoria === "MEDIA" && (
              <div className="mt-3">
                <Leyenda
                  items={[
                    { name: "Competencia", color: PALETA.sky },
                    { name: "Acompañamiento", color: PALETA.rojo },
                  ]}
                />
              </div>
            )}
          </ChartCard>
        )}
      </div>

      <div className="mt-4">
        <Card padded={false}>
          <div className="flex items-center justify-between gap-2 px-5 py-4">
            <h3 className="font-semibold">{esDistanciaUnica ? "Ranking por tiempo" : "Mejor marca por distancia"}</h3>
            <Badge color="neutral">
              {esDistanciaUnica ? `${ranking.length} carreras` : `${mejorPorDistancia.length} distancias`}
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-y border-line text-left text-xs uppercase tracking-wide text-muted">
                  {esDistanciaUnica && <th className="px-5 py-3 font-semibold">#</th>}
                  <th className="px-5 py-3 font-semibold">Distancia</th>
                  <th className="px-5 py-3 font-semibold">Carrera</th>
                  <th className="px-5 py-3 font-semibold">Fecha</th>
                  <th className="px-5 py-3 font-semibold">Tipo</th>
                  <th className="px-5 py-3 font-semibold">Estilo</th>
                  <th className="px-5 py-3 text-right font-semibold">Tiempo</th>
                  <th className="px-5 py-3 text-right font-semibold">Ritmo</th>
                </tr>
              </thead>
              <tbody>
                {filasTabla.map((r, i) => (
                  <tr key={r.id} className="border-b border-line last:border-0 hover:bg-page/50">
                    {esDistanciaUnica && <td className="px-5 py-2.5 font-semibold text-muted">{i + 1}</td>}
                    <td className="px-5 py-2.5">
                      <Badge color={colorDistancia(r.distancia)}>{r.distancia}</Badge>
                    </td>
                    <td className="px-5 py-2.5 font-medium">{r.carrera}</td>
                    <td className="px-5 py-2.5 text-muted whitespace-nowrap">{formatFecha(r.fecha)}</td>
                    <td className="px-5 py-2.5 text-muted">{tipoTexto(r.tipo)}</td>
                    <td className="px-5 py-2.5 text-muted">{estiloTexto(r.estilo)}</td>
                    <td className="px-5 py-2.5 text-right font-semibold whitespace-nowrap">{formatTiempo(r.tiempoSeg)}</td>
                    <td className="px-5 py-2.5 text-right whitespace-nowrap">{formatRitmo(r.mediaSeg)}</td>
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
