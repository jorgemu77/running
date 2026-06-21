import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  KmRecord,
  RaceRecord,
  ShoeRecord,
  Distancia,
  TipoCarrera,
  EstiloCarrera,
  EstadoZapatilla,
  MesKm,
} from "@/lib/data/types";

type SB = SupabaseClient;

/* ---------- KILÓMETROS ---------- */

export async function fetchKilometros(sb: SB): Promise<KmRecord[]> {
  const { data, error } = await sb
    .from("kilometros")
    .select("id, anio, mes, km")
    .order("anio", { ascending: true })
    .order("mes", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id as string,
    year: r.anio as number,
    month: r.mes as number,
    km: Number(r.km),
  }));
}

export async function insertKm(sb: SB, v: Omit<KmRecord, "id">) {
  const { error } = await sb.from("kilometros").insert({ anio: v.year, mes: v.month, km: v.km });
  if (error) throw error;
}

export async function updateKm(sb: SB, id: string, v: Omit<KmRecord, "id">) {
  const { error } = await sb
    .from("kilometros")
    .update({ anio: v.year, mes: v.month, km: v.km })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteKm(sb: SB, id: string) {
  const { error } = await sb.from("kilometros").delete().eq("id", id);
  if (error) throw error;
}

/* ---------- CARRERAS ---------- */

export async function fetchCarreras(sb: SB): Promise<RaceRecord[]> {
  const { data, error } = await sb
    .from("carreras")
    .select("id, fecha, carrera, lugar, distancia, tipo, estilo, tiempo_seg, media_seg, dorsal, posicion")
    .order("fecha", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id as string,
    fecha: r.fecha as string,
    carrera: r.carrera as string,
    lugar: (r.lugar ?? "") as string,
    distancia: r.distancia as Distancia,
    tipo: r.tipo as TipoCarrera,
    estilo: r.estilo as EstiloCarrera,
    tiempoSeg: r.tiempo_seg as number | null,
    mediaSeg: r.media_seg as number | null,
    dorsal: r.dorsal as number | null,
    posicion: r.posicion as number | null,
  }));
}

function raceToRow(v: Omit<RaceRecord, "id">) {
  return {
    fecha: v.fecha,
    carrera: v.carrera,
    lugar: v.lugar || null,
    distancia: v.distancia,
    tipo: v.tipo,
    estilo: v.estilo,
    tiempo_seg: v.tiempoSeg,
    media_seg: v.mediaSeg,
    dorsal: v.dorsal,
    posicion: v.posicion,
  };
}

export async function insertRace(sb: SB, v: Omit<RaceRecord, "id">) {
  const { error } = await sb.from("carreras").insert(raceToRow(v));
  if (error) throw error;
}

export async function updateRace(sb: SB, id: string, v: Omit<RaceRecord, "id">) {
  const { error } = await sb.from("carreras").update(raceToRow(v)).eq("id", id);
  if (error) throw error;
}

export async function deleteRace(sb: SB, id: string) {
  const { error } = await sb.from("carreras").delete().eq("id", id);
  if (error) throw error;
}

/* ---------- ZAPATILLAS ---------- */

export async function fetchZapatillas(sb: SB): Promise<ShoeRecord[]> {
  const [{ data: zs, error: e1 }, { data: km, error: e2 }] = await Promise.all([
    sb.from("zapatillas").select("id, nombre, marca, estado, foto"),
    sb.from("zapatilla_km").select("zapatilla_id, anio, mes, km"),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;

  const porZapatilla = new Map<string, MesKm[]>();
  for (const m of km ?? []) {
    const arr = porZapatilla.get(m.zapatilla_id as string) ?? [];
    arr.push({ year: m.anio as number, month: m.mes as number, km: Number(m.km) });
    porZapatilla.set(m.zapatilla_id as string, arr);
  }

  return (zs ?? []).map((z) => ({
    id: z.id as string,
    nombre: z.nombre as string,
    marca: (z.marca ?? "") as string,
    estado: z.estado as EstadoZapatilla,
    foto: (z.foto ?? null) as string | null,
    meses: porZapatilla.get(z.id as string) ?? [],
  }));
}

export async function insertShoe(sb: SB, v: Omit<ShoeRecord, "id">) {
  const { error } = await sb
    .from("zapatillas")
    .insert({ nombre: v.nombre, marca: v.marca || null, estado: v.estado, foto: v.foto });
  if (error) throw error;
}

export async function updateShoe(sb: SB, id: string, v: Omit<ShoeRecord, "id">) {
  // Solo metadatos; los km mensuales se gestionan aparte.
  const { error } = await sb
    .from("zapatillas")
    .update({ nombre: v.nombre, marca: v.marca || null, estado: v.estado, foto: v.foto })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteShoe(sb: SB, id: string) {
  const { error } = await sb.from("zapatillas").delete().eq("id", id);
  if (error) throw error;
}
