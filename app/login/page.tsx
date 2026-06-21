"use client";

import { useState } from "react";
import { Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Card, Button } from "@/components/ui";
import { Field, Input } from "@/components/form";

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
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
              <Input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </Field>

            {error && (
              <p className="rounded-xl bg-coral-soft px-3 py-2 text-sm text-rose-700">{error}</p>
            )}

            <Button type="submit" disabled={cargando} className="mt-1 w-full">
              {cargando ? "Entrando…" : "Entrar"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
