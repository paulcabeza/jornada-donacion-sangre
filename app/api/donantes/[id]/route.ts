import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// DELETE - Eliminar un donante por ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {

    // Verificar que el donante existe
    const donante = await prisma.donante.findUnique({
      where: { id },
    });

    if (!donante) {
      return NextResponse.json(
        { error: "Donante no encontrado" },
        { status: 404 }
      );
    }

    // Eliminar el donante
    await prisma.donante.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Donante eliminado exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting donante:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 