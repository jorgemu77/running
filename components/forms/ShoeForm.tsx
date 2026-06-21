"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Footprints } from "lucide-react";
import type { EstadoZapatilla, ShoeRecord } from "@/lib/data/types";
import { Card, Button } from "@/components/ui";
import { Field, Input, Select } from "@/components/form";

export type ShoeFormValues = Omit<ShoeRecord, "id">;

export function ShoeForm({
  initial,
  onSubmit,
}: {
  initial?: ShoeFormValues;
  onSubmit: (values: ShoeFormValues) => void | Promise<void>;
}) {
  const router = useRouter();
  const [nombre, setNombre] = useState(initial?.nombre ?? "");
  const [marca, setMarca] = useState(initial?.marca ?? "");
  const [estado, setEstado] = useState<EstadoZapatilla>(initial?.estado ?? "ACTIVAS");
  const [foto, setFoto] = useState(initial?.foto ?? "");
  const [guardando, setGuardando] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    try {
      await onSubmit({
        nombre: nombre.trim(),
        marca: marca.trim(),
        estado,
        foto: foto.trim() || null,
        meses: initial?.meses ?? [],
      });
      router.push("/zapatillas/registro");
    } catch (err) {
      setGuardando(false);
      alert("No se pudo guardar: " + (err instanceof Error ? err.message : String(err)));
    }
  }

  return (
    <Card className="max-w-xl">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-page">
            {foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={foto} alt="Previsualización" className="h-full w-full object-contain" />
            ) : (
              <Footprints className="text-muted" />
            )}
          </div>
          <p className="text-xs text-muted">
            Vista previa de la foto. Los kilómetros mensuales se gestionan desde sus registros.
          </p>
        </div>

        <Field label="Zapatilla">
          <Input required value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Nike Pegasus 42 Zoom negras" />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Marca">
            <Input value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Nike, Adidas…" />
          </Field>
          <Field label="Estado">
            <Select value={estado} onChange={(e) => setEstado(e.target.value as EstadoZapatilla)}>
              <option value="ACTIVAS">Activas</option>
              <option value="BAJA">Baja</option>
            </Select>
          </Field>
        </div>

        <Field label="Foto (URL)" hint="Sube la imagen al bucket «Images» de Supabase Storage y pega aquí su URL pública">
          <Input value={foto} onChange={(e) => setFoto(e.target.value)} placeholder="/zapatillas/…" />
        </Field>

        <div className="mt-2 flex items-center gap-2">
          <Button type="submit" variant="primary" disabled={guardando}>{guardando ? "Guardando…" : "Guardar"}</Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
        </div>
      </form>
    </Card>
  );
}
