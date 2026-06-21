"use client";

import { useAppStore } from "@/lib/store/AppStore";
import { PageHeader } from "@/components/ui";
import { RaceForm } from "@/components/forms/RaceForm";

export default function NuevaCarrera() {
  const { addRace } = useAppStore();
  return (
    <>
      <PageHeader title="Añadir registro" subtitle="Nueva carrera" />
      <RaceForm onSubmit={addRace} />
    </>
  );
}
