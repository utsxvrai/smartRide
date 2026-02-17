const { ridePoolService } = require("../services");

class RidePoolController {
  async createPool(req, res) {
    try {
      const { cabId } = req.body;
      const pool = await ridePoolService.createRidePool(cabId);
      return res.status(201).json({
        success: true,
        message: "Ride Pool created successfully",
        data: pool,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getPool(req, res) {
    try {
      const pool = await ridePoolService.getRidePoolById(req.params.id);
      return res.status(200).json({
        success: true,
        data: pool,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllPools(req, res) {
    try {
      const pools = await ridePoolService.getAllRidePools(req.query.status);
      return res.status(200).json({
        success: true,
        data: pools,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const pool = await ridePoolService.updatePoolStatus(req.params.id, status);
      return res.status(200).json({
        success: true,
        message: `Ride Pool status updated to ${status}`,
        data: pool,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new RidePoolController();
