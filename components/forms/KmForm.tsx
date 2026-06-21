"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { KmRecord } from "@/lib/data/types";
import { mesLargo } from "@/lib/format";
import { Card, Button } from "@/components/ui";
import { Field, Input, Select } from "@/components/form";

export type KmFormValues = Omit<KmRecord, "id">;

export function KmForm({
  initial,
  onSubmit,
}: {
  initial?: KmFormValues;
  onSubmit: (values: KmFormValues) => void | Promise<void>;
}) {
  const router = useRouter();
  const ahora = new Date();
  const [year, setYear] = useState(String(initial?.year ?? ahora.getFullYear()));
  const [month, setMonth] = useState(String(initial?.month ?? ahora.getMonth() + 1));
  const [km, setKm] = useState(initial ? String(initial.km) : "");
  const [guardando, setGuardando] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    try {
      await onSubmit({ year: Number(year), month: Number(month), km: Number(km) || 0 });
      router.push("/kilometros/registro");
    } catch (err) {
      setGuardando(false);
      alert("No se pudo guardar: " + (err instanceof Error ? err.message : String(err)));
    }
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Año">
            <Input
              type="number"
              required
              min={2000}
              max={2100}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </Field>
          <Field label="Mes">
            <Select value={month} onChange={(e) => setMonth(e.target.value)}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {mesLargo(i + 1)}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Kilómetros" hint="Total de kilómetros recorridos ese mes">
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            min={0}
            required
            value={km}
            onChange={(e) => setKm(e.target.value)}
            placeholder="0"
          />
        </Field>

        <div className="mt-2 flex items-center gap-2">
          <Button type="submit" variant="primary" disabled={guardando}>
            {guardando ? "Guardando…" : "Guardar"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  );
}
