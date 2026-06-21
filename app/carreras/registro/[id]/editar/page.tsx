"use client";

import { use } from "react";
import { useAppStore } from "@/lib/store/AppStore";
import { PageHeader, EmptyState, LinkButton } from "@/components/ui";
import { RaceForm } from "@/components/forms/RaceForm";

export default function EditarCarrera({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { eventos, updateRace } = useAppStore();
  const r = eventos.find((x) => x.id === id);

  if (!r) {
    return (
      <>
        <PageHeader title="Modificar carrera" />
        <EmptyState>
          <div className="flex flex-col items-center gap-3">
            Carrera no encontrada.
            <LinkButton href="/carreras/registro" variant="secondary">
              Volver al registro
            </LinkButton>
          </div>
        </EmptyState>
      </>
    );
  }

  const { id: _omit, ...initial } = r;

  return (
    <>
      <PageHeader title="Modificar carrera" subtitle={r.carrera} />
      <RaceForm initial={initial} onSubmit={(values) => updateRace(id, values)} />
    </>
  );
}
