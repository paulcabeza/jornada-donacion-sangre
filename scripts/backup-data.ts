/**
 * Respaldo lógico de los datos antes de la migración de jornadas.
 *
 * Lee las tablas con SQL crudo (no depende del esquema de Prisma, que en este
 * punto puede no coincidir con la BD) y vuelca todo a un JSON en /backups.
 *
 * Uso:  npx tsx scripts/backup-data.ts
 */
import { prisma } from "../lib/db";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

async function dump(tabla: string): Promise<unknown[]> {
  try {
    return (await prisma.$queryRawUnsafe(`SELECT * FROM ${tabla}`)) as unknown[];
  } catch (error) {
    console.warn(`(tabla '${tabla}' no disponible, se omite)`);
    return [];
  }
}

async function main() {
  const barrios = await dump("barrios");
  const donantes = await dump("donantes");
  const jornadas = await dump("jornadas");

  const backup = {
    generadoEn: new Date().toISOString(),
    conteos: { barrios: barrios.length, donantes: donantes.length, jornadas: jornadas.length },
    barrios,
    donantes,
    jornadas,
  };

  const dir = join(process.cwd(), "backups");
  mkdirSync(dir, { recursive: true });
  const archivo = join(dir, `backup-${backup.generadoEn.replace(/[:.]/g, "-")}.json`);
  // BigInt no es serializable por defecto
  writeFileSync(archivo, JSON.stringify(backup, (_k, v) => (typeof v === "bigint" ? Number(v) : v), 2));

  console.log("✅ Respaldo creado:");
  console.log(`   ${archivo}`);
  console.log(`   barrios: ${barrios.length}, donantes: ${donantes.length}, jornadas: ${jornadas.length}`);
}

main()
  .catch((error) => {
    console.error("Error creando el respaldo:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
