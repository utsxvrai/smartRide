const express = require("express");
const { passengerController } = require("../../controllers");

const router = express.Router();

router.post("/", passengerController.createPassenger);
router.get("/", passengerController.getAllPassengers);
router.get("/:id", passengerController.getPassenger);
router.put("/:id", passengerController.updatePassenger);
router.delete("/:id", passengerController.deletePassenger);

module.exports = router;
