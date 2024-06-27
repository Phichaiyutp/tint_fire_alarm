const express = require('express');
const router = express.Router();
const selfTestControllers = require("../../controllers/dashboard/self_test.controllers")
const authMiddleware = require("../../middleware/auth")

router.get('/:id',authMiddleware, selfTestControllers.SelfTestById);


module.exports = router