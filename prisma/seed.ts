import { ParkingType, PrismaClient } from '@prisma/client';

const entrances = ['A', 'B', 'C'];

const parkingSlotTypes = [
  { type: ParkingType.SP, price: 20 },
  { type: ParkingType.MP, price: 60 },
  { type: ParkingType.LP, price: 100 },
];

const prisma = new PrismaClient();

async function main() {
  for (const entrance of entrances) {
    await prisma.parkingEntrance.create({ data: { name: entrance } });
  }

  for (let i = 0; i < parkingSlotTypes.length; i++) {
    const { id } = await prisma.parkingSlotType.create({
      data: parkingSlotTypes[i],
    });

    await prisma.parkingSlot.create({
      data: { name: `P${i + 1}`, parkingSlotTypeId: id },
    });
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
