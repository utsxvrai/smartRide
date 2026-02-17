const prisma = require("../config/prisma");
const { haversine } = require("../utils");
const passengerRepository = require("../repositories/passengerRepository");
const ridePoolRepository = require("../repositories/ridePoolRepository");
const cabRepository = require("../repositories/cabRepository");
const rideRequestRepository = require("../repositories/rideRequestRepository");

class RideAllocationService {

  async allocateRide(passengerId, pickupCoords, dropCoords) {
    const { lat: pLat, lng: pLng } = pickupCoords;
    const { lat: dLat, lng: dLng } = dropCoords;

    const passenger = await passengerRepository.findById(passengerId);
    if (!passenger) throw new Error("Passenger not found");

    const activePools = await ridePoolRepository.findAll("ACTIVE");

    const candidates = activePools.filter((pool) => {
      const hasSeats = pool.cab.availableSeats > 0;
      const hasLuggageSpace = pool.cab.availableLuggage >= passenger.luggageCount;
      return hasSeats && hasLuggageSpace;
    });

    let bestPool = null;
    let minDeviation = Infinity;

    for (const pool of candidates) {
      const deviation = this._calculateDetour(pool, pickupCoords, dropCoords);

      const speedKmPerMin = 0.5; // 30 km/h
      const deviationInMinutes = deviation / speedKmPerMin;

      if (deviationInMinutes <= passenger.maxDetourMinutes) {
        if (deviation < minDeviation) {
          minDeviation = deviation;
          bestPool = pool;
        }
      }
    }

    if (bestPool) {
      return await this._executeAllocation(bestPool.id, passenger, pickupCoords, dropCoords);
    } else {
      const availableCabs = await cabRepository.findAvailableCabs();
      if (availableCabs.length === 0) {
        throw new Error("No cabs or pools available at the moment");
      }
      
      const cab = availableCabs[0]; 
      
      return await prisma.$transaction(async (tx) => {
        const newPool = await tx.ridePool.create({
          data: {
            cabId: cab.id,
            status: "ACTIVE"
          }
        });

        await tx.cab.update({
          where: { id: cab.id },
          data: { status: "BUSY" }
        });

        return await this._allocateInsideTransaction(tx, newPool.id, passenger, pickupCoords, dropCoords);
      });
    }
  }

  async _executeAllocation(poolId, passenger, pickupCoords, dropCoords) {
    return await prisma.$transaction(async (tx) => {
      return await this._allocateInsideTransaction(tx, poolId, passenger, pickupCoords, dropCoords);
    });
  }

  async _allocateInsideTransaction(tx, poolId, passenger, pickupCoords, dropCoords) {
    const pool = await tx.ridePool.findUnique({
      where: { id: poolId },
      include: { cab: true }
    });

    if (!pool || pool.status !== "ACTIVE") {
      throw new Error("Target pool is no longer active");
    }

    const cab = pool.cab;

    if (cab.availableSeats < 1) {
      throw new Error("No seat available in this pool anymore");
    }
    if (cab.availableLuggage < passenger.luggageCount) {
      throw new Error("Not enough luggage capacity in this pool anymore");
    }

    const updatedCab = await tx.cab.update({
      where: { id: cab.id },
      data: {
        availableSeats: { decrement: 1 },
        availableLuggage: { decrement: passenger.luggageCount }
      }
    });

    const dist = haversine.calculateDistance(pickupCoords.lat, pickupCoords.lng, dropCoords.lat, dropCoords.lng);
    const baseFare = 5.0;
    const ratePerKm = 2.0;
    const isShared = pool.rideRequests.length > 0;
    const discount = isShared ? 0.75 : 1.0; 
    const calculatedFare = (baseFare + (dist * ratePerKm)) * discount;

    const rideRequest = await tx.rideRequest.create({
      data: {
        passengerId: passenger.id,
        poolId: pool.id,
        pickupLat: pickupCoords.lat,
        pickupLng: pickupCoords.lng,
        dropLat: dropCoords.lat,
        dropLng: dropCoords.lng,
        status: "ACCEPTED",
        fare: calculatedFare
      }
    });


    return { rideRequest, updatedCab };
  }

  _calculateDetour(pool, newPickup, newDrop) {
    const requests = pool.rideRequests || [];
    
    if (requests.length === 0) {
      return haversine.calculateDistance(newPickup.lat, newPickup.lng, newDrop.lat, newDrop.lng);
    }

    let existingDist = 0;
    for (let i = 0; i < requests.length - 1; i++) {
        existingDist += haversine.calculateDistance(
            requests[i].pickupLat, requests[i].pickupLng,
            requests[i+1].pickupLat, requests[i+1].pickupLng
        );
    }
    existingDist += haversine.calculateDistance(
        requests[requests.length - 1].pickupLat, requests[requests.length - 1].pickupLng,
        requests[0].dropLat, requests[0].dropLng
    );
    for (let i = 0; i < requests.length - 1; i++) {
        existingDist += haversine.calculateDistance(
            requests[i].dropLat, requests[i].dropLng,
            requests[i+1].dropLat, requests[i+1].dropLng
        );
    }

    let newDist = 0;
    for (let i = 0; i < requests.length - 1; i++) {
        newDist += haversine.calculateDistance(
            requests[i].pickupLat, requests[i].pickupLng,
            requests[i+1].pickupLat, requests[i+1].pickupLng
        );
    }

    newDist += haversine.calculateDistance(
        requests[requests.length - 1].pickupLat, requests[requests.length - 1].pickupLng,
        newPickup.lat, newPickup.lng
    );

    newDist += haversine.calculateDistance(
        newPickup.lat, newPickup.lng,
        newDrop.lat, newDrop.lng
    );

    newDist += haversine.calculateDistance(
        newDrop.lat, newDrop.lng,
        requests[0].dropLat, requests[0].dropLng
    );

    for (let i = 0; i < requests.length - 1; i++) {
        newDist += haversine.calculateDistance(
            requests[i].dropLat, requests[i].dropLng,
            requests[i+1].dropLat, requests[i+1].dropLng
        );
    }

    return newDist - existingDist;
  }

}

module.exports = new RideAllocationService();

