"use client";

import { useAppStore } from "@/lib/store/AppStore";
import { PageHeader } from "@/components/ui";
import { ShoeForm } from "@/components/forms/ShoeForm";

export default function NuevaZapatilla() {
  const { addShoe } = useAppStore();
  return (
    <>
      <PageHeader title="Añadir registro" subtitle="Nueva zapatilla" />
      <ShoeForm onSubmit={addShoe} />
    </>
  );
}
