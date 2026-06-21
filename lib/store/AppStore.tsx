"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { kilometrosSeed } from "@/lib/data/kilometros";
import { eventosSeed } from "@/lib/data/eventos";
import { zapatillasSeed } from "@/lib/data/zapatillas";
import type { KmRecord, RaceRecord, ShoeRecord } from "@/lib/data/types";

// Store en memoria (PMI). Sembrado con los datos de Airtable.
// Las mutaciones persisten durante la sesión; se reinician al recargar.
// Cuando montemos el backend, esto se sustituye por llamadas a Supabase.

type AppStore = {
  kilometros: KmRecord[];
  eventos: RaceRecord[];
  zapatillas: ShoeRecord[];

  addKm: (r: Omit<KmRecord, "id">) => void;
  updateKm: (id: string, r: Omit<KmRecord, "id">) => void;
  deleteKm: (id: string) => void;

  addRace: (r: Omit<RaceRecord, "id">) => void;
  updateRace: (id: string, r: Omit<RaceRecord, "id">) => void;
  deleteRace: (id: string) => void;

  addShoe: (r: Omit<ShoeRecord, "id">) => void;
  updateShoe: (id: string, r: Omit<ShoeRecord, "id">) => void;
  deleteShoe: (id: string) => void;
};

const Ctx = createContext<AppStore | null>(null);

function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [kilometros, setKilometros] = useState<KmRecord[]>(kilometrosSeed);
  const [eventos, setEventos] = useState<RaceRecord[]>(eventosSeed);
  const [zapatillas, setZapatillas] = useState<ShoeRecord[]>(zapatillasSeed);

  const store: AppStore = {
    kilometros,
    eventos,
    zapatillas,

    addKm: (r) => setKilometros((prev) => [...prev, { ...r, id: uid("km") }]),
    updateKm: (id, r) =>
      setKilometros((prev) => prev.map((x) => (x.id === id ? { ...r, id } : x))),
    deleteKm: (id) => setKilometros((prev) => prev.filter((x) => x.id !== id)),

    addRace: (r) => setEventos((prev) => [...prev, { ...r, id: uid("ev") }]),
    updateRace: (id, r) =>
      setEventos((prev) => prev.map((x) => (x.id === id ? { ...r, id } : x))),
    deleteRace: (id) => setEventos((prev) => prev.filter((x) => x.id !== id)),

    addShoe: (r) => setZapatillas((prev) => [...prev, { ...r, id: uid("zap") }]),
    updateShoe: (id, r) =>
      setZapatillas((prev) => prev.map((x) => (x.id === id ? { ...r, id } : x))),
    deleteShoe: (id) => setZapatillas((prev) => prev.filter((x) => x.id !== id)),
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useAppStore(): AppStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppStore debe usarse dentro de AppStoreProvider");
  return ctx;
}
