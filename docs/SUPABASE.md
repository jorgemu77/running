# Configuración de Supabase

Documento de referencia del backend de **Running TRACKER**: autenticación, base de
datos, almacenamiento y tareas de mantenimiento habituales.

> Ninguna credencial se guarda en el repositorio. Las claves se toman del panel de
> Supabase (*Project Settings → API*) y se configuran como variables de entorno.

---

## 1. Variables de entorno

| Variable | Dónde se obtiene |
|----------|------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → *Project URL* |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Project Settings → API → *Publishable key* |

Ambas son públicas por diseño (llevan el prefijo `NEXT_PUBLIC_`): la seguridad la
garantizan las políticas RLS, no el secreto de la clave.

Deben estar definidas en el `.env` local y en Vercel (*Settings → Environment
Variables*) para **Production** y **Preview**.

---

## 2. Autenticación

### Proveedor

Se usa **Email + contraseña**. No hay registro público: los usuarios se crean
manualmente desde el panel.

### Configuración de URLs

*Authentication → URL Configuration*

| Campo | Valor |
|-------|-------|
| **Site URL** | `https://running-jorgemu77.vercel.app` |
| **Redirect URLs** | `https://running-jorgemu77.vercel.app/**` y `http://localhost:3000/**` |

⚠️ Si el *Site URL* apunta a `localhost` (valor por defecto), **los enlaces de los
correos no funcionarán** en producción: llevarán al equipo local del usuario.

### Plantillas de correo

*Authentication → Emails → Reset Password*

```html
<h2>Cambiar contraseña</h2>
<p>Pulsa el enlace para elegir una contraseña nueva:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery">Cambiar mi contraseña</a></p>
```

Para *Magic Link* se usa la misma estructura terminando en `&type=magiclink`.

Enviar el token a `/auth/confirm` es el método recomendado para aplicaciones con
renderizado en servidor y es lo que permite que también funcionen los botones **Send
password recovery** y **Send magic link** del propio panel de Supabase.

> El servidor de correo gratuito de Supabase limita los envíos (unos 3-4 por hora) y
> los mensajes pueden acabar en la carpeta de spam.

### Flujo de recuperación en la aplicación

1. `/login` → «¿Has olvidado tu contraseña?» llama a `resetPasswordForEmail()` con
   `redirectTo` apuntando a `/auth/recuperar`.
2. El enlace del correo llega a `/auth/confirm`, que canjea el token
   (`verifyOtp` o `exchangeCodeForSession`) y crea la sesión.
3. `/auth/recuperar` muestra el formulario de nueva contraseña y llama a `updateUser()`.

La página `/auth/recuperar` también resuelve por su cuenta los enlaces que traen el
token en el fragmento (`#access_token=…`), que el servidor no puede leer.

Estas rutas son públicas en el middleware ([`lib/supabase/middleware.ts`](../lib/supabase/middleware.ts));
si no lo fueran, el token se perdería en la redirección a `/login`.

### Alta de nuevos usuarios

Usa siempre el panel: *Authentication → Users → **Add user***.

⚠️ **No crees usuarios con SQL directo sobre `auth.users`.** Si lo haces, las columnas
de token (`confirmation_token`, `recovery_token`, `email_change`,
`email_change_token_new`, `email_change_token_current`, `phone_change`,
`phone_change_token`, `reauthentication_token`) quedan a `NULL` y el servicio de
autenticación devuelve **error 500 al iniciar sesión**. Deben contener cadenas vacías:

```sql
update auth.users set
  confirmation_token         = coalesce(confirmation_token, ''),
  recovery_token             = coalesce(recovery_token, ''),
  email_change               = coalesce(email_change, ''),
  email_change_token_new     = coalesce(email_change_token_new, ''),
  email_change_token_current = coalesce(email_change_token_current, ''),
  phone_change               = coalesce(phone_change, ''),
  phone_change_token         = coalesce(phone_change_token, ''),
  reauthentication_token     = coalesce(reauthentication_token, '');
```

Un usuario nuevo empieza con su espacio vacío: las políticas RLS solo le muestran sus
propios datos.

---

## 3. Base de datos

### Migraciones aplicadas

| Migración | Contenido |
|-----------|-----------|
| `esquema_inicial_running` | Tablas, tipos enumerados, índices y RLS inicial |
| `bloquear_rls_usuario_unico` | Restricción temporal a un único propietario |
| `multiusuario_datos_por_usuario` | Columna `user_id`, unicidad por usuario y RLS definitivo |

### Tablas

```
kilometros    (id, user_id, anio, mes, km, created_at)
carreras      (id, user_id, fecha, carrera, lugar, distancia, tipo, estilo,
               tiempo_seg, media_seg, dorsal, posicion, created_at)
zapatillas    (id, user_id, nombre, marca, estado, foto, created_at)
zapatilla_km  (id, user_id, zapatilla_id → zapatillas, anio, mes, km)
```

Tipos enumerados: `tipo_carrera` (`COMPETENCIA`, `ACOMPAÑAMIENTO`), `estilo_carrera`
(`ASFALTO`, `TRAIL`) y `estado_zapatilla` (`ACTIVAS`, `BAJA`).

Restricciones de unicidad por usuario: `(user_id, anio, mes)` en `kilometros`,
`(user_id, nombre)` en `zapatillas` y `(zapatilla_id, anio, mes)` en `zapatilla_km`.
Al borrar una zapatilla se eliminan en cascada sus kilómetros mensuales.

### Seguridad a nivel de fila (RLS)

Las cuatro tablas tienen RLS activado con una política por tabla:

```sql
create policy "own_<tabla>" on public.<tabla>
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
```

Como `user_id` tiene `default auth.uid()`, las inserciones desde la aplicación asignan
el propietario automáticamente; el frontend nunca envía ese campo.

---

## 4. Almacenamiento

Las fotos de las zapatillas viven en el bucket **`Images`** (nombre con mayúscula
inicial), configurado como **público**.

Para añadir una zapatilla nueva:

1. *Storage → Images → Upload file*.
2. Copiar la URL pública del archivo.
3. Pegarla en el campo **Foto** del formulario de la aplicación.

El formato de la URL es:

```
https://<proyecto>.supabase.co/storage/v1/object/public/Images/<archivo>.png
```

---

## 5. Comprobaciones útiles

Verificar la conexión desde el proyecto:

```bash
npm run test:db
```

Revisar avisos de seguridad y rendimiento: *Advisors* en el panel de Supabase. Conviene
ejecutarlo tras cualquier cambio de esquema o de políticas.

Como refuerzo opcional puede activarse la protección contra contraseñas filtradas en
*Authentication → Policies → Password security*.
