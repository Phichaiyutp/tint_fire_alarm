const express = require('express');
const router = express.Router();
const muteSmokeControllers = require("../../controllers/ajax/mute_smoke.controllers")

router.post('/:id', muteSmokeControllers.MuteSmokeById);

module.exports = router