const express = require("express");
const { cabController } = require("../../controllers");

const router = express.Router();

router.post("/", cabController.createCab);
router.get("/", cabController.getAllCabs);
router.get("/available", cabController.getAvailableCabs);
router.get("/:id", cabController.getCab);
router.put("/:id", cabController.updateCab);

module.exports = router;
