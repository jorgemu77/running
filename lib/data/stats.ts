import type { KmRecord, RaceRecord, ShoeRecord } from "./types";
import { categoriaDeDistancia } from "./types";

// ---------- KILÓMETROS ----------

export function totalKm(records: KmRecord[]): number {
  return records.reduce((acc, r) => acc + r.km, 0);
}

export function kmPorAnio(records: KmRecord[]): { year: number; km: number }[] {
  const map = new Map<number, number>();
  for (const r of records) map.set(r.year, (map.get(r.year) ?? 0) + r.km);
  return [...map.entries()]
    .map(([year, km]) => ({ year, km }))
    .sort((a, b) => a.year - b.year);
}

export function kmPorMesDeAnio(records: KmRecord[], year: number): { month: number; km: number }[] {
  const out = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, km: 0 }));
  for (const r of records) if (r.year === year) out[r.month - 1].km += r.km;
  return out;
}

/** Media de km por mes a lo largo de todos los meses con registro. */
export function mediaMensual(records: KmRecord[]): number {
  if (records.length === 0) return 0;
  return totalKm(records) / records.length;
}

export function aniosDisponibles(records: KmRecord[]): number[] {
  return [...new Set(records.map((r) => r.year))].sort((a, b) => b - a);
}

// ---------- CARRERAS ----------

export function filtraCategoria(
  races: RaceRecord[],
  categoria: "TODAS" | "POPULAR" | "MEDIA" | "MARATON",
): RaceRecord[] {
  if (categoria === "TODAS") return races;
  return races.filter((r) => categoriaDeDistancia(r.distancia) === categoria);
}

export function mejorTiempo(races: RaceRecord[]): RaceRecord | null {
  const conTiempo = races.filter((r) => r.tiempoSeg != null);
  if (conTiempo.length === 0) return null;
  return conTiempo.reduce((best, r) =>
    (r.tiempoSeg as number) < (best.tiempoSeg as number) ? r : best,
  );
}

export function mejorRitmo(races: RaceRecord[]): RaceRecord | null {
  const conRitmo = races.filter((r) => r.mediaSeg != null);
  if (conRitmo.length === 0) return null;
  return conRitmo.reduce((best, r) =>
    (r.mediaSeg as number) < (best.mediaSeg as number) ? r : best,
  );
}

export function carrerasPorAnio(races: RaceRecord[]): { year: number; n: number }[] {
  const map = new Map<number, number>();
  for (const r of races) {
    const y = Number(r.fecha.slice(0, 4));
    map.set(y, (map.get(y) ?? 0) + 1);
  }
  return [...map.entries()].map(([year, n]) => ({ year, n })).sort((a, b) => a.year - b.year);
}

export function conteoPorDistancia(races: RaceRecord[]): { distancia: string; n: number }[] {
  const map = new Map<string, number>();
  for (const r of races) map.set(r.distancia, (map.get(r.distancia) ?? 0) + 1);
  return [...map.entries()].map(([distancia, n]) => ({ distancia, n }));
}

// ---------- ZAPATILLAS ----------

export function totalKmZapatilla(shoe: ShoeRecord): number {
  return shoe.meses.reduce((acc, m) => acc + m.km, 0);
}

export function timelineZapatilla(shoe: ShoeRecord): { label: string; km: number }[] {
  return shoe.meses
    .slice()
    .sort((a, b) => a.year - b.year || a.month - b.month)
    .map((m) => ({ label: `${String(m.month).padStart(2, "0")}/${String(m.year).slice(2)}`, km: m.km }));
}
