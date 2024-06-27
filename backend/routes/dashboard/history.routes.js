const express = require('express');
const router = express.Router();
const historyControllers = require("../../controllers/dashboard/history.controllers")
const authMiddleware = require("../../middleware/auth")

router.get('/',authMiddleware, historyControllers.History);


module.exports = router