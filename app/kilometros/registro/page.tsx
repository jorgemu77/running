"use client";

import { useMemo, useState } from "react";
import { Plus, LayoutDashboard, Download, Pencil, Trash2 } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { aniosDisponibles } from "@/lib/data/stats";
import { formatKm, mesLargo } from "@/lib/format";
import { descargaCsv } from "@/lib/csv";
import { PageHeader, Card, LinkButton, Button, IconButton, EmptyState } from "@/components/ui";
import { FilterBar, FilterField, Select, Input } from "@/components/form";
import { useRouter } from "next/navigation";

export default function KilometrosRegistro() {
  const { kilometros, deleteKm } = useAppStore();
  const router = useRouter();
  const anios = aniosDisponibles(kilometros);

  const [fAnio, setFAnio] = useState("");
  const [fMes, setFMes] = useState("");
  const [fMin, setFMin] = useState("");
  const [fMax, setFMax] = useState("");

  const filtrados = useMemo(() => {
    return kilometros
      .filter((r) => (fAnio ? r.year === Number(fAnio) : true))
      .filter((r) => (fMes ? r.month === Number(fMes) : true))
      .filter((r) => (fMin ? r.km >= Number(fMin) : true))
      .filter((r) => (fMax ? r.km <= Number(fMax) : true))
      .sort((a, b) => b.year - a.year || b.month - a.month);
  }, [kilometros, fAnio, fMes, fMin, fMax]);

  const totalFiltrado = filtrados.reduce((acc, r) => acc + r.km, 0);

  function exportar() {
    descargaCsv("kilometros", filtrados, [
      { header: "Año", value: (r) => r.year },
      { header: "Mes", value: (r) => mesLargo(r.month) },
      { header: "Km", value: (r) => r.km },
    ]);
  }

  function borrar(id: string, etiqueta: string) {
    if (confirm(`¿Borrar el registro de ${etiqueta}?`)) deleteKm(id);
  }

  return (
    <>
      <PageHeader
        title="Registro de kilómetros"
        subtitle={`${filtrados.length} registros · ${formatKm(totalFiltrado)} km`}
        actions={
          <>
            <LinkButton href="/kilometros/registro/nuevo" variant="primary">
              <Plus size={16} /> Añadir registro
            </LinkButton>
            <LinkButton href="/kilometros" variant="secondary">
              <LayoutDashboard size={16} /> Dashboard
            </LinkButton>
            <Button onClick={exportar} variant="secondary">
              <Download size={16} /> Exportar CSV
            </Button>
          </>
        }
      />

      <FilterBar>
        <FilterField label="Año">
          <Select value={fAnio} onChange={(e) => setFAnio(e.target.value)}>
            <option value="">Todos</option>
            {anios.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Mes">
          <Select value={fMes} onChange={(e) => setFMes(e.target.value)}>
            <option value="">Todos</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {mesLargo(i + 1)}
              </option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Km mínimo">
          <Input type="number" inputMode="decimal" value={fMin} onChange={(e) => setFMin(e.target.value)} placeholder="0" />
        </FilterField>
        <FilterField label="Km máximo">
          <Input type="number" inputMode="decimal" value={fMax} onChange={(e) => setFMax(e.target.value)} placeholder="∞" />
        </FilterField>
        <Button
          variant="ghost"
          onClick={() => {
            setFAnio("");
            setFMes("");
            setFMin("");
            setFMax("");
          }}
        >
          Limpiar
        </Button>
      </FilterBar>

      <Card className="mt-4" padded={false}>
        {filtrados.length === 0 ? (
          <div className="p-5">
            <EmptyState>No hay registros que coincidan con los filtros.</EmptyState>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-semibold">Acciones</th>
                  <th className="px-5 py-3 font-semibold">Año</th>
                  <th className="px-5 py-3 font-semibold">Mes</th>
                  <th className="px-5 py-3 text-right font-semibold">Km</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0 hover:bg-page/50">
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <IconButton
                          title="Modificar"
                          onClick={() => router.push(`/kilometros/registro/${r.id}/editar`)}
                        >
                          <Pencil size={15} />
                        </IconButton>
                        <IconButton
                          title="Borrar"
                          className="hover:bg-coral-soft hover:text-rose-700"
                          onClick={() => borrar(r.id, `${mesLargo(r.month)} ${r.year}`)}
                        >
                          <Trash2 size={15} />
                        </IconButton>
                      </div>
                    </td>
                    <td className="px-5 py-2.5 font-medium">{r.year}</td>
                    <td className="px-5 py-2.5">{mesLargo(r.month)}</td>
                    <td className="px-5 py-2.5 text-right font-semibold">{formatKm(r.km, 2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
