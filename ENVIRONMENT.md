# Variables de Entorno

Este archivo documenta las variables de entorno necesarias para el proyecto de donación de sangre.

## Variables Requeridas

### `DATABASE_URL`
URL de conexión a la base de datos PostgreSQL.

**Formato:**
```
postgresql://username:password@host:port/database_name
```

**Ejemplo:**
```
postgresql://myuser:mypassword@localhost:5432/donacion_sangre
```

### `NEXTAUTH_SECRET` (Opcional)
Clave secreta para NextAuth.js si planeas usar autenticación.

**Ejemplo:**
```
your-super-secret-key-here
```

### `NEXTAUTH_URL` (Opcional)
URL base de tu aplicación para NextAuth.js.

**Desarrollo:**
```
http://localhost:3000
```

**Producción:**
```
https://tu-dominio.vercel.app
```

### `NEXT_PUBLIC_ADMIN_PASSWORD` (Requerido)
Contraseña para acceder al formulario de registro de nuevos donantes.

**Ejemplo:**
```
tu-contraseña-segura
```

### `NEXT_PUBLIC_DELETE_PASSWORD` (Requerido)
Contraseña para eliminar donantes del sistema.

**Ejemplo:**
```
tu-contraseña-segura
```

## Configuración Local

1. Copia el archivo `env.example` a `.env.local`
2. Actualiza las variables con tus valores reales
3. Nunca subas `.env.local` a Git

## Configuración en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a Settings > Environment Variables
3. Agrega cada variable con su valor correspondiente
4. Asegúrate de que estén configuradas para todos los entornos (Production, Preview, Development)

## Seguridad

- Nunca incluyas credenciales reales en el código
- Usa variables de entorno para todas las configuraciones sensibles
- El archivo `.env.local` está en `.gitignore` por seguridad

## Migración: Jornadas (multi-evento + histórico)

A partir de esta versión cada `Donante` pertenece a una **Jornada**. Como el
`build` de Vercel **no** corre migraciones automáticamente, el cambio de esquema
en la base de datos es un **paso manual** que debe coordinarse con el deploy.

> ⚠️ El `DATABASE_URL` de `.env` apunta a la base de datos de **producción**
> (Neon). Toma un respaldo antes de ejecutar estos pasos.

### Runbook (ejecutar una sola vez contra producción)

1. **Columna nullable.** En `prisma/schema.prisma`, en el modelo `Donante`,
   deja temporalmente la relación de jornada como **opcional** y comenta el
   índice único compuesto:
   ```prisma
   jornadaId  String?  @map("jornada_id")
   jornada    Jornada? @relation(fields: [jornadaId], references: [id], onDelete: Cascade)
   // @@unique([cedula, jornadaId])   // <- comentar en este paso
   cedula     String   @unique         // <- mantener temporalmente
   ```
   Luego:
   ```bash
   npm run db:push
   ```

2. **Backfill de datos.** Crea las jornadas y asigna los donantes existentes a
   la jornada de julio 2025:
   ```bash
   npx tsx scripts/migrate-jornadas.ts
   ```

3. **Columna requerida + índice único compuesto.** Restaura el esquema **final**
   (jornada requerida, sin `@unique` en `cedula`, con `@@unique([cedula, jornadaId])`)
   y aplica:
   ```bash
   npm run db:push
   npx prisma generate
   ```

Después de esto, el dashboard mostrará la jornada **activa** por defecto y el
histórico (`/historico`) listará todas las jornadas. Las jornadas nuevas se
crean desde `/jornadas` (protegida con `NEXT_PUBLIC_ADMIN_PASSWORD`). 