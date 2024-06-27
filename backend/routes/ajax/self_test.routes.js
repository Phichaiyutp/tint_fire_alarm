const express = require('express');
const router = express.Router();
const selfTestSmokeControllers = require("../../controllers/ajax/self_test.controllers")

router.post('/:id', selfTestSmokeControllers.SelfTestSmokeById);
router.post('/', selfTestSmokeControllers.SelfTestSmokeAll);

module.exports = router