import { seedDatabase } from "../lib/seed";

async function main() {
  await seedDatabase();
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
}); 