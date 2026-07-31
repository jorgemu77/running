# Running TRACKER

Aplicación web personal para registrar y analizar la actividad de running: kilómetros
mensuales, carreras disputadas y desgaste de las zapatillas.

🔗 **Producción:** https://running-jorgemu77.vercel.app

Cada usuario ve y edita únicamente sus propios datos.

---

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 16 (App Router) + React 19 |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS v4 |
| Gráficos | Recharts |
| Iconos | lucide-react |
| Backend | Supabase (PostgreSQL 17, Auth, Storage) |
| Hosting | Vercel (despliegue automático en cada push a `main`) |

---

## Funcionalidades

### 🛣️ Kilómetros
Dashboard con el histórico de kilómetros: total acumulado, año en curso, media mensual
histórica y mejor año, más gráficos de kilómetros por año, por mes (media histórica) y
por mes de un año concreto.

Desde **Registro** se accede al listado en tabla con filtros (año, mes, rango de km),
alta y edición de registros, borrado y exportación a CSV.
Un registro = **un mes** (año + mes + kilómetros).

### 🏅 Carreras
Dashboard con número de carreras, kilómetros totales, mejor ritmo y mejor resultado, más
gráficos de carreras por año (apiladas por tipo), reparto por distancia/estilo y ritmo
medio por carrera. Se divide en cuatro vistas:

- **Todas**
- **Populares** — cualquier distancia que no sea 21K ni 42K
- **Medias** — 21K
- **Maratones** — 42K

Su **Registro** ofrece filtros de selección múltiple (año, distancia, categoría, tipo y
estilo), búsqueda por texto, alta, edición, borrado y exportación a CSV.

### 👟 Zapatillas
Ficha por cada par con su foto, kilómetros acumulados, barra de desgaste y gráfico
mensual, separando las **activas** de las **inactivas**. Se avisa cuando un par supera
los **800 km** recomendados.

Su **Registro** permite dar de alta y editar pares, registrar los **kilómetros de un
mes concreto** (botón 📅+ de cada fila), borrar con confirmación y exportar a CSV.

---

## Puesta en marcha en local

```bash
npm install
```

Crea un archivo `.env` en la raíz con las credenciales de tu proyecto de Supabase
(*Project Settings → API*):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxx
```

Arranca el servidor de desarrollo:

```bash
npm run dev
```

La aplicación queda disponible en http://localhost:3000 (redirige a `/kilometros`).

### Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Compilación de producción |
| `npm run start` | Sirve la compilación de producción |
| `npm run lint` | Análisis estático |
| `npm run test:db` | Comprueba la conexión con Supabase |

---

## Estructura del proyecto

```
app/
  auth/confirm/route.ts        Canjea los enlaces enviados por correo
  auth/recuperar/page.tsx      Pantalla de "nueva contraseña"
  login/page.tsx               Inicio de sesión
  kilometros/                  Dashboard, registro, alta y edición
  carreras/                    Dashboard (+ populares, medias, maratones) y registro
  zapatillas/                  Dashboard, registro, alta y edición
  layout.tsx                   Layout raíz (proveedor de datos + armazón)
  globals.css                  Tema y variables de diseño
  icon.svg                     Favicon

components/
  AppShell.tsx                 Menú lateral (compactable), cabecera móvil y sesión
  CarrerasDashboard.tsx        Dashboard de carreras parametrizado por categoría
  charts.tsx                   Componentes de gráficos (Recharts)
  ui.tsx                       Tarjetas, botones, badges, cabeceras…
  form.tsx                     Campos, filtros y desplegables con checkboxes
  forms/                       Formularios de kilómetros, carreras y zapatillas

lib/
  supabase/client.ts           Cliente de navegador
  supabase/server.ts           Cliente de servidor (cookies)
  supabase/middleware.ts       Refresco de sesión y protección de rutas
  supabase/api.ts              Lecturas y escrituras contra la base de datos
  store/AppStore.tsx           Estado global: carga los datos y expone el CRUD
  data/types.ts                Tipos del dominio
  data/stats.ts                Cálculos y agregaciones
  format.ts                    Formato numérico, tiempos, ritmos y fechas
  csv.ts                       Exportación a CSV

proxy.ts                       Middleware de Next.js (convención de Next 16)
```

> Los archivos `lib/data/kilometros.ts`, `eventos.ts` y `zapatillas.ts` conservan el
> volcado inicial de datos que se migró a Supabase. **No se usan en ejecución**; se
> mantienen como referencia histórica.

---

## Base de datos

Cuatro tablas en el esquema `public`:

| Tabla | Contenido |
|-------|-----------|
| `kilometros` | Un registro por mes: `anio`, `mes`, `km` |
| `carreras` | Evento: fecha, nombre, lugar, distancia, tipo, estilo, tiempo, ritmo, dorsal y posición |
| `zapatillas` | Par: nombre, marca, estado (`ACTIVAS` / `BAJA`) y foto |
| `zapatilla_km` | Kilómetros mensuales de cada par (`zapatilla_id`, `anio`, `mes`, `km`) |

Todas incluyen `user_id uuid not null default auth.uid()` con clave foránea a
`auth.users` y **RLS** activado: cada fila solo es visible y editable por su propietario
(`user_id = auth.uid()`). El filtrado por usuario lo aplica la base de datos, no el
frontend.

Las fotos de las zapatillas se almacenan en **Supabase Storage**, en el bucket público
`Images`; el campo `foto` guarda su URL pública.

📄 La configuración del backend (autenticación, URLs, plantillas de correo y alta de
usuarios) está documentada en [`docs/SUPABASE.md`](docs/SUPABASE.md).

---

## Autenticación

Acceso mediante **email y contraseña** (Supabase Auth). Todas las rutas están protegidas
por el middleware: sin sesión se redirige a `/login`; las únicas rutas públicas son
`/login` y `/auth/*`.

El flujo de **recuperación de contraseña** funciona así:

1. En el login, «¿Has olvidado tu contraseña?» envía el correo de recuperación.
2. El enlace del correo llega a `/auth/confirm`, que canjea el token.
3. El usuario aterriza en `/auth/recuperar` y define su nueva contraseña.

---

## Despliegue

El proyecto está conectado a Vercel: **cada push a `main` despliega automáticamente**.
Las variables `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` deben
estar configuradas en *Settings → Environment Variables* para los entornos de
producción y preview.

---

## Convenciones

- **Números en formato europeo**: miles con `.` y decimales con `,`. Se muestran dos
  decimales salvo que sean `00`, en cuyo caso se omiten. En las tarjetas de resumen los
  kilómetros se redondean a enteros.
- **Tiempos** en `h:mm:ss` y **ritmos** en `m:ss min/Km`.
- Interfaz íntegramente en español.
