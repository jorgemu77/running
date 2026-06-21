import type { MesKm, ShoeRecord } from "./types";

// Datos extraídos de Airtable "RUNNING KPIs" → Tabla ZAPATILLAS (4 pares).
// Origen en formato ancho (meses de 2025 y 2026 como columnas).

type FilaZapatilla = {
  id: string;
  nombre: string;
  marca: string;
  estado: "ACTIVAS" | "BAJA";
  foto: string;
  m2025: number[]; // Ene..Dic 2025
  m2026: number[]; // Ene..Dic 2026
};

const FILAS: FilaZapatilla[] = [
  {
    id: "zap-pureboost23-naranjas",
    nombre: "Adidas Pureboost 23 naranjas",
    marca: "Adidas",
    estado: "BAJA",
    foto: "/zapatillas/pureboost23-naranjas.png",
    m2025: [75.55, 75.56, 78.55, 119.11, 0, 0, 19.81, 0, 0, 0, 0, 0],
    m2026: [0, 0, 0, 20.36, 39.29, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "zap-pegasus41-negras",
    nombre: "Nike Pegasus 41 Zoom negras",
    marca: "Nike",
    estado: "ACTIVAS",
    foto: "/zapatillas/pegasus41-negras.png",
    m2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 132.99, 138.3],
    m2026: [44.15, 77.67, 136.96, 139.89, 98.1, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "zap-pegasus42-blancas",
    nombre: "Nike Pegasus 42 Zoom blancas",
    marca: "Nike",
    estado: "ACTIVAS",
    foto: "/zapatillas/pegasus42-blancas.png",
    m2025: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    m2026: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "zap-ultraboost20-blancas",
    nombre: "Adidas Ultraboost 20 blancas",
    marca: "Adidas",
    estado: "BAJA",
    foto: "/zapatillas/ultraboost20-blancas.png",
    m2025: [0, 0, 0, 105.15, 104.22, 54.15, 141.93, 212.54, 142.96, 160.8, 14.26, 0],
    m2026: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
];

function aMeses(m2025: number[], m2026: number[]): MesKm[] {
  const meses: MesKm[] = [];
  m2025.forEach((km, i) => meses.push({ year: 2025, month: i + 1, km }));
  m2026.forEach((km, i) => meses.push({ year: 2026, month: i + 1, km }));
  return meses;
}

export const zapatillasSeed: ShoeRecord[] = FILAS.map((f) => ({
  id: f.id,
  nombre: f.nombre,
  marca: f.marca,
  estado: f.estado,
  foto: f.foto,
  meses: aMeses(f.m2025, f.m2026),
}));
