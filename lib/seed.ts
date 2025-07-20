import { prisma } from "./db";

const barriosEjemplo = [
  {
    nombre: "Buena Vista",
    descripcion: "Barrio residencial con vista panorámica",
  },
  {
    nombre: "Vista Hermosa",
    descripcion: "Zona residencial con hermosas vistas",
  },
  {
    nombre: "Los Llanitos",
    descripcion: "Barrio tradicional y familiar",
  },
  {
    nombre: "Mejicanos",
    descripcion: "Zona urbana y comercial",
  },
  {
    nombre: "Ayutuxtepeque",
    descripcion: "Municipio con tradición histórica",
  },
];

export async function seedDatabase() {
  try {
    console.log("Iniciando poblado de la base de datos...");

    // Verificar si ya existen barrios
    const barriosExistentes = await prisma.barrio.count();
    
    if (barriosExistentes > 0) {
      console.log("La base de datos ya contiene barrios. Saltando el poblado inicial.");
      return;
    }

    // Crear barrios
    for (const barrio of barriosEjemplo) {
      await prisma.barrio.create({
        data: barrio,
      });
    }

    console.log(`✅ Se crearon ${barriosEjemplo.length} barrios de ejemplo.`);
    console.log("Base de datos poblada exitosamente!");

  } catch (error) {
    console.error("Error poblando la base de datos:", error);
    throw error;
  }
}

// Función para limpiar la base de datos (útil para desarrollo)
export async function clearDatabase() {
  try {
    console.log("Limpiando base de datos...");
    
    await prisma.donante.deleteMany();
    await prisma.barrio.deleteMany();
    
    console.log("✅ Base de datos limpiada.");
  } catch (error) {
    console.error("Error limpiando la base de datos:", error);
    throw error;
  }
} 