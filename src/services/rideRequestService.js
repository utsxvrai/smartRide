const rideRequestRepository = require("../repositories/rideRequestRepository");
const passengerRepository = require("../repositories/passengerRepository");
const ridePoolRepository = require("../repositories/ridePoolRepository");
const cabRepository = require("../repositories/cabRepository");

class RideRequestService {
  async createRideRequest(data) {
    const passenger = await passengerRepository.findById(data.passengerId);
    if (!passenger) {
      throw new Error("Passenger not found");
    }
    
    return await rideRequestRepository.create({

      ...data,
      status: "PENDING"
    });
  }

  async getRideRequestById(id) {
    const request = await rideRequestRepository.findById(id);
    if (!request) {
      throw new Error("Ride Request not found");
    }
    return request;
  }

  async getAllRideRequests(status) {
    return await rideRequestRepository.findAll(status);
  }

  async assignToPool(requestId, poolId) {
    const request = await this.getRideRequestById(requestId);
    const pool = await ridePoolRepository.findById(poolId);

    if (!pool) {
      throw new Error("Ride Pool not found");
    }
    if (pool.status !== "ACTIVE") {
      throw new Error("Cannot assign request to an inactive pool");
    }

    const cab = pool.cab;
    const passenger = request.passenger;

    if (cab.availableSeats < 1) {
      throw new Error("No available seats in this cab");
    }
    if (cab.availableLuggage < passenger.luggageCount) {
      throw new Error("Not enough luggage capacity in this cab");
    }

    const updatedRequest = await rideRequestRepository.updateStatus(requestId, "ACCEPTED", poolId);

    await cabRepository.updateAvailableCapacity(
      cab.id,
      cab.availableSeats - 1,
      cab.availableLuggage - passenger.luggageCount
    );

    return updatedRequest;
  }

  async cancelRideRequest(id) {
    const request = await this.getRideRequestById(id);
    
    if (request.status === "ACCEPTED" && request.poolId) {
      const pool = await ridePoolRepository.findById(request.poolId);
      const cab = pool.cab;
      const passenger = request.passenger;

      await cabRepository.updateAvailableCapacity(
        cab.id,
        cab.availableSeats + 1,
        cab.availableLuggage + passenger.luggageCount
      );
    }


    return await rideRequestRepository.updateStatus(id, "CANCELLED");
  }
}

module.exports = new RideRequestService();
