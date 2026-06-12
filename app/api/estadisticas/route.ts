import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolverJornadaId } from "@/lib/jornadas";

// GET - Obtener estadísticas para el dashboard (filtradas por jornada)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const jornadaId = await resolverJornadaId(searchParams.get("jornadaId"));

    // Si no hay ninguna jornada (BD recién creada), devolver vacío
    if (!jornadaId) {
      return NextResponse.json({
        jornada: null,
        totalDonantes: 0,
        donantesPorBarrio: [],
        donantesPorTipoSangre: [],
      });
    }

    // Datos de la jornada (para el header del dashboard)
    const jornada = await prisma.jornada.findUnique({
      where: { id: jornadaId },
      select: { id: true, nombre: true, fecha: true, descripcion: true, activa: true },
    });

    if (!jornada) {
      return NextResponse.json(
        { error: "Jornada no encontrada" },
        { status: 404 }
      );
    }

    // Total de donantes de la jornada
    const totalDonantes = await prisma.donante.count({
      where: { jornadaId },
    });

    // Donantes por barrio (solo barrios con donantes en esta jornada)
    const conteoPorBarrio = await prisma.donante.groupBy({
      by: ["barrioId"],
      where: { jornadaId },
      _count: { _all: true },
    });

    const barrios = await prisma.barrio.findMany({
      where: { id: { in: conteoPorBarrio.map((c) => c.barrioId) } },
      select: { id: true, nombre: true },
    });
    const nombrePorBarrio = new Map(barrios.map((b) => [b.id, b.nombre]));

    const donantesPorBarrio = conteoPorBarrio
      .map((c) => ({
        id: c.barrioId,
        nombre: nombrePorBarrio.get(c.barrioId) ?? "Sin barrio",
        cantidad: c._count?._all ?? 0,
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Donantes por tipo de sangre
    const donantesPorTipoSangre = await prisma.donante.groupBy({
      by: ["tipoSangre"],
      where: { jornadaId },
      _count: { _all: true },
    });

    const estadisticas = {
      jornada,
      totalDonantes,
      donantesPorBarrio,
      donantesPorTipoSangre: donantesPorTipoSangre.map((tipo) => ({
        tipo: tipo.tipoSangre,
        cantidad: tipo._count?._all || 0,
      })),
    };

    return NextResponse.json(estadisticas);
  } catch (error) {
    console.error("Error fetching estadisticas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
