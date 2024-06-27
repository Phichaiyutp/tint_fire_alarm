const express = require('express');
const router = express.Router();
const masterHubControllers = require("../../controllers/ajax/master_hub.controllers")

router.get('/:id', masterHubControllers.MasterHubById);
router.get('/', masterHubControllers.MasterHubAll);
router.post('/', masterHubControllers.MasterHubRegister);



module.exports = router