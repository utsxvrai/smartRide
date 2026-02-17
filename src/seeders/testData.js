const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up database...");
  await prisma.rideRequest.deleteMany();
  await prisma.ridePool.deleteMany();
  await prisma.cab.deleteMany();
  await prisma.passenger.deleteMany();

  console.log("Seeding Passengers...");
  const p1 = await prisma.passenger.create({
    data: { name: "Alice", luggageCount: 1, maxDetourMinutes: 20 },
  });
  const p2 = await prisma.passenger.create({
    data: { name: "Bob", luggageCount: 2, maxDetourMinutes: 10 },
  });
  const p3 = await prisma.passenger.create({
    data: { name: "Charlie", luggageCount: 1, maxDetourMinutes: 30 },
  });

  console.log("Seeding Cabs...");
  const c1 = await prisma.cab.create({
    data: {
      totalSeats: 4,
      availableSeats: 3,
      totalLuggageCapacity: 10,
      availableLuggage: 8,
      status: "BUSY",
    },
  });

  const c2 = await prisma.cab.create({
    data: {
      totalSeats: 4,
      availableSeats: 4,
      totalLuggageCapacity: 10,
      availableLuggage: 10,
      status: "AVAILABLE",
    },
  });

  const c3 = await prisma.cab.create({
    data: {
      totalSeats: 6,
      availableSeats: 6,
      totalLuggageCapacity: 20,
      availableLuggage: 20,
      status: "AVAILABLE",
    },
  });

  console.log("Seeding an Active Ride Pool...");
  const pool1 = await prisma.ridePool.create({
    data: {
      cabId: c1.id,
      status: "ACTIVE",
    },
  });

  await prisma.rideRequest.create({
    data: {
      passengerId: p1.id,
      poolId: pool1.id,
      pickupLat: 12.9716, 
      pickupLng: 77.5946,
      dropLat: 13.1986, 
      dropLng: 77.7066,
      status: "ACCEPTED",
    },
  });


  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
