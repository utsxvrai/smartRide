const { passengerService } = require("../services");

class PassengerController {
  async createPassenger(req, res) {
    try {
      const passenger = await passengerService.createPassenger(req.body);
      return res.status(201).json({
        success: true,
        message: "Passenger created successfully",
        data: passenger,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPassenger(req, res) {
    try {
      const passenger = await passengerService.getPassengerById(req.params.id);
      return res.status(200).json({
        success: true,
        data: passenger,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllPassengers(req, res) {
    try {
      const passengers = await passengerService.getAllPassengers();
      return res.status(200).json({
        success: true,
        data: passengers,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updatePassenger(req, res) {
    try {
      const passenger = await passengerService.updatePassenger(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: "Passenger updated successfully",
        data: passenger,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async deletePassenger(req, res) {
    try {
      await passengerService.deletePassenger(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Passenger deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new PassengerController();
