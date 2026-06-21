"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, LayoutDashboard, Download, Pencil, Trash2, Search } from "lucide-react";
import { useAppStore } from "@/lib/store/AppStore";
import { categoriaDeDistancia } from "@/lib/data/types";
import { formatTiempo, formatRitmo, formatRitmoCorto, formatFecha } from "@/lib/format";
import { descargaCsv } from "@/lib/csv";
import { PageHeader, Card, LinkButton, Button, IconButton, EmptyState, Badge } from "@/components/ui";
import { FilterBar, FilterField, Select, Input } from "@/components/form";

export default function CarrerasRegistro() {
  const { eventos, deleteRace } = useAppStore();
  const router = useRouter();

  const [texto, setTexto] = useState("");
  const [fAnio, setFAnio] = useState("");
  const [fDist, setFDist] = useState("");
  const [fCat, setFCat] = useState("");
  const [fTipo, setFTipo] = useState("");
  const [fEstilo, setFEstilo] = useState("");

  const anios = useMemo(
    () => [...new Set(eventos.map((r) => Number(r.fecha.slice(0, 4))))].sort((a, b) => b - a),
    [eventos],
  );
  const distancias = useMemo(
    () => [...new Set(eventos.map((r) => r.distancia))],
    [eventos],
  );

  const filtrados = useMemo(() => {
    const q = texto.trim().toLowerCase();
    return eventos
      .filter((r) => (q ? (r.carrera + " " + r.lugar).toLowerCase().includes(q) : true))
      .filter((r) => (fAnio ? r.fecha.startsWith(fAnio) : true))
      .filter((r) => (fDist ? r.distancia === fDist : true))
      .filter((r) => (fCat ? categoriaDeDistancia(r.distancia) === fCat : true))
      .filter((r) => (fTipo ? r.tipo === fTipo : true))
      .filter((r) => (fEstilo ? r.estilo === fEstilo : true))
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
  }, [eventos, texto, fAnio, fDist, fCat, fTipo, fEstilo]);

  function exportar() {
    descargaCsv("carreras", filtrados, [
      { header: "Fecha", value: (r) => r.fecha },
      { header: "Carrera", value: (r) => r.carrera },
      { header: "Lugar", value: (r) => r.lugar },
      { header: "Distancia", value: (r) => r.distancia },
      { header: "Tipo", value: (r) => r.tipo },
      { header: "Estilo", value: (r) => r.estilo },
      { header: "Tiempo", value: (r) => formatTiempo(r.tiempoSeg) },
      { header: "Media/km", value: (r) => (r.mediaSeg != null ? formatRitmoCorto(r.mediaSeg) : "") },
      { header: "Dorsal", value: (r) => r.dorsal ?? "" },
      { header: "Posición", value: (r) => r.posicion ?? "" },
    ]);
  }

  function borrar(id: string, nombre: string) {
    if (confirm(`¿Borrar "${nombre}"?`)) deleteRace(id);
  }

  function limpiar() {
    setTexto("");
    setFAnio("");
    setFDist("");
    setFCat("");
    setFTipo("");
    setFEstilo("");
  }

  return (
    <>
      <PageHeader
        title="Registro de carreras"
        subtitle={`${filtrados.length} carreras`}
        actions={
          <>
            <LinkButton href="/carreras/registro/nuevo" variant="primary">
              <Plus size={16} /> Añadir registro
            </LinkButton>
            <LinkButton href="/carreras" variant="secondary">
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
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <Input
              className="pl-9"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Carrera o lugar"
            />
          </div>
        </FilterField>
        <FilterField label="Año">
          <Select value={fAnio} onChange={(e) => setFAnio(e.target.value)}>
            <option value="">Todos</option>
            {anios.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Distancia">
          <Select value={fDist} onChange={(e) => setFDist(e.target.value)}>
            <option value="">Todas</option>
            {distancias.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </Select>
        </FilterField>
        <FilterField label="Categoría">
          <Select value={fCat} onChange={(e) => setFCat(e.target.value)}>
            <option value="">Todas</option>
            <option value="POPULAR">Populares</option>
            <option value="MEDIA">Medias</option>
            <option value="MARATON">Maratones</option>
          </Select>
        </FilterField>
        <FilterField label="Tipo">
          <Select value={fTipo} onChange={(e) => setFTipo(e.target.value)}>
            <option value="">Todos</option>
            <option value="COMPETENCIA">Competencia</option>
            <option value="ACOMPAÑAMIENTO">Acompañamiento</option>
          </Select>
        </FilterField>
        <FilterField label="Estilo">
          <Select value={fEstilo} onChange={(e) => setFEstilo(e.target.value)}>
            <option value="">Todos</option>
            <option value="ASFALTO">Asfalto</option>
            <option value="TRAIL">Trail</option>
          </Select>
        </FilterField>
        <Button variant="ghost" onClick={limpiar}>Limpiar</Button>
      </FilterBar>

      <Card className="mt-4" padded={false}>
        {filtrados.length === 0 ? (
          <div className="p-5">
            <EmptyState>No hay carreras que coincidan con los filtros.</EmptyState>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-semibold">Acciones</th>
                  <th className="px-4 py-3 font-semibold">Fecha</th>
                  <th className="px-4 py-3 font-semibold">Carrera</th>
                  <th className="px-4 py-3 font-semibold">Lugar</th>
                  <th className="px-4 py-3 font-semibold">Dist.</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
                  <th className="px-4 py-3 font-semibold">Estilo</th>
                  <th className="px-4 py-3 text-right font-semibold">Tiempo</th>
                  <th className="px-4 py-3 text-right font-semibold">Ritmo</th>
                  <th className="px-4 py-3 text-right font-semibold">Pos.</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((r) => (
                  <tr key={r.id} className="border-b border-line last:border-0 hover:bg-page/50">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <IconButton title="Modificar" onClick={() => router.push(`/carreras/registro/${r.id}/editar`)}>
                          <Pencil size={15} />
                        </IconButton>
                        <IconButton title="Borrar" className="hover:bg-coral-soft hover:text-rose-700" onClick={() => borrar(r.id, r.carrera)}>
                          <Trash2 size={15} />
                        </IconButton>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap text-muted">{formatFecha(r.fecha)}</td>
                    <td className="px-4 py-2.5 font-medium">{r.carrera}</td>
                    <td className="px-4 py-2.5 text-muted">{r.lugar}</td>
                    <td className="px-4 py-2.5">
                      <Badge color={categoriaDeDistancia(r.distancia) === "MARATON" ? "coral" : categoriaDeDistancia(r.distancia) === "MEDIA" ? "sun" : "sky"}>
                        {r.distancia}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-muted">{r.tipo === "COMPETENCIA" ? "Competencia" : "Acompañam."}</td>
                    <td className="px-4 py-2.5 text-muted">{r.estilo === "ASFALTO" ? "Asfalto" : "Trail"}</td>
                    <td className="px-4 py-2.5 text-right font-semibold whitespace-nowrap">{formatTiempo(r.tiempoSeg)}</td>
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">{formatRitmo(r.mediaSeg)}</td>
                    <td className="px-4 py-2.5 text-right text-muted">{r.posicion ?? "—"}</td>
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
