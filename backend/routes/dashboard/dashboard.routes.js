const express = require("express");
const router = express.Router();

const devicesStatusRouter = require("./devices_status.routes");
const floorPlanRouter = require("./floor_plan.routes");
const historyRouter = require("./history.routes");
const maintenanceRouter = require("./maintenance.routes");
const self_testRouter = require("./self_test.routes");

// Use the specific routers
router.use("/devicestatus", devicesStatusRouter);
router.use("/floorplan", floorPlanRouter);
router.use("/history", historyRouter);
router.use("/maintenance", maintenanceRouter);
router.use("/selftest", self_testRouter);


module.exports = router;
