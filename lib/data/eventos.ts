import type { RaceRecord } from "./types";

// Datos extraídos de Airtable "RUNNING KPIs" → Tabla EVENTOS (27 carreras).
// tiempoSeg = tiempo total en segundos · mediaSeg = ritmo medio /km en segundos.

export const eventosSeed: RaceRecord[] = [
  { id: "ev-01", fecha: "2012-09-29", carrera: "IX Carrera Popular Tres Parques", lugar: "Logroño", distancia: "10K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 2816, mediaSeg: 282, dorsal: 264, posicion: 194 },
  { id: "ev-02", fecha: "2013-01-14", carrera: "V Cross Popular de Reyes Los Lirios", lugar: "Logroño", distancia: "11K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 3027, mediaSeg: 275, dorsal: 311, posicion: 67 },
  { id: "ev-03", fecha: "2013-03-03", carrera: "VII Media Maratón del Camino", lugar: "La Rioja", distancia: "21K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 7025, mediaSeg: 333, dorsal: 398, posicion: 701 },
  { id: "ev-04", fecha: "2013-05-26", carrera: "XXII Media Maratón de La Rioja", lugar: "Logroño", distancia: "21K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 5760, mediaSeg: 273, dorsal: 19, posicion: 336 },
  { id: "ev-05", fecha: "2013-10-19", carrera: "V Bilbao Night Half Marathon", lugar: "Bilbao", distancia: "21K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 5726, mediaSeg: 271, dorsal: 1953, posicion: 448 },
  { id: "ev-06", fecha: "2014-03-09", carrera: "III Media Maratón Internacional de Santander", lugar: "Santander", distancia: "21K", tipo: "ACOMPAÑAMIENTO", estilo: "ASFALTO", tiempoSeg: 6138, mediaSeg: 291, dorsal: 1881, posicion: 1144 },
  { id: "ev-07", fecha: "2014-05-31", carrera: "XXXVI Stockholm Marathon", lugar: "Estocolmo (Suecia)", distancia: "42K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 12301, mediaSeg: 292, dorsal: 5743, posicion: 1735 },
  { id: "ev-08", fecha: "2014-09-14", carrera: "I Media Maratón de Logroño", lugar: "Logroño", distancia: "21K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 5557, mediaSeg: 263, dorsal: 362, posicion: 111 },
  { id: "ev-09", fecha: "2014-11-09", carrera: "I Carrera por la Integración", lugar: "Logroño", distancia: "12K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: null, mediaSeg: null, dorsal: 427, posicion: null },
  { id: "ev-10", fecha: "2014-05-31", carrera: "XXX San Silvestre Memorial Tomás Mingot", lugar: "Logroño", distancia: "7K", tipo: "ACOMPAÑAMIENTO", estilo: "ASFALTO", tiempoSeg: null, mediaSeg: null, dorsal: 6028, posicion: null },
  { id: "ev-11", fecha: "2015-05-30", carrera: "XXII Media Maratón de La Rioja", lugar: "Logroño", distancia: "21K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 5369, mediaSeg: 255, dorsal: null, posicion: 114 },
  { id: "ev-12", fecha: "2015-06-21", carrera: "II Carrera de Montaña Matutrail", lugar: "La Rioja", distancia: "12K", tipo: "COMPETENCIA", estilo: "TRAIL", tiempoSeg: 4675, mediaSeg: 390, dorsal: 72, posicion: 49 },
  { id: "ev-13", fecha: "2015-07-04", carrera: "II Fuchutrail", lugar: "La Rioja", distancia: "10K", tipo: "COMPETENCIA", estilo: "TRAIL", tiempoSeg: null, mediaSeg: null, dorsal: 116, posicion: null },
  { id: "ev-14", fecha: "2015-11-01", carrera: "XLV New York City Marathon", lugar: "Nueva York (EEUU)", distancia: "42K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 11879, mediaSeg: 282, dorsal: 10391, posicion: 2257 },
  { id: "ev-15", fecha: "2016-04-16", carrera: "II Rioja Ultra Trail", lugar: "La Rioja", distancia: "26K", tipo: "COMPETENCIA", estilo: "TRAIL", tiempoSeg: 10838, mediaSeg: 417, dorsal: 102, posicion: 334 },
  { id: "ev-16", fecha: "2016-09-25", carrera: "XLIII Berlin Marathon", lugar: "Berlín (Alemania)", distancia: "42K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 11312, mediaSeg: 268, dorsal: 32606, posicion: 2285 },
  { id: "ev-17", fecha: "2016-10-23", carrera: "IX Carrera entre Viñedos - Cenicero", lugar: "La Rioja", distancia: "10K", tipo: "ACOMPAÑAMIENTO", estilo: "TRAIL", tiempoSeg: 3572, mediaSeg: 357, dorsal: 13, posicion: 670 },
  { id: "ev-18", fecha: "2016-11-13", carrera: "VII Behobia - San Sebastián", lugar: "San Sebastián", distancia: "20k", tipo: "ACOMPAÑAMIENTO", estilo: "ASFALTO", tiempoSeg: 6564, mediaSeg: 328, dorsal: 25941, posicion: 14838 },
  { id: "ev-19", fecha: "2017-04-02", carrera: "XVII Media Maratón de Donosti", lugar: "San Sebastián", distancia: "21K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 5183, mediaSeg: 246, dorsal: 1045, posicion: 185 },
  { id: "ev-20", fecha: "2017-08-19", carrera: "XXXV Islandsbanki de Reikiavik Marathon", lugar: "Reikiavik (Islandia)", distancia: "42K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 11199, mediaSeg: 265, dorsal: 1530, posicion: 12 },
  { id: "ev-21", fecha: "2018-04-07", carrera: "XX Prague Half Marathon", lugar: "Praga (Rep. Checa)", distancia: "21K", tipo: "ACOMPAÑAMIENTO", estilo: "ASFALTO", tiempoSeg: 6789, mediaSeg: 322, dorsal: 4508, posicion: 3273 },
  { id: "ev-22", fecha: "2018-12-16", carrera: "XLI Media Maratón de Vitoria", lugar: "Vitoria", distancia: "21K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 5189, mediaSeg: 246, dorsal: 2429, posicion: 332 },
  { id: "ev-23", fecha: "2019-02-17", carrera: "XXXV Maratón de Sevilla", lugar: "Sevilla", distancia: "42K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 10769, mediaSeg: 255, dorsal: 1362, posicion: 458 },
  { id: "ev-24", fecha: "2020-01-26", carrera: "XXV Carrera Las Arenas - Bilbao", lugar: "Bilbao", distancia: "12K", tipo: "ACOMPAÑAMIENTO", estilo: "ASFALTO", tiempoSeg: 3405, mediaSeg: 284, dorsal: 172, posicion: null },
  { id: "ev-25", fecha: "2020-04-05", carrera: "I Logroño Corre en Casa", lugar: "Logroño", distancia: "5K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 1801, mediaSeg: 360, dorsal: null, posicion: null },
  { id: "ev-26", fecha: "2023-10-21", carrera: "XV Bilbao Night Half Marathon", lugar: "Bilbao", distancia: "21K", tipo: "ACOMPAÑAMIENTO", estilo: "ASFALTO", tiempoSeg: 6806, mediaSeg: 323, dorsal: 7742, posicion: 2432 },
  { id: "ev-27", fecha: "2025-04-27", carrera: "XLVII Maratón de Madrid", lugar: "Madrid", distancia: "42K", tipo: "COMPETENCIA", estilo: "ASFALTO", tiempoSeg: 12914, mediaSeg: 306, dorsal: 5400, posicion: 2486 },
];
