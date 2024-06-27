const express = require('express');
const router = express.Router();
const eventLogControllers = require("../../controllers/ajax/event_log.controllers")

router.post('/', eventLogControllers.EventLogger);


module.exports = router