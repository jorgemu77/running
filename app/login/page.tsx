"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, Button } from "@/components/ui";
import { Field, Input } from "@/components/form";

export default function LoginPage() {
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [enviandoReset, setEnviandoReset] = useState(false);

  useEffect(() => {
    // Si un enlace de recuperación acaba aquí con el token en el fragmento
    // (plantilla por defecto de Supabase), lo reenviamos a la página que sabe
    // canjearlo, conservando el fragmento.
    const hash = window.location.hash;
    if (hash.includes("access_token") || hash.includes("type=recovery")) {
      window.location.replace("/auth/recuperar" + hash);
      return;
    }
    // Mensaje cuando un enlace de correo llega caducado o mal formado.
    if (new URLSearchParams(window.location.search).get("error") === "enlace") {
      setError("El enlace no es válido o ha caducado. Solicita uno nuevo.");
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setAviso(null);
    setCargando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Email o contraseña incorrectos.");
      setCargando(false);
      return;
    }
    // Recarga completa para que la cookie de sesión viaje en una petición
    // nueva y el middleware reconozca al usuario.
    window.location.assign("/kilometros");
  }

  async function recuperar() {
    setError(null);
    setAviso(null);

    if (!email.trim()) {
      setError("Escribe tu email para enviarte el enlace de recuperación.");
      return;
    }

    setEnviandoReset(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/recuperar`,
    });
    setEnviandoReset(false);

    if (error) {
      setError("No se pudo enviar el correo: " + error.message);
      return;
    }
    setAviso("Te hemos enviado un correo con el enlace para cambiar la contraseña.");
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
            <p className="mt-0.5 text-sm text-muted">Inicia sesión para continuar</p>
          </div>
        </div>

        <Card>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Field label="Email">
              <Input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
              />
            </Field>
            <Field label="Contraseña">
              <div className="relative">
                <Input
                  type={verPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setVerPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-ink"
                  aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  title={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {verPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Field>

            {error && (
              <p className="rounded-xl bg-coral-soft px-3 py-2 text-sm text-rose-700">{error}</p>
            )}
            {aviso && (
              <p className="rounded-xl bg-mint-soft px-3 py-2 text-sm text-lime-800">{aviso}</p>
            )}

            <Button type="submit" disabled={cargando} className="mt-1 w-full">
              {cargando ? "Entrando…" : "Entrar"}
            </Button>

            <button
              type="button"
              onClick={recuperar}
              disabled={enviandoReset}
              className="mx-auto text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline disabled:opacity-50"
            >
              {enviandoReset ? "Enviando…" : "¿Has olvidado tu contraseña?"}
            </button>
          </form>
        </Card>
      </div>
    </main>
  );
}
