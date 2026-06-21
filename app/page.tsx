import { createClient } from "@/lib/supabase/server";

/**
 * Página de inicio. Comprueba la conexión con Supabase desde el servidor.
 */
export default async function Home() {
  const supabase = await createClient();
  const { error } = await supabase.auth.getSession();
  const conectado = !error;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2.5rem" }}>🏃 running</h1>
      <p style={{ opacity: 0.7 }}>Aplicación en desarrollo</p>
      <p
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          borderRadius: "999px",
          background: conectado ? "#0f2e1a" : "#2e0f0f",
          color: conectado ? "#4ade80" : "#f87171",
          fontSize: "0.9rem",
        }}
      >
        {conectado
          ? "✓ Conectado a Supabase"
          : "✗ Sin conexión con Supabase"}
      </p>
    </main>
  );
}
