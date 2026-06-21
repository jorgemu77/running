// Exportación a CSV en el navegador.

export type CsvColumn<T> = {
  header: string;
  value: (row: T) => string | number | null | undefined;
};

function escapa(valor: string | number | null | undefined): string {
  if (valor === null || valor === undefined) return "";
  const s = String(valor);
  if (/[";\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function generaCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const cabecera = columns.map((c) => escapa(c.header)).join(";");
  const cuerpo = rows
    .map((r) => columns.map((c) => escapa(c.value(r))).join(";"))
    .join("\n");
  // BOM para que Excel reconozca UTF-8.
  return "﻿" + cabecera + "\n" + cuerpo;
}

export function descargaCsv<T>(
  nombreArchivo: string,
  rows: T[],
  columns: CsvColumn<T>[],
): void {
  const csv = generaCsv(rows, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo.endsWith(".csv") ? nombreArchivo : `${nombreArchivo}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
