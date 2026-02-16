const prisma = require("../config/prisma");

class CabRepository {
  async create(data) {
    return await prisma.cab.create({
      data,
    });
  }

  async findById(id) {
    return await prisma.cab.findUnique({
      where: { id: parseInt(id) },
      include: {
        ridePools: true,
      },
    });
  }

  async findAll() {
    return await prisma.cab.findMany();
  }

  async update(id, data) {
    return await prisma.cab.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async updateAvailableCapacity(id, availableSeats, availableLuggage) {
    return await prisma.cab.update({
      where: { id: parseInt(id) },
      data: {
        availableSeats,
        availableLuggage,
      },
    });
  }

  async findAvailableCabs() {
    return await prisma.cab.findMany({
      where: {
        status: "AVAILABLE",
        availableSeats: {
          gt: 0,
        },
      },
    });
  }
}

module.exports = new CabRepository();
