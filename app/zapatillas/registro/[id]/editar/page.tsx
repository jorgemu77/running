"use client";

import { use } from "react";
import { useAppStore } from "@/lib/store/AppStore";
import { PageHeader, EmptyState, LinkButton } from "@/components/ui";
import { ShoeForm } from "@/components/forms/ShoeForm";

export default function EditarZapatilla({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { zapatillas, updateShoe } = useAppStore();
  const z = zapatillas.find((x) => x.id === id);

  if (!z) {
    return (
      <>
        <PageHeader title="Modificar zapatilla" />
        <EmptyState>
          <div className="flex flex-col items-center gap-3">
            Zapatilla no encontrada.
            <LinkButton href="/zapatillas/registro" variant="secondary">
              Volver al registro
            </LinkButton>
          </div>
        </EmptyState>
      </>
    );
  }

  const { id: _omit, ...initial } = z;

  return (
    <>
      <PageHeader title="Modificar zapatilla" subtitle={z.nombre} />
      <ShoeForm initial={initial} onSubmit={(values) => updateShoe(id, values)} />
    </>
  );
}
