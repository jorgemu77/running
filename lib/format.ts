// Formateadores compartidos (es-ES)

export const MESES_CORTOS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

export const MESES_LARGOS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function mesCorto(month: number): string {
  return MESES_CORTOS[month - 1] ?? "";
}

export function mesLargo(month: number): string {
  return MESES_LARGOS[month - 1] ?? "";
}

/**
 * Formato numérico europeo: miles con "." y decimales con ",".
 * Siempre 2 decimales, salvo que sean "00" (o el número sea entero) → sin decimales.
 */
export function formatNum(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const sign = n < 0 ? "-" : "";
  const fixed = Math.abs(n).toFixed(2);
  const [intRaw, decRaw] = fixed.split(".");
  const intPart = intRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return decRaw === "00" ? `${sign}${intPart}` : `${sign}${intPart},${decRaw}`;
}

/** Alias para kilómetros (mismo formato europeo). */
export function formatKm(n: number | null | undefined): string {
  return formatNum(n);
}

export function formatNumber(n: number | null | undefined): string {
  return formatNum(n);
}

/** Entero con miles "." (para contadores). */
export function formatInt(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/** Segundos -> "h:mm:ss" (o "mm:ss" si <1h). */
export function formatTiempo(seg: number | null | undefined): string {
  if (seg === null || seg === undefined || Number.isNaN(seg)) return "—";
  const s = Math.round(seg);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

/** Segundos por km -> "m:ss min/Km". */
export function formatRitmo(seg: number | null | undefined): string {
  if (seg === null || seg === undefined || Number.isNaN(seg)) return "—";
  return `${formatRitmoCorto(seg)} min/Km`;
}

/** Segundos por km -> "m:ss" (sin unidad, para inputs y ejes). */
export function formatRitmoCorto(seg: number | null | undefined): string {
  if (seg === null || seg === undefined || Number.isNaN(seg)) return "—";
  const s = Math.round(seg);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

/** ISO yyyy-mm-dd -> "14 sep 2014". */
export function formatFecha(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${mesCorto(m).toLowerCase()} ${y}`;
}

/** ISO yyyy-mm-dd -> "14/09/2014". */
export function formatFechaCorta(iso: string | null | undefined): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

/** Kilómetros numéricos de una distancia tipo "21K" / "20k". */
export function kmDeDistancia(distancia: string): number {
  const n = parseFloat(distancia.replace(/[kK]/g, ""));
  return Number.isNaN(n) ? 0 : n;
}
