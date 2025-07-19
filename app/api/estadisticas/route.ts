import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Obtener estadísticas para el dashboard
export async function GET() {
  try {
    // Total de donantes
    const totalDonantes = await prisma.donante.count();

    // Donantes por barrio
    const donantesPorBarrio = await prisma.barrio.findMany({
      select: {
        id: true,
        nombre: true,
        _count: {
          select: { donantes: true }
        }
      },
      orderBy: { nombre: "asc" }
    });

    // Donantes por tipo de sangre
    const donantesPorTipoSangre = await prisma.donante.groupBy({
      by: ['tipoSangre'],
      _count: {
        _all: true
      }
    });

    const estadisticas = {
      totalDonantes,
      donantesPorBarrio: donantesPorBarrio.map(barrio => ({
        id: barrio.id,
        nombre: barrio.nombre,
        cantidad: barrio._count.donantes
      })),
      donantesPorTipoSangre: donantesPorTipoSangre.map(tipo => ({
        tipo: tipo.tipoSangre,
        cantidad: tipo._count?._all || 0
      }))
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