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
      },
      orderBy: {
        _count: {
          _all: 'desc'
        }
      }
    });

    // Donaciones por mes (últimos 6 meses)
    const seiseMesesAtras = new Date();
    seiseMesesAtras.setMonth(seiseMesesAtras.getMonth() - 6);

    const donacionesPorMes = await prisma.donante.groupBy({
      by: ['fechaDonacion'],
      where: {
        fechaDonacion: {
          gte: seiseMesesAtras
        }
      },
      _count: {
        _all: true
      }
    });

    // Procesar donaciones por mes para agrupar por mes/año
    const donacionesAgrupadas = donacionesPorMes.reduce((acc: any[], donacion) => {
      const fecha = new Date(donacion.fechaDonacion);
      const mesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      
      const existente = acc.find(item => item.mes === mesAno);
      if (existente) {
        existente.cantidad += donacion._count._all;
      } else {
        acc.push({
          mes: mesAno,
          cantidad: donacion._count._all
        });
      }
      return acc;
    }, []);

    const estadisticas = {
      totalDonantes,
      donantesPorBarrio: donantesPorBarrio.map(barrio => ({
        id: barrio.id,
        nombre: barrio.nombre,
        cantidad: barrio._count.donantes
      })),
      donantesPorTipoSangre: donantesPorTipoSangre.map(tipo => ({
        tipo: tipo.tipoSangre,
        cantidad: tipo._count._all
      })),
      donacionesPorMes: donacionesAgrupadas.sort((a, b) => a.mes.localeCompare(b.mes))
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