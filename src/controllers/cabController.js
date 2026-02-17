const { cabService } = require("../services");

class CabController {
  async createCab(req, res) {
    try {
      const cab = await cabService.createCab(req.body);
      return res.status(201).json({
        success: true,
        message: "Cab created successfully",
        data: cab,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getCab(req, res) {
    try {
      const cab = await cabService.getCabById(req.params.id);
      return res.status(200).json({
        success: true,
        data: cab,
      });
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllCabs(req, res) {
    try {
      const cabs = await cabService.getAllCabs();
      return res.status(200).json({
        success: true,
        data: cabs,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAvailableCabs(req, res) {
    try {
      const cabs = await cabService.getAvailableCabs();
      return res.status(200).json({
        success: true,
        data: cabs,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async updateCab(req, res) {
    try {
      const cab = await cabService.updateCab(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: "Cab updated successfully",
        data: cab,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new CabController();
