# CLAUDE.md

Contexto del proyecto para Claude Code.

## Qué es

App web para gestionar **jornadas de donación de sangre** (Estaca Cuzcatlán).
Registra donantes por barrio y muestra estadísticas en un dashboard. Cada
**jornada** es un evento de donación independiente; la app muestra la jornada
activa por defecto y permite consultar el histórico de jornadas pasadas.

Producción: https://jornada-donacion-sangre.vercel.app

## Stack

- **Next.js 15.4** (App Router) + React 19 + TypeScript
- **Tailwind CSS 4** + shadcn/ui (Radix) + `lucide-react`
- **Recharts** (gráficos), **react-hook-form** + **zod** (formularios)
- **Prisma 6** + **PostgreSQL** (Neon)

## Despliegue

- **Vercel**, deploy automático al hacer `push` al repo (rama `master`).
- El `build` (`prisma generate && next build --no-lint`) **NO corre migraciones**.
  Los cambios de esquema en la BD son un **paso manual** (`prisma db push`) que
  se coordina aparte del deploy. Ver runbook en `ENVIRONMENT.md`.
- `vercel.json`: funciones API con `maxDuration: 30s`.

## Variables de entorno

Requeridas (ver `ENVIRONMENT.md`): `DATABASE_URL`, `NEXT_PUBLIC_ADMIN_PASSWORD`
(crear donantes/gestionar jornadas), `NEXT_PUBLIC_DELETE_PASSWORD` (eliminar
donantes). Las contraseñas son `NEXT_PUBLIC_*` → validación solo en cliente.

> ⚠️ El `DATABASE_URL` de `.env` apunta a la base de datos de **producción** (Neon).
> Cualquier `prisma db push` / script afecta datos en vivo. Respalda antes
> (`npx tsx scripts/backup-data.ts`, guarda en `backups/` que está gitignored).

## Modelo de datos (`prisma/schema.prisma`)

- **`Jornada`**: `nombre`, `fecha`, `descripcion?`, `activa` (bool). Una sola
  jornada activa a la vez; es la que se muestra por defecto.
- **`Donante`**: pertenece a una `Jornada` (`jornadaId`) y a un `Barrio`. La
  cédula es única **por jornada** (`@@unique([cedula, jornadaId])`) — la misma
  persona puede donar en varias jornadas.
- **`Barrio`**: global, compartido entre jornadas (es geográfico).

## Estructura (`app/`)

- `page.tsx` — Dashboard. Lee `?jornada=<id>` (default: activa). Banner cuando
  se ve una jornada pasada. Componente envuelto en `<Suspense>` por `useSearchParams`.
- `historico/` — Lista todas las jornadas con sus totales.
- `jornadas/` — Gestión (crear jornada / marcar activa), protegida con contraseña admin.
- `registro/` — Listado de donantes (jornada activa); `registro/nuevo/` para alta.
- `beneficios/` — Página estática.
- `admin/` — Redirige a `/`.
- `api/` — `barrios`, `donantes` (+`[id]`), `estadisticas`, `jornadas` (+`[id]`).

## Convenciones

- **Scoping por jornada**: las APIs `donantes` y `estadisticas` aceptan
  `?jornadaId=` y, si falta, usan la jornada activa vía `resolverJornadaId()` /
  `getJornadaActiva()` en `lib/jornadas.ts`. Reusar esos helpers, no reimplementar.
- Cliente Prisma generado en `lib/generated/prisma` (gitignored); singleton en `lib/db.ts`.
- UI y textos en **español**.
- Marcar una jornada como activa desmarca las demás (transacción en la API).

## Scripts

- `npm run dev` — dev server (turbopack)
- `npm run build` — build de producción
- `npm run db:push` / `db:generate` / `db:seed` / `db:studio`
- `npx tsx scripts/backup-data.ts` — respaldo lógico a `backups/`
- `npx tsx scripts/migrate-jornadas.ts` — backfill de la migración a jornadas (uso único)
