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