import { PrismaClient } from '@prisma/client';

const entrances = ['A', 'B', 'C'];

const prisma = new PrismaClient();

async function main() {
  for (const entrance of entrances) {
    await prisma.parkingEntrance.create({ data: { name: entrance } });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
