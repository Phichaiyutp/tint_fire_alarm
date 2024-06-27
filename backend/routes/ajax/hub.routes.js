const express = require('express');
const router = express.Router();
const hubControllers = require("../../controllers/ajax/hub.controllers")

router.get('/:id', hubControllers.HubById);
router.get('/', hubControllers.HubAll);
router.post('/', hubControllers.HubRegister);


module.exports = router