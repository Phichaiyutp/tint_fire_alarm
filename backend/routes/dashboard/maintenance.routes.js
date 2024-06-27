const express = require('express');
const router = express.Router();
const maintenanceControllers = require("../../controllers/dashboard/maintenance.controllers")
const authMiddleware = require("../../middleware/auth")

router.get('/:id',authMiddleware, maintenanceControllers.MaintenanceById);


module.exports = router