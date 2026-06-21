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

/** Formatea km con separador de miles y decimales opcionales. */
export function formatKm(n: number | null | undefined, decimals = 0): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toLocaleString("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatNumber(n: number | null | undefined, decimals = 0): string {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return n.toLocaleString("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
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

/** Segundos por km -> "m:ss /km". */
export function formatRitmo(seg: number | null | undefined): string {
  if (seg === null || seg === undefined || Number.isNaN(seg)) return "—";
  const s = Math.round(seg);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")} /km`;
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
