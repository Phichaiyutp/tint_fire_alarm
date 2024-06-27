const express = require('express');
const router = express.Router();
const devicesStatusControllers = require("../../controllers/dashboard/devices_status.controllers")
const authMiddleware = require("../../middleware/auth")

router.get('/',authMiddleware, devicesStatusControllers.Devices);


module.exports = router