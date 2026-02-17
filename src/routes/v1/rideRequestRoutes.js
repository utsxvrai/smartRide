const express = require("express");
const { rideRequestController } = require("../../controllers");

const router = express.Router();

router.post("/", rideRequestController.createRequest);
router.post("/allocate", rideRequestController.allocateRide);
router.get("/", rideRequestController.getAllRequests);
router.get("/:id", rideRequestController.getRequest);
router.post("/assign", rideRequestController.assignToPool);
router.post("/:id/cancel", rideRequestController.cancelRequest);


module.exports = router;
