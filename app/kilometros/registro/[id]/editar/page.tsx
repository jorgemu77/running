"use client";

import { use } from "react";
import { useAppStore } from "@/lib/store/AppStore";
import { PageHeader, EmptyState, LinkButton } from "@/components/ui";
import { KmForm } from "@/components/forms/KmForm";
import { mesLargo } from "@/lib/format";

export default function EditarKilometro({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { kilometros, updateKm } = useAppStore();
  const registro = kilometros.find((r) => r.id === id);

  if (!registro) {
    return (
      <>
        <PageHeader title="Modificar registro" />
        <EmptyState>
          <div className="flex flex-col items-center gap-3">
            Registro no encontrado.
            <LinkButton href="/kilometros/registro" variant="secondary">
              Volver al registro
            </LinkButton>
          </div>
        </EmptyState>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Modificar registro"
        subtitle={`${mesLargo(registro.month)} ${registro.year}`}
      />
      <KmForm
        initial={{ year: registro.year, month: registro.month, km: registro.km }}
        onSubmit={(values) => updateKm(id, values)}
      />
    </>
  );
}
