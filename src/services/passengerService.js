const passengerRepository = require("../repositories/passengerRepository");

class PassengerService {
  async createPassenger(data) {

    if (!data.name) {
      throw new Error("Passenger name is required");
    }
    return await passengerRepository.create(data);
  }

  async getPassengerById(id) {
    const passenger = await passengerRepository.findById(id);
    if (!passenger) {
      throw new Error("Passenger not found");
    }
    return passenger;
  }

  async getAllPassengers() {
    return await passengerRepository.findAll();
  }

  async updatePassenger(id, data) {
    await this.getPassengerById(id);
    return await passengerRepository.update(id, data);
  }

  async deletePassenger(id) {
    await this.getPassengerById(id);
    return await passengerRepository.delete(id);
  }

}

module.exports = new PassengerService();
