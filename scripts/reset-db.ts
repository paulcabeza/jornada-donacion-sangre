import { clearDatabase, seedDatabase } from "../lib/seed";

async function main() {
  console.log("🔄 Iniciando reset de la base de datos...");
  
  // Limpiar la base de datos
  await clearDatabase();
  
  // Reseedear con los nuevos barrios
  await seedDatabase();
  
  console.log("✅ Base de datos reseteada exitosamente con los nuevos barrios!");
  process.exit(0);
}

main().catch((error) => {
  console.error("❌ Error reseteando la base de datos:", error);
  process.exit(1);
}); 