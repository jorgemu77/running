import type { KmRecord } from "./types";

// Datos extraídos de Airtable "RUNNING KPIs" → Tabla KILÓMETROS.
// Formato origen: 1 fila por año con 12 valores mensuales (km).
// Aquí se almacena de forma compacta y se expande a registros mensuales.
// El mes en curso (junio 2026) aún sin km registrados.

type FilaAnual = { year: number; meses: number[] }; // 12 valores Ene..Dic

const FILAS: FilaAnual[] = [
  { year: 2012, meses: [0, 0, 0, 0, 18.02, 105.47, 63.87, 118.96, 83.44, 114.67, 113.45, 23.08] },
  { year: 2013, meses: [60.57, 102.65, 121.8, 138.85, 132.89, 83.54, 161.38, 137.19, 155.44, 100.52, 31.81, 135.91] },
  { year: 2014, meses: [227.94, 224.33, 267.84, 253.25, 257.21, 102.48, 192.52, 215.73, 134.12, 140.19, 181.06, 147.06] },
  { year: 2015, meses: [148.52, 108, 194, 215.14, 226.4, 156.19, 212.34, 248.7, 244.8, 214.28, 139.66, 153.47] },
  { year: 2016, meses: [199.26, 171.76, 203.19, 113.18, 86.19, 203.37, 254.54, 273.95, 220.73, 220.12, 179.4, 160.97] },
  { year: 2017, meses: [182.3, 203.5, 245.52, 193.54, 134.06, 219.53, 279.44, 201.92, 189.97, 191.99, 184.73, 173.83] },
  { year: 2018, meses: [170.1, 133.1, 167.7, 144.7, 139.5, 167, 169.9, 75.3, 158.1, 225.28, 213.7, 311] },
  { year: 2019, meses: [283.3, 195.1, 140.2, 137.9, 211.3, 126.9, 218.9, 191.9, 95.3, 79.5, 52.5, 106.1] },
  { year: 2020, meses: [89.2, 22.1, 0, 5, 176.1, 222.9, 220.8, 216.38, 197.27, 242.72, 187.25, 113.04] },
  { year: 2021, meses: [199.07, 116.87, 225.88, 155.02, 212.84, 177.72, 173.83, 168.33, 72.5, 172.79, 127.89, 201.52] },
  { year: 2022, meses: [174, 169.62, 101, 124.11, 168.7, 28.02, 45.87, 90.51, 170.4, 220.5, 142.3, 152.14] },
  { year: 2023, meses: [144.24, 163.76, 215.09, 154.57, 258.86, 84.15, 165.07, 186.31, 119.86, 165.46, 163.85, 181.68] },
  { year: 2024, meses: [183.23, 76.98, 0, 65.44, 115.34, 170.79, 218.17, 201.85, 141.13, 10, 83.47, 64.78] },
  { year: 2025, meses: [206.59, 242.52, 264.57, 247.03, 123.94, 54.15, 161.74, 212.54, 142.96, 160.8, 147.25, 138.3] },
  { year: 2026, meses: [44.15, 77.67, 136.96, 160.25, 137.39, 0, 0, 0, 0, 0, 0, 0] },
];

// Hasta este mes incluido se considera "registrado" (resto del año en curso, oculto).
const ULTIMO_ANIO = 2026;
const ULTIMO_MES = 6; // junio 2026

export const kilometrosSeed: KmRecord[] = FILAS.flatMap(({ year, meses }) =>
  meses
    .map((km, i) => ({ year, month: i + 1, km }))
    .filter((r) => !(r.year === ULTIMO_ANIO && r.month > ULTIMO_MES))
    .map((r) => ({
      id: `km-${r.year}-${String(r.month).padStart(2, "0")}`,
      year: r.year,
      month: r.month,
      km: r.km,
    })),
);
