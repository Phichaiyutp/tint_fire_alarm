const express = require('express');
const router = express.Router();
const masterSmokeControllers = require("../../controllers/ajax/master_smoke.controllers")

router.get('/:id', masterSmokeControllers.MasterSmokeById);
router.get('/', masterSmokeControllers.MasterSmokeAll);
router.post('/', masterSmokeControllers.MasterSmokeRegister);

module.exports = router