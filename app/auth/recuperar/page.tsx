"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Activity, Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, Button } from "@/components/ui";
import { Field, Input } from "@/components/form";

/**
 * Página de "nueva contraseña". Se llega aquí desde el correo de recuperación.
 * Acepta la sesión ya establecida por /auth/confirm y, además, resuelve por su
 * cuenta los enlaces que traen el token en el fragmento (#access_token=...) o
 * como ?code=..., que el servidor no puede leer.
 */
export default function RecuperarPage() {
  const supabase = useMemo(() => createClient(), []);

  const [comprobando, setComprobando] = useState(true);
  const [conSesion, setConSesion] = useState(false);
  const [password, setPassword] = useState("");
  const [repetir, setRepetir] = useState("");
  const [ver, setVer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    let activo = true;

    async function iniciar() {
      const hash = window.location.hash;

      // Enlace con token en el fragmento (flujo implícito).
      if (hash.includes("access_token")) {
        const p = new URLSearchParams(hash.slice(1));
        const access_token = p.get("access_token");
        const refresh_token = p.get("refresh_token");
        if (access_token && refresh_token) {
          await supabase.auth.setSession({ access_token, refresh_token });
        }
        window.history.replaceState({}, "", window.location.pathname);
      } else {
        // Enlace con código (flujo PKCE).
        const code = new URLSearchParams(window.location.search).get("code");
        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
          window.history.replaceState({}, "", window.location.pathname);
        }
      }

      const { data } = await supabase.auth.getUser();
      if (!activo) return;
      setConSesion(!!data.user);
      setComprobando(false);
    }

    iniciar();
    return () => {
      activo = false;
    };
  }, [supabase]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== repetir) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setGuardando(true);
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError("No se pudo cambiar la contraseña: " + error.message);
      setGuardando(false);
      return;
    }
    setListo(true);
    setGuardando(false);
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-brand-ink">
            <Activity size={26} strokeWidth={2.5} />
          </span>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Running <span className="font-extrabold">TRACKER</span>
            </h1>
            <p className="mt-0.5 text-sm text-muted">Nueva contraseña</p>
          </div>
        </div>

        <Card>
          {comprobando ? (
            <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted">
              <Loader2 className="animate-spin" size={18} /> Comprobando el enlace…
            </div>
          ) : listo ? (
            <div className="flex flex-col gap-4 text-center">
              <p className="text-sm">Contraseña actualizada correctamente.</p>
              <Button onClick={() => window.location.assign("/kilometros")}>
                Ir a la aplicación
              </Button>
            </div>
          ) : !conSesion ? (
            <div className="flex flex-col gap-4 text-center">
              <p className="text-sm text-muted">
                El enlace no es válido o ha caducado. Solicita uno nuevo desde la pantalla de
                inicio de sesión.
              </p>
              <Link href="/login">
                <Button className="w-full">Volver al inicio de sesión</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <Field label="Nueva contraseña">
                <div className="relative">
                  <Input
                    type={ver ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setVer((v) => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
                    aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {ver ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </Field>

              <Field label="Repite la contraseña">
                <Input
                  type={ver ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={repetir}
                  onChange={(e) => setRepetir(e.target.value)}
                  placeholder="••••••••"
                />
              </Field>

              {error && (
                <p className="rounded-xl bg-coral-soft px-3 py-2 text-sm text-rose-700">{error}</p>
              )}

              <Button type="submit" disabled={guardando} className="mt-1 w-full">
                {guardando ? "Guardando…" : "Guardar contraseña"}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
