const express = require("express");
const router = express.Router();

const eventLogRouter = require("./event_log.routes");
const hubRouter = require("./hub.routes");
const masterHubRouter = require("./master_hub.routes");
const masterSmokeRouter = require("./master_smoke.routes");
const muteSmokeRouter = require("./mute_smoke.routes");
const selfTestSmokeRouter = require("./self_test.routes");
const smokeRouter = require("./smoke.routes");
const zoneRouter = require("./zone.routes");

// Use the specific routers
router.use("/eventlog", eventLogRouter);
router.use("/hub", hubRouter);
router.use("/masterhub", masterHubRouter);
router.use("/mastersmoke", masterSmokeRouter);
router.use("/mutesmoke", muteSmokeRouter);
router.use("/selftest", selfTestSmokeRouter);
router.use("/smoke", smokeRouter);
router.use("/zone", zoneRouter);

module.exports = router;
