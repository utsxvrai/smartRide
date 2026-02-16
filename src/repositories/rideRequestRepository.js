const prisma = require("../config/prisma");

class RideRequestRepository {
  async create(data) {
    return await prisma.rideRequest.create({
      data,
    });
  }

  async findById(id) {
    return await prisma.rideRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        passenger: true,
        pool: {
          include: {
            cab: true,
          },
        },
      },
    });
  }

  async findAll(status) {
    const where = status ? { status } : {};
    return await prisma.rideRequest.findMany({
      where,
      include: {
        passenger: true,
      },
    });
  }

  async updateStatus(id, status, poolId = null) {
    const data = { status };
    if (poolId) {
      data.poolId = parseInt(poolId);
    }
    return await prisma.rideRequest.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async findPending() {
    return await prisma.rideRequest.findMany({
      where: { status: "PENDING" },
      include: {
        passenger: true,
      },
    });
  }
}

module.exports = new RideRequestRepository();
