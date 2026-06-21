"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Distancia, EstiloCarrera, RaceRecord, TipoCarrera } from "@/lib/data/types";
import { formatRitmo, formatTiempo } from "@/lib/format";
import { Card, Button } from "@/components/ui";
import { Field, Input, Select } from "@/components/form";

export type RaceFormValues = Omit<RaceRecord, "id">;

const DISTANCIAS: Distancia[] = ["5K", "7K", "10K", "11K", "12K", "20k", "21K", "26K", "42K"];

function tiempoEditable(seg: number | null): string {
  if (seg == null) return "";
  return formatTiempo(seg);
}
function ritmoEditable(seg: number | null): string {
  if (seg == null) return "";
  return formatRitmo(seg).replace(" /km", "");
}

/** Parsea "h:mm:ss" o "mm:ss" o segundos a número de segundos. */
function parseSeg(str: string): number | null {
  const s = str.trim();
  if (!s) return null;
  if (!s.includes(":")) {
    const n = Number(s);
    return Number.isNaN(n) ? null : n;
  }
  const partes = s.split(":").map((p) => Number(p));
  if (partes.some((p) => Number.isNaN(p))) return null;
  return partes.reduce((acc, p) => acc * 60 + p, 0);
}

function numOrNull(str: string): number | null {
  const s = str.trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

export function RaceForm({
  initial,
  onSubmit,
}: {
  initial?: RaceFormValues;
  onSubmit: (values: RaceFormValues) => void;
}) {
  const router = useRouter();
  const [fecha, setFecha] = useState(initial?.fecha ?? "");
  const [carrera, setCarrera] = useState(initial?.carrera ?? "");
  const [lugar, setLugar] = useState(initial?.lugar ?? "");
  const [distancia, setDistancia] = useState<Distancia>(initial?.distancia ?? "10K");
  const [tipo, setTipo] = useState<TipoCarrera>(initial?.tipo ?? "COMPETENCIA");
  const [estilo, setEstilo] = useState<EstiloCarrera>(initial?.estilo ?? "ASFALTO");
  const [tiempo, setTiempo] = useState(tiempoEditable(initial?.tiempoSeg ?? null));
  const [media, setMedia] = useState(ritmoEditable(initial?.mediaSeg ?? null));
  const [dorsal, setDorsal] = useState(initial?.dorsal != null ? String(initial.dorsal) : "");
  const [posicion, setPosicion] = useState(initial?.posicion != null ? String(initial.posicion) : "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      fecha,
      carrera: carrera.trim(),
      lugar: lugar.trim(),
      distancia,
      tipo,
      estilo,
      tiempoSeg: parseSeg(tiempo),
      mediaSeg: parseSeg(media),
      dorsal: numOrNull(dorsal),
      posicion: numOrNull(posicion),
    });
    router.push("/carreras/registro");
  }

  return (
    <Card className="max-w-2xl">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Fecha">
            <Input type="date" required value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </Field>
          <Field label="Lugar">
            <Input value={lugar} onChange={(e) => setLugar(e.target.value)} placeholder="Ciudad" />
          </Field>
        </div>

        <Field label="Carrera">
          <Input required value={carrera} onChange={(e) => setCarrera(e.target.value)} placeholder="Nombre de la carrera" />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Distancia">
            <Select value={distancia} onChange={(e) => setDistancia(e.target.value as Distancia)}>
              {DISTANCIAS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Tipo">
            <Select value={tipo} onChange={(e) => setTipo(e.target.value as TipoCarrera)}>
              <option value="COMPETENCIA">Competencia</option>
              <option value="ACOMPAÑAMIENTO">Acompañamiento</option>
            </Select>
          </Field>
          <Field label="Estilo">
            <Select value={estilo} onChange={(e) => setEstilo(e.target.value as EstiloCarrera)}>
              <option value="ASFALTO">Asfalto</option>
              <option value="TRAIL">Trail</option>
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Tiempo" hint="Formato h:mm:ss (ej. 1:26:29)">
            <Input value={tiempo} onChange={(e) => setTiempo(e.target.value)} placeholder="h:mm:ss" />
          </Field>
          <Field label="Media /km" hint="Formato m:ss (ej. 4:06)">
            <Input value={media} onChange={(e) => setMedia(e.target.value)} placeholder="m:ss" />
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Dorsal">
            <Input type="number" value={dorsal} onChange={(e) => setDorsal(e.target.value)} placeholder="—" />
          </Field>
          <Field label="Posición">
            <Input type="number" value={posicion} onChange={(e) => setPosicion(e.target.value)} placeholder="—" />
          </Field>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <Button type="submit" variant="primary">Guardar</Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>Cancelar</Button>
        </div>
      </form>
    </Card>
  );
}
