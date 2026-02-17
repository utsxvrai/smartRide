const express = require("express");
const { InfoController } = require("../../controllers");
const passengerRoutes = require("./passengerRoutes");
const cabRoutes = require("./cabRoutes");
const ridePoolRoutes = require("./ridePoolRoutes");
const rideRequestRoutes = require("./rideRequestRoutes");

const router = express.Router();

router.get("/info", InfoController.info);

router.use("/passengers", passengerRoutes);
router.use("/cabs", cabRoutes);
router.use("/pools", ridePoolRoutes);
router.use("/requests", rideRequestRoutes);

module.exports = router;