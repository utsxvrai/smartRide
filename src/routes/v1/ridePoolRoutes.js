const express = require("express");
const { ridePoolController } = require("../../controllers");

const router = express.Router();

router.post("/", ridePoolController.createPool);
router.get("/", ridePoolController.getAllPools);
router.get("/:id", ridePoolController.getPool);
router.patch("/:id/status", ridePoolController.updateStatus);

module.exports = router;
