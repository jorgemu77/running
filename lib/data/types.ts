// Tipos del dominio de Running TRACKER

export type KmRecord = {
  id: string;
  year: number;
  month: number; // 1-12
  km: number;
};

export type Distancia =
  | "5K"
  | "7K"
  | "10K"
  | "11K"
  | "12K"
  | "20k"
  | "21K"
  | "26K"
  | "42K";

export type TipoCarrera = "COMPETENCIA" | "ACOMPAÑAMIENTO";
export type EstiloCarrera = "ASFALTO" | "TRAIL";
export type CategoriaCarrera = "POPULAR" | "MEDIA" | "MARATON";

export type RaceRecord = {
  id: string;
  fecha: string; // ISO yyyy-mm-dd
  carrera: string;
  lugar: string;
  distancia: Distancia;
  tipo: TipoCarrera;
  estilo: EstiloCarrera;
  tiempoSeg: number | null; // tiempo total en segundos
  mediaSeg: number | null; // ritmo medio por km en segundos
  dorsal: number | null;
  posicion: number | null;
};

export type EstadoZapatilla = "ACTIVAS" | "BAJA";

export type MesKm = { year: number; month: number; km: number };

export type ShoeRecord = {
  id: string;
  nombre: string;
  marca: string;
  estado: EstadoZapatilla;
  foto: string | null;
  meses: MesKm[];
};

export const LIMITE_KM_ZAPATILLA = 800;

export function categoriaDeDistancia(d: Distancia): CategoriaCarrera {
  if (d === "21K") return "MEDIA";
  if (d === "42K") return "MARATON";
  return "POPULAR";
}
