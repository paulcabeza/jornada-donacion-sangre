# 🩸 Sistema de Donación de Sangre

Un sistema completo para gestionar donantes de sangre con dashboard administrativo y portal de registro. Construido con Next.js, TypeScript, Prisma y PostgreSQL.

## ✨ Características

- **Portal de Registro**: Formulario intuitivo para registrar nuevos donantes
- **Dashboard Administrativo**: Estadísticas completas y gráficos interactivos
- **Gráficos por Barrio**: Visualización clickeable de donantes por ubicación
- **Modal Detallado**: Lista completa de donantes al hacer clic en los barrios
- **Validación Robusta**: Validación tanto en frontend como backend
- **UI Moderna**: Interfaz hermosa con Tailwind CSS y shadcn/ui

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14+ (App Router)
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Gráficos**: Recharts
- **Formularios**: React Hook Form + Zod
- **Iconos**: Lucide React

## 🚀 Inicio Rápido

### 1. Prerrequisitos

- Node.js 18+ 
- PostgreSQL (local o en la nube)
- npm o yarn

### 2. Instalación

```bash
# Clonar el repositorio
git clone <tu-repo>
cd donacion-sangre

# Instalar dependencias
npm install
```

### 3. Configuración de Base de Datos

1. Crea un archivo `.env` en la raíz del proyecto:

```env
# Database
DATABASE_URL="postgresql://usuario:password@localhost:5432/donacion_sangre?schema=public"
```

2. Configura tu base de datos PostgreSQL y reemplaza la URL con tus credenciales.

### 4. Setup de Prisma

```bash
# Generar el cliente de Prisma
npm run db:generate

# Aplicar el esquema a la base de datos
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed
```

### 5. Ejecutar la Aplicación

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📱 Uso de la Aplicación

### Portal Principal (`/`)
- Página de bienvenida con información sobre donación de sangre
- Enlaces a ambos portales

### Portal de Registro (`/registro`)
- Formulario para registrar nuevos donantes
- Campos: nombre, apellido, cédula, teléfono, email, tipo de sangre, barrio
- Validación en tiempo real
- Mensajes de éxito/error

### Dashboard Administrativo (`/admin`)
- **Estadísticas Principales**: Total de donantes, barrios activos, tipos de sangre
- **Gráfico de Barrios**: Barras clickeables que muestran donantes por barrio
- **Gráfico de Tipos de Sangre**: Distribución en gráfico de pastel
- **Tendencia Mensual**: Evolución de donaciones en los últimos 6 meses
- **Modal de Donantes**: Al hacer clic en un barrio, muestra lista detallada

## 🎨 Estructura del Proyecto

```
donacion-sangre/
├── app/
│   ├── admin/          # Dashboard administrativo
│   ├── api/           # API routes (backend)
│   ├── registro/      # Portal de registro
│   └── globals.css    # Estilos globales
├── components/
│   └── ui/           # Componentes de shadcn/ui
├── lib/
│   ├── db.ts         # Configuración de Prisma
│   ├── seed.ts       # Script de poblado
│   └── utils.ts      # Utilidades
├── prisma/
│   └── schema.prisma # Esquema de base de datos
└── scripts/
    └── seed.ts       # Script ejecutable de seeding
```

## 🗃️ Esquema de Base de Datos

### Tabla `barrios`
- `id`: String (CUID)
- `nombre`: String (único)
- `descripcion`: String (opcional)
- `created_at`, `updated_at`: DateTime

### Tabla `donantes`
- `id`: String (CUID)
- `nombre`, `apellido`: String
- `cedula`: String (único)
- `telefono`, `email`: String (opcional)
- `tipo_sangre`: String (A+, A-, B+, B-, AB+, AB-, O+, O-)
- `fecha_donacion`: DateTime
- `barrio_id`: String (referencia a barrios)
- `created_at`, `updated_at`: DateTime

## 📊 Funcionalidades del Dashboard

### Métricas Principales
- Total de donantes registrados
- Número de barrios con donantes activos
- Cantidad de tipos de sangre diferentes
- Donaciones del mes actual

### Gráficos Interactivos
1. **Barras por Barrio**: Clickeable para ver donantes específicos
2. **Pastel por Tipo de Sangre**: Distribución proporcional
3. **Línea Temporal**: Tendencia mensual de donaciones

### Modal de Donantes
- Se abre al hacer clic en cualquier barra del gráfico de barrios
- Muestra lista completa con información detallada
- Datos: nombre, cédula, contacto, tipo de sangre, fecha de donación

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Base de datos
npm run db:generate      # Generar cliente de Prisma
npm run db:push          # Aplicar esquema sin migraciones
npm run db:migrate       # Crear y aplicar migraciones
npm run db:seed          # Poblar con datos de ejemplo
npm run db:studio        # Abrir Prisma Studio (GUI)

# Producción
npm run build           # Construir para producción
npm run start           # Iniciar servidor de producción
```

## 🌐 API Endpoints

### Barrios
- `GET /api/barrios` - Obtener todos los barrios con conteo de donantes
- `POST /api/barrios` - Crear nuevo barrio

### Donantes
- `GET /api/donantes` - Obtener todos los donantes
- `GET /api/donantes?barrioId=xxx` - Filtrar por barrio
- `POST /api/donantes` - Crear nuevo donante

### Estadísticas
- `GET /api/estadisticas` - Obtener todas las estadísticas del dashboard

## 🚢 Deploy en Producción

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno:
   - `DATABASE_URL`: Tu string de conexión de PostgreSQL
3. Despliega automáticamente

### Variables de Entorno de Producción

```env
DATABASE_URL="postgresql://user:pass@host:port/db?schema=public"
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Notas de Desarrollo

- **Prisma Studio**: Usa `npm run db:studio` para una interfaz visual de la DB
- **Hot Reload**: El desarrollo incluye recarga automática
- **TypeScript**: Tipado end-to-end desde base de datos hasta UI
- **Validación**: Zod para validación tanto en cliente como servidor

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.

---

**¡Construido con ❤️ para salvar vidas a través de la donación de sangre!** 🩸
