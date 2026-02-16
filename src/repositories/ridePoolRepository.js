const prisma = require("../config/prisma");

class RidePoolRepository {
  async create(data) {
    return await prisma.ridePool.create({
      data,
    });
  }

  async findById(id) {
    return await prisma.ridePool.findUnique({
      where: { id: parseInt(id) },
      include: {
        cab: true,
        rideRequests: {
          include: {
            passenger: true,
          },
        },
      },
    });
  }

  async findAll(status) {
    const where = status ? { status } : {};
    return await prisma.ridePool.findMany({
      where,
      include: {
        cab: true,
        _count: {
          select: { rideRequests: true },
        },
      },
    });
  }

  async updateStatus(id, status) {
    return await prisma.ridePool.update({
      where: { id: parseInt(id) },
      data: { status },
    });
  }
}

module.exports = new RidePoolRepository();
