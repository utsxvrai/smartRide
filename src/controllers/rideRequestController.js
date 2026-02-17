const { rideRequestService, rideService } = require("../services");

class RideRequestController {
  async createRequest(req, res) {
    try {
      const request = await rideRequestService.createRideRequest(req.body);
      return res.status(201).json({
        success: true,
        message: "Ride Request created successfully",
        data: request,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async allocateRide(req, res) {
    try {
      const { passengerId, pickup, drop } = req.body;
      const result = await rideService.allocateRide(passengerId, pickup, drop);
      return res.status(200).json({
        success: true,
        message: "Ride allocated successfully",
        data: result,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }


  async getRequest(req, res) {
    try {
      const request = await rideRequestService.getRideRequestById(req.params.id);
      return res.status(200).json({
        success: true,
        data: request,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllRequests(req, res) {
    try {
      const requests = await rideRequestService.getAllRideRequests(req.query.status);
      return res.status(200).json({
        success: true,
        data: requests,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async assignToPool(req, res) {
    try {
      const { requestId, poolId } = req.body;
      const request = await rideRequestService.assignToPool(requestId, poolId);
      return res.status(200).json({
        success: true,
        message: "Ride Request assigned to pool successfully",
        data: request,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async cancelRequest(req, res) {
    try {
      const request = await rideRequestService.cancelRideRequest(req.params.id);
      return res.status(200).json({
        success: true,
        message: "Ride Request cancelled successfully",
        data: request,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new RideRequestController();
