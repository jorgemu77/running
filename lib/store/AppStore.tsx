"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import * as api from "@/lib/supabase/api";
import type { KmRecord, RaceRecord, ShoeRecord } from "@/lib/data/types";

// Store conectado a Supabase. Lee los datos del usuario autenticado y
// persiste las altas/ediciones/borrados. La sesión se gestiona aquí.

type AppStore = {
  kilometros: KmRecord[];
  eventos: RaceRecord[];
  zapatillas: ShoeRecord[];
  loading: boolean;
  userEmail: string | null;

  addKm: (r: Omit<KmRecord, "id">) => Promise<void>;
  updateKm: (id: string, r: Omit<KmRecord, "id">) => Promise<void>;
  deleteKm: (id: string) => Promise<void>;

  addRace: (r: Omit<RaceRecord, "id">) => Promise<void>;
  updateRace: (id: string, r: Omit<RaceRecord, "id">) => Promise<void>;
  deleteRace: (id: string) => Promise<void>;

  addShoe: (r: Omit<ShoeRecord, "id">) => Promise<void>;
  updateShoe: (id: string, r: Omit<ShoeRecord, "id">) => Promise<void>;
  deleteShoe: (id: string) => Promise<void>;

  signOut: () => Promise<void>;
};

const Ctx = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [kilometros, setKilometros] = useState<KmRecord[]>([]);
  const [eventos, setEventos] = useState<RaceRecord[]>([]);
  const [zapatillas, setZapatillas] = useState<ShoeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function cargar(email: string | null | undefined) {
      if (!active) return;
      setUserEmail(email ?? null);
      if (!email) {
        setKilometros([]);
        setEventos([]);
        setZapatillas([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const [k, e, z] = await Promise.all([
          api.fetchKilometros(supabase),
          api.fetchCarreras(supabase),
          api.fetchZapatillas(supabase),
        ]);
        if (!active) return;
        setKilometros(k);
        setEventos(e);
        setZapatillas(z);
      } finally {
        if (active) setLoading(false);
      }
    }

    supabase.auth.getUser().then(({ data }) => cargar(data.user?.email));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      cargar(session?.user?.email),
    );

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const reloadKm = async () => setKilometros(await api.fetchKilometros(supabase));
  const reloadRaces = async () => setEventos(await api.fetchCarreras(supabase));
  const reloadShoes = async () => setZapatillas(await api.fetchZapatillas(supabase));

  const store: AppStore = {
    kilometros,
    eventos,
    zapatillas,
    loading,
    userEmail,

    addKm: async (r) => {
      await api.insertKm(supabase, r);
      await reloadKm();
    },
    updateKm: async (id, r) => {
      await api.updateKm(supabase, id, r);
      await reloadKm();
    },
    deleteKm: async (id) => {
      await api.deleteKm(supabase, id);
      await reloadKm();
    },

    addRace: async (r) => {
      await api.insertRace(supabase, r);
      await reloadRaces();
    },
    updateRace: async (id, r) => {
      await api.updateRace(supabase, id, r);
      await reloadRaces();
    },
    deleteRace: async (id) => {
      await api.deleteRace(supabase, id);
      await reloadRaces();
    },

    addShoe: async (r) => {
      await api.insertShoe(supabase, r);
      await reloadShoes();
    },
    updateShoe: async (id, r) => {
      await api.updateShoe(supabase, id, r);
      await reloadShoes();
    },
    deleteShoe: async (id) => {
      await api.deleteShoe(supabase, id);
      await reloadShoes();
    },

    signOut: async () => {
      await supabase.auth.signOut();
      window.location.href = "/login";
    },
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useAppStore(): AppStore {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppStore debe usarse dentro de AppStoreProvider");
  return ctx;
}
