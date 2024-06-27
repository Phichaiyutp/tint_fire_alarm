const express = require('express');
const router = express.Router();
const zoneControllers = require("../../controllers/ajax/zone.controllers")

router.get('/:id', zoneControllers.ZoneById);
router.get('/', zoneControllers.ZoneAll);
router.post('/', zoneControllers.ZoneRegister);



module.exports = router