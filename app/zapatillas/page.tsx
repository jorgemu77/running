"use client";

import { Footprints, CircleCheck, Route, TriangleAlert } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { totalKmZapatilla, timelineZapatilla } from "@/lib/data/stats";
import { LIMITE_KM_ZAPATILLA, type ShoeRecord } from "@/lib/data/types";
import { formatKm, formatInt, formatNum } from "@/lib/format";
import { PageHeader, StatCard, Card, Badge, LinkButton } from "@/components/ui";
import { BarsChart, PALETA } from "@/components/charts";

function ShoeCard({ shoe }: { shoe: ShoeRecord }) {
  const total = totalKmZapatilla(shoe);
  const pct = Math.min((total / LIMITE_KM_ZAPATILLA) * 100, 100);
  const supera = total > LIMITE_KM_ZAPATILLA;
  const aviso = total > LIMITE_KM_ZAPATILLA * 0.8;
  const barColor = supera ? PALETA.coral : aviso ? PALETA.sun : PALETA.brand;

  const data = timelineZapatilla(shoe).filter((m) => m.km > 0);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-page">
          {shoe.foto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shoe.foto} alt={shoe.nombre} className="h-full w-full object-contain" />
          ) : (
            <Footprints className="text-muted" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-semibold">{shoe.nombre}</h3>
          </div>
          <p className="text-xs text-muted">{shoe.marca}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge color={shoe.estado === "ACTIVAS" ? "mint" : "neutral"}>
              {shoe.estado === "ACTIVAS" ? "Activas" : "Baja"}
            </Badge>
            {supera && (
              <Badge color="coral">
                <TriangleAlert size={12} /> Supera {LIMITE_KM_ZAPATILLA} km
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold leading-none">{formatKm(total)}</div>
          <div className="text-xs text-muted">km</div>
        </div>
      </div>

      {/* Progreso hacia el límite recomendado */}
      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-muted">
          <span>Desgaste</span>
          <span>
            {formatKm(total)} / {LIMITE_KM_ZAPATILLA} km
          </span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColor }} />
        </div>
      </div>

      {data.length > 0 ? (
        <BarsChart
          data={data}
          xKey="label"
          bars={[{ key: "km", color: barColor }]}
          fmt={formatNum}
          yMax={240}
          height={160}
        />
      ) : (
        <p className="rounded-xl bg-page/60 px-3 py-4 text-center text-xs text-muted">
          Sin kilómetros registrados todavía.
        </p>
      )}
    </Card>
  );
}

export default function ZapatillasDashboard() {
  const { zapatillas } = useAppStore();

  const activas = zapatillas.filter((z) => z.estado === "ACTIVAS");
  const baja = zapatillas.filter((z) => z.estado === "BAJA");
  const kmAcumulados = zapatillas.reduce((acc, z) => acc + totalKmZapatilla(z), 0);
  const enAviso = zapatillas.filter((z) => totalKmZapatilla(z) > LIMITE_KM_ZAPATILLA).length;

  return (
    <>
      <PageHeader
        title="Zapatillas"
        icon={<Footprints size={26} />}
        actions={
          <LinkButton href="/zapatillas/registro" variant="primary">
            Registro
          </LinkButton>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<Footprints size={18} />} label="Zapatillas registradas" value={zapatillas.length} accent="brand" />
        <StatCard icon={<CircleCheck size={18} />} label="Zapatillas en uso" value={activas.length} sub={`${baja.length} de baja`} accent="mint" />
        <StatCard icon={<Route size={18} />} label="Km acumulados" value={`${formatInt(kmAcumulados)} km`} sub="Todas las zapatillas" accent="sky" />
        <StatCard icon={<TriangleAlert size={18} />} label="Zapatillas exceso Km" value={enAviso} sub="Sobrepasado 800Kms" accent={enAviso ? "coral" : "sun"} />
      </div>

      <section className="mt-6">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
          <span className="h-2 w-2 rounded-full bg-mint" /> Activas ({activas.length})
        </h2>
        {activas.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {activas.map((z) => (
              <ShoeCard key={z.id} shoe={z} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">No hay zapatillas activas.</p>
        )}
      </section>

      {baja.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted">
            <span className="h-2 w-2 rounded-full bg-muted" /> Inactivas ({baja.length})
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {baja.map((z) => (
              <ShoeCard key={z.id} shoe={z} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
