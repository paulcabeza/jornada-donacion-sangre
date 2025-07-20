import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Obtener todos los barrios
export async function GET() {
  try {
    const barrios = await prisma.barrio.findMany({
      include: {
        _count: {
          select: { donantes: true }
        }
      },
      orderBy: { nombre: "asc" }
    });

    return NextResponse.json(barrios);
  } catch (error) {
    console.error("Error fetching barrios:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo barrio
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nombre, descripcion } = body;

    if (!nombre) {
      return NextResponse.json(
        { error: "El nombre del barrio es requerido" },
        { status: 400 }
      );
    }

    const barrio = await prisma.barrio.create({
      data: {
        nombre,
        descripcion: descripcion || null,
      },
    });

    return NextResponse.json(barrio, { status: 201 });
  } catch (error: unknown) {
    console.error("Error creating barrio:", error);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un barrio con ese nombre" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 