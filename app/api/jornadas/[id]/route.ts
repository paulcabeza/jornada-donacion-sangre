import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Detalle de una jornada
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const jornada = await prisma.jornada.findUnique({
      where: { id },
      include: {
        _count: {
          select: { donantes: true },
        },
      },
    });

    if (!jornada) {
      return NextResponse.json(
        { error: "Jornada no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(jornada);
  } catch (error) {
    console.error("Error fetching jornada:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PATCH - Editar una jornada o marcarla como activa
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { nombre, fecha, descripcion, activa } = body;

    const jornada = await prisma.$transaction(async (tx) => {
      // Al marcar esta jornada como activa, desmarcar las demás
      if (activa === true) {
        await tx.jornada.updateMany({
          where: { activa: true, id: { not: id } },
          data: { activa: false },
        });
      }

      return tx.jornada.update({
        where: { id },
        data: {
          ...(nombre !== undefined ? { nombre } : {}),
          ...(fecha !== undefined ? { fecha: new Date(fecha) } : {}),
          ...(descripcion !== undefined ? { descripcion: descripcion || null } : {}),
          ...(activa !== undefined ? { activa: Boolean(activa) } : {}),
        },
      });
    });

    return NextResponse.json(jornada);
  } catch (error: unknown) {
    console.error("Error updating jornada:", error);

    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Jornada no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
