import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * Punto de entrada de los enlaces enviados por correo (recuperación de
 * contraseña, magic link, confirmación de email).
 *
 * Admite las dos formas en que Supabase puede llamar a la app:
 *  - Plantilla recomendada:  /auth/confirm?token_hash=...&type=recovery
 *  - Flujo PKCE:             /auth/confirm?code=...
 *
 * Si el enlace llega con el token en el fragmento (#access_token=...), el
 * servidor no puede verlo: ese caso lo resuelve la página /auth/recuperar.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/auth/recuperar";

  const supabase = await createClient();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      // Un magic link o una confirmación llevan directamente a la app.
      const destino = type === "recovery" ? next : "/kilometros";
      return NextResponse.redirect(new URL(destino, origin));
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }

  return NextResponse.redirect(new URL("/login?error=enlace", origin));
}
