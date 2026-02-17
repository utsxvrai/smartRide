const cabRepository = require("../repositories/cabRepository");

class CabService {
  async createCab(data) {
    if (data.totalSeats === undefined || data.totalLuggageCapacity === undefined) {
      throw new Error("Total seats and luggage capacity are required");
    }

    const cabData = {
      ...data,
      availableSeats: data.availableSeats ?? data.totalSeats,
      availableLuggage: data.availableLuggage ?? data.totalLuggageCapacity,
    };
    return await cabRepository.create(cabData);
  }

  async getCabById(id) {
    const cab = await cabRepository.findById(id);
    if (!cab) {
      throw new Error("Cab not found");
    }
    return cab;
  }

  async getAllCabs() {
    return await cabRepository.findAll();
  }

  async updateCab(id, data) {
    await this.getCabById(id);
    return await cabRepository.update(id, data);
  }

  async getAvailableCabs() {
    return await cabRepository.findAvailableCabs();
  }

  async updateCapacity(id, availableSeats, availableLuggage) {
    const cab = await this.getCabById(id);
    if (availableSeats > cab.totalSeats || availableLuggage > cab.totalLuggageCapacity) {
      throw new Error("Available capacity cannot exceed total capacity");
    }
    return await cabRepository.updateAvailableCapacity(id, availableSeats, availableLuggage);
  }
}

module.exports = new CabService();
