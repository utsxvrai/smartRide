const prisma = require("../config/prisma");

class PassengerRepository {
  async create(data) {
    return await prisma.passenger.create({
      data,
    });
  }

  async findById(id) {
    return await prisma.passenger.findUnique({
      where: { id: parseInt(id) },
      include: {
        rideRequests: true,
      },
    });
  }

  async findAll() {
    return await prisma.passenger.findMany();
  }

  async update(id, data) {
    return await prisma.passenger.update({
      where: { id: parseInt(id) },
      data,
    });
  }

  async delete(id) {
    return await prisma.passenger.delete({
      where: { id: parseInt(id) },
    });
  }
}

module.exports = new PassengerRepository();
