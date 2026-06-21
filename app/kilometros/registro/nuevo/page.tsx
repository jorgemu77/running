"use client";

import { useAppStore } from "@/lib/store/AppStore";
import { PageHeader } from "@/components/ui";
import { KmForm } from "@/components/forms/KmForm";

export default function NuevoKilometro() {
  const { addKm } = useAppStore();
  return (
    <>
      <PageHeader title="Añadir registro" subtitle="Nuevo registro mensual de kilómetros" />
      <KmForm onSubmit={addKm} />
    </>
  );
}
