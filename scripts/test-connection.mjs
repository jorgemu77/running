// Prueba de conexión con Supabase usando las variables de entorno (.env).
// Ejecutar con: npm run test:db
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("✗ Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env");
  process.exit(1);
}

console.log("→ URL:", url);
console.log("→ Key:", key.slice(0, 20) + "...");

const supabase = createClient(url, key);

// 1) Sondeo de la API REST de PostgREST consultando una tabla inexistente.
//    Si la conexión y la autenticación funcionan, PostgREST responde indicando
//    que la tabla no existe (42P01 a nivel de Postgres, PGRST205 a nivel de
//    PostgREST) en lugar de un error de red o de autenticación.
const { error } = await supabase.from("__connection_test__").select("*").limit(1);

const tablaNoExiste = error?.code === "42P01" || error?.code === "PGRST205";
const apiKeyInvalida =
  error?.message?.toLowerCase().includes("invalid api key") || error?.code === "401";

let codigoSalida = 0;

if (!error) {
  console.log("✓ Conexión OK (la tabla de prueba existe inesperadamente)");
} else if (tablaNoExiste) {
  console.log("✓ Conexión y autenticación con Supabase CORRECTAS");
  console.log("  (respuesta esperada: la tabla de prueba no existe todavía)");
} else if (apiKeyInvalida) {
  console.error("✗ La API key es inválida:", error.message);
  codigoSalida = 1;
} else {
  console.error("✗ Error de conexión:", JSON.stringify(error, null, 2));
  codigoSalida = 1;
}

// Salida limpia para evitar el assertion de libuv en Windows (Node 26).
process.exitCode = codigoSalida;
