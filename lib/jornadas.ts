import { prisma } from "./db";

/**
 * Devuelve la jornada marcada como activa. Si hubiera más de una marcada
 * (no debería pasar), se prioriza la de fecha más reciente.
 */
export async function getJornadaActiva() {
  return prisma.jornada.findFirst({
    where: { activa: true },
    orderBy: { fecha: "desc" },
  });
}

/**
 * Resuelve el id de jornada a usar en un request: el recibido por query param,
 * o el de la jornada activa como fallback. Devuelve null si no hay ninguna.
 */
export async function resolverJornadaId(jornadaIdParam?: string | null) {
  if (jornadaIdParam) return jornadaIdParam;
  const activa = await getJornadaActiva();
  return activa?.id ?? null;
}
