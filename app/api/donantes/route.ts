import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Obtener todos los donantes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const barrioId = searchParams.get("barrioId");

    const donantes = await prisma.donante.findMany({
      where: barrioId ? { barrioId } : undefined,
      include: {
        barrio: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(donantes);
  } catch (error) {
    console.error("Error fetching donantes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo donante
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      nombre,
      apellido,
      cedula,
      telefono,
      email,
      tipoSangre,
      barrioId,
      fechaDonacion,
    } = body;

    // Validaciones básicas
    if (!nombre || !apellido || !cedula || !tipoSangre || !barrioId) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Verificar que el barrio existe
    const barrio = await prisma.barrio.findUnique({
      where: { id: barrioId },
    });

    if (!barrio) {
      return NextResponse.json(
        { error: "El barrio especificado no existe" },
        { status: 400 }
      );
    }

    const donante = await prisma.donante.create({
      data: {
        nombre,
        apellido,
        cedula,
        telefono: telefono || null,
        email: email || null,
        tipoSangre,
        barrioId,
        fechaDonacion: fechaDonacion ? new Date(fechaDonacion) : new Date(),
      },
      include: {
        barrio: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    return NextResponse.json(donante, { status: 201 });
  } catch (error: any) {
    console.error("Error creating donante:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Ya existe un donante con esa cédula" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 