/**
 * Migración de datos para introducir Jornadas.
 *
 * Crea la jornada histórica "20-Julio-2025" y la nueva jornada activa
 * ("14-Junio"), y asigna TODOS los donantes existentes (los de julio 2025)
 * a la jornada histórica.
 *
 * Debe ejecutarse DESPUÉS de haber agregado la columna `jornada_id` como
 * NULLABLE a la tabla `donantes` (paso 1 del runbook en ENVIRONMENT.md) y
 * ANTES de volver a hacer `db push` con la columna ya requerida (paso 3).
 *
 * Uso:  npx tsx scripts/migrate-jornadas.ts
 *
 * Es idempotente: si las jornadas ya existen no las duplica, y solo asigna
 * los donantes que aún no tengan jornada.
 */
import { prisma } from "../lib/db";

const JORNADA_JULIO = {
  nombre: "Estaca Cuzcatlán",
  fecha: new Date("2025-07-20T00:00:00.000Z"),
  descripcion: "Jornada de donación del 20 de julio de 2025",
  activa: false,
};

const JORNADA_JUNIO = {
  nombre: "Estaca Cuzcatlán",
  fecha: new Date("2026-06-14T00:00:00.000Z"),
  descripcion: "Jornada de donación del 14 de junio de 2026",
  activa: true,
};

async function obtenerOCrearJornada(datos: typeof JORNADA_JULIO) {
  const existente = await prisma.jornada.findFirst({
    where: { fecha: datos.fecha },
  });
  if (existente) {
    console.log(`↳ Jornada ya existe: ${datos.nombre} (${datos.fecha.toISOString().slice(0, 10)})`);
    return existente;
  }
  const creada = await prisma.jornada.create({ data: datos });
  console.log(`✅ Jornada creada: ${creada.nombre} (${datos.fecha.toISOString().slice(0, 10)})`);
  return creada;
}

async function main() {
  console.log("Iniciando migración de jornadas...\n");

  const julio = await obtenerOCrearJornada(JORNADA_JULIO);
  await obtenerOCrearJornada(JORNADA_JUNIO);

  // Asignar a la jornada de julio todos los donantes que aún no tengan jornada.
  // Usamos SQL crudo porque, durante la migración, la columna es nullable y el
  // cliente Prisma (schema final) no expone el filtro `jornada_id IS NULL`.
  const actualizados = await prisma.$executeRawUnsafe(
    `UPDATE donantes SET jornada_id = $1 WHERE jornada_id IS NULL`,
    julio.id
  );

  console.log(`\n✅ Donantes asignados a la jornada de julio 2025: ${actualizados}`);
  console.log("\nMigración completada. Ahora puedes hacer 'npm run db:push' con la columna requerida.");
}

main()
  .catch((error) => {
    console.error("Error en la migración:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
