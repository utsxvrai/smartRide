const ridePoolRepository = require("../repositories/ridePoolRepository");
const cabRepository = require("../repositories/cabRepository");

class RidePoolService {
  async createRidePool(cabId) {
    const cab = await cabRepository.findById(cabId);
    if (!cab) {
      throw new Error("Cab not found");
    }
    if (cab.status !== "AVAILABLE") {
      throw new Error("Cab is not available for a new pool");
    }

    const pool = await ridePoolRepository.create({
      cabId: parseInt(cabId),
      status: "ACTIVE"
    });

    await cabRepository.update(cabId, { status: "BUSY" });

    return pool;
  }

  async getRidePoolById(id) {
    const pool = await ridePoolRepository.findById(id);
    if (!pool) {
      throw new Error("Ride Pool not found");
    }
    return pool;
  }

  async getAllRidePools(status) {
    return await ridePoolRepository.findAll(status);
  }

  async updatePoolStatus(id, status) {
    const pool = await this.getRidePoolById(id);
    const updatedPool = await ridePoolRepository.updateStatus(id, status);

    if (status === "COMPLETED" || status === "CANCELLED") {

      await cabRepository.update(pool.cabId, {
        status: "AVAILABLE",
        availableSeats: pool.cab.totalSeats,
        availableLuggage: pool.cab.totalLuggageCapacity
      });
    }

    return updatedPool;
  }
}

module.exports = new RidePoolService();
