import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Listar todas las jornadas con el total de donantes
export async function GET() {
  try {
    const jornadas = await prisma.jornada.findMany({
      include: {
        _count: {
          select: { donantes: true },
        },
      },
      orderBy: { fecha: "desc" },
    });

    return NextResponse.json(jornadas);
  } catch (error) {
    console.error("Error fetching jornadas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva jornada
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, fecha, descripcion, activa } = body;

    if (!nombre || !fecha) {
      return NextResponse.json(
        { error: "El nombre y la fecha son requeridos" },
        { status: 400 }
      );
    }

    const jornada = await prisma.$transaction(async (tx) => {
      // Si la nueva jornada será activa, desmarcar las demás
      if (activa) {
        await tx.jornada.updateMany({
          where: { activa: true },
          data: { activa: false },
        });
      }

      return tx.jornada.create({
        data: {
          nombre,
          fecha: new Date(fecha),
          descripcion: descripcion || null,
          activa: Boolean(activa),
        },
      });
    });

    return NextResponse.json(jornada, { status: 201 });
  } catch (error) {
    console.error("Error creating jornada:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
