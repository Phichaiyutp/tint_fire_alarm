const express = require('express');
const router = express.Router();
const smokeControllers = require("../../controllers/ajax/smoke.controllers")

router.get('/:id', smokeControllers.SmokeById);
router.get('/', smokeControllers.SmokeAll);
router.post('/', smokeControllers.SmokeRegister);

module.exports = router