"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  CalendarPlus,
  LayoutDashboard,
  Download,
  Pencil,
  Trash2,
  Footprints,
  TriangleAlert,
} from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { totalKmZapatilla } from "@/lib/data/stats";
import { LIMITE_KM_ZAPATILLA, type ShoeRecord } from "@/lib/data/types";
import { formatKm, mesLargo } from "@/lib/format";
import { descargaCsv } from "@/lib/csv";
import { PageHeader, Card, LinkButton, Button, IconButton, EmptyState, Badge } from "@/components/ui";
import { FilterBar, FilterField, Field, Select, Input } from "@/components/form";

function kmDeMes(shoe: ShoeRecord, year: number, month: number): number {
  return shoe.meses.find((m) => m.year === year && m.month === month)?.km ?? 0;
}

export default function ZapatillasRegistro() {
  const { zapatillas, deleteShoe, setShoeMonth } = useAppStore();
  const router = useRouter();

  const [texto, setTexto] = useState("");
  const [fMarca, setFMarca] = useState("");
  const [fEstado, setFEstado] = useState("");

  // Modal de km mensuales
  const ahora = new Date();
  const [kmShoe, setKmShoe] = useState<ShoeRecord | null>(null);
  const [kmYear, setKmYear] = useState(ahora.getFullYear());
  const [kmMonth, setKmMonth] = useState(ahora.getMonth() + 1);
  const [kmValor, setKmValor] = useState("0");
  const [guardando, setGuardando] = useState(false);
  const [borrarTarget, setBorrarTarget] = useState<{ id: string; nombre: string } | null>(null);

  // Al cambiar zapatilla/año/mes, mostrar el valor existente para ese mes.
  useEffect(() => {
    if (kmShoe) setKmValor(String(kmDeMes(kmShoe, kmYear, kmMonth)));
  }, [kmShoe, kmYear, kmMonth]);

  const anios = useMemo(() => {
    const max = ahora.getFullYear();
    return Array.from({ length: max - 2015 + 1 }, (_, i) => max - i);
  }, [ahora]);

  const marcas = useMemo(() => [...new Set(zapatillas.map((z) => z.marca))], [zapatillas]);

  const filtrados = useMemo(() => {
    const q = texto.trim().toLowerCase();
    return zapatillas
      .filter((z) => (q ? z.nombre.toLowerCase().includes(q) : true))
      .filter((z) => (fMarca ? z.marca === fMarca : true))
      .filter((z) => (fEstado ? z.estado === fEstado : true))
      .map((z) => ({ ...z, total: totalKmZapatilla(z) }))
      .sort((a, b) => b.total - a.total);
  }, [zapatillas, texto, fMarca, fEstado]);

  function abrirKm(shoe: ShoeRecord) {
    setKmShoe(shoe);
    setKmYear(ahora.getFullYear());
    setKmMonth(ahora.getMonth() + 1);
  }

  async function guardarKm() {
    if (!kmShoe) return;
    setGuardando(true);
    try {
      await setShoeMonth(kmShoe.id, kmYear, kmMonth, Number(kmValor) || 0);
      setKmShoe(null);
    } catch (err) {
      alert("No se pudo guardar: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setGuardando(false);
    }
  }

  function exportar() {
    descargaCsv("zapatillas", filtrados, [
      { header: "Zapatilla", value: (z) => z.nombre },
      { header: "Marca", value: (z) => z.marca },
      { header: "Estado", value: (z) => (z.estado === "ACTIVAS" ? "Activas" : "Baja") },
      { header: "Km totales", value: (z) => Math.round(z.total) },
    ]);
  }

  async function confirmarBorrado() {
    if (!borrarTarget) return;
    const { id } = borrarTarget;
    setBorrarTarget(null);
    await deleteShoe(id);
  }

  return (
    <>
      <PageHeader
        title="Registro de zapatillas"
        subtitle={`${filtrados.length} pares`}
        actions={
          <>
            <LinkButton href="/zapatillas/registro/nuevo" variant="primary">
              <Plus size={16} /> Añadir registro
            </LinkButton>
            <LinkButton href="/zapatillas" variant="secondary">
              <LayoutDashboard size={16} /> Dashboard
            </LinkButton>
            <Button onClick={exportar} variant="secondary">
              <Download size={16} /> Exportar CSV
            </Button>
          </>
        }
      />

      <FilterBar>
        <FilterField label="Buscar">
          <Input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Modelo" />
        </FilterField>
        <FilterField label="Marca">
          <Select value={fMarca} onChange={(e) => setFMarca(e.target.value)}>
            <option value="">Todas</option>
            {marcas.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Estado">
          <Select value={fEstado} onChange={(e) => setFEstado(e.target.value)}>
            <option value="">Todos</option>
            <option value="ACTIVAS">Activas</option>
            <option value="BAJA">Baja</option>
          </Select>
        </FilterField>
        <Button
          variant="ghost"
          onClick={() => {
            setTexto("");
            setFMarca("");
            setFEstado("");
          }}
        >
          Limpiar
        </Button>
      </FilterBar>

      <Card className="mt-4" padded={false}>
        {filtrados.length === 0 ? (
          <div className="p-5">
            <EmptyState>No hay zapatillas que coincidan con los filtros.</EmptyState>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-5 py-3 font-semibold">Zapatilla</th>
                  <th className="px-5 py-3 font-semibold">Marca</th>
                  <th className="px-5 py-3 font-semibold">Estado</th>
                  <th className="px-5 py-3 text-right font-semibold">Km totales</th>
                  <th className="px-5 py-3 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((z) => {
                  const supera = z.total > LIMITE_KM_ZAPATILLA;
                  return (
                    <tr key={z.id} className="border-b border-line last:border-0 hover:bg-page/50">
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-page">
                            {z.foto ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={z.foto} alt={z.nombre} className="h-full w-full object-contain" />
                            ) : (
                              <Footprints size={16} className="text-muted" />
                            )}
                          </span>
                          <span className="font-medium">{z.nombre}</span>
                        </div>
                      </td>
                      <td className="px-5 py-2.5 text-muted">{z.marca}</td>
                      <td className="px-5 py-2.5">
                        <Badge color={z.estado === "ACTIVAS" ? "mint" : "neutral"}>
                          {z.estado === "ACTIVAS" ? "Activas" : "Baja"}
                        </Badge>
                      </td>
                      <td className="px-5 py-2.5 text-right">
                        <span className="inline-flex items-center justify-end gap-1.5 font-semibold">
                          {supera && <TriangleAlert size={14} className="text-rose-500" />}
                          {formatKm(z.total)} km
                        </span>
                      </td>
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <IconButton
                            title="Registrar km del mes"
                            className="hover:bg-brand/30 hover:text-brand-ink"
                            onClick={() => abrirKm(z)}
                          >
                            <CalendarPlus size={15} />
                          </IconButton>
                          <IconButton title="Modificar" onClick={() => router.push(`/zapatillas/registro/${z.id}/editar`)}>
                            <Pencil size={15} />
                          </IconButton>
                          <IconButton
                            title="Borrar"
                            className="text-rose-600 hover:bg-coral-soft hover:text-rose-700"
                            onClick={() => setBorrarTarget({ id: z.id, nombre: z.nombre })}
                          >
                            <Trash2 size={15} />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal: km de un mes/año concreto */}
      {kmShoe && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setKmShoe(null)} />
          <div className="relative w-full max-w-md rounded-3xl border border-line bg-card p-6 shadow-xl">
            <h2 className="text-lg font-bold tracking-tight">Km del mes</h2>
            <div className="mx-auto mt-3 grid aspect-square w-full max-w-[180px] place-items-center overflow-hidden rounded-2xl bg-page">
              {kmShoe.foto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={kmShoe.foto} alt={kmShoe.nombre} className="h-full w-full object-contain" />
              ) : (
                <Footprints className="text-muted" />
              )}
            </div>
            <p className="mt-2 text-center text-sm text-muted">{kmShoe.nombre}</p>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <Field label="Año">
                <Select value={kmYear} onChange={(e) => setKmYear(Number(e.target.value))}>
                  {anios.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Mes">
                <Select value={kmMonth} onChange={(e) => setKmMonth(Number(e.target.value))}>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{mesLargo(i + 1)}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="mt-4">
              <Field label="Kilómetros mes">
                <Input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min={0}
                  value={kmValor}
                  onChange={(e) => setKmValor(e.target.value)}
                />
              </Field>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setKmShoe(null)}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={guardarKm} disabled={guardando}>
                {guardando ? "Guardando…" : "Guardar"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: confirmar borrado de zapatilla */}
      {borrarTarget && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setBorrarTarget(null)} />
          <div className="relative w-full max-w-sm rounded-3xl border border-line bg-card p-6 shadow-xl">
            <h2 className="text-lg font-bold tracking-tight">¿Borrar la zapatilla?</h2>
            <p className="mt-1 text-sm text-muted">
              Se borrará «{borrarTarget.nombre}» y todos sus registros de kilómetros. Esta acción no se
              puede deshacer.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setBorrarTarget(null)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmarBorrado}>
                Borrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
