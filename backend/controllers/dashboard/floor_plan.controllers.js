const prisma = require("../../models/prisma/prisma");
const { check, validationResult } = require("express-validator");

const FloorPlanUpdate = async (req, res) => {
  try {
    // Validate input fields
    await check("name", "Name is required").notEmpty().run(req);
    await check("floor", "Floor is required").notEmpty().run(req);
    await check("img", "Img is required").notEmpty().run(req);
    await check("width", "Width is required").notEmpty().run(req);
    await check("height", "Height is required").notEmpty().run(req);

    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const id = Number(req.params.id);
    const { name, floor, img, width, height, description } = req.body;

    // Update floor plan
    const floorPlan = await prisma.floorPlan.update({
      where: { id: id },
      data: {
        name,
        floor,
        img,
        width,
        height,
        description,
      },
    });

    // Return the upserted floor plan
    return res.status(200).json(floorPlan);
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const FloorPlanRegister = async (req, res) => {
  try {
    // Validate input fields
    await check("name", "Name is required").notEmpty().run(req);
    await check("floor", "Floor is required").notEmpty().run(req);
    await check("img", "Img is required").notEmpty().run(req);
    await check("width", "Width is required").notEmpty().run(req);
    await check("height", "Height is required").notEmpty().run(req);

    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, floor, img, width, height, description } = req.body;

    // Upsert floor plan
    const floorPlan = await prisma.floorPlan.create({
      data: {
        name,
        floor,
        img,
        width,
        height,
        description,
      },
    });

    // Return the upserted floor plan
    return res.status(200).json(floorPlan);
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

const FloorPlanById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    function countDeviceStatus(floorPlan) {
      let online = 0;
      let offline = 0;
      let total = 0;

      if (!floorPlan.zone) {
        return { online, offline, total };
      }

      floorPlan.zone.forEach((device) => {
        if (device.ms_smoke) {
          total++;
          if (device.ms_smoke.online) {
            online++;
          } else {
            offline++;
          }
        }
      });

      return { online, offline, total };
    }

    const floorPlan = await prisma.floorPlan.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        floor: true,
        img: true,
        width: true,
        height: true,
        description: true,
        zone: {
          select: {
            room_id: true,
            name: true,
            description: true,
            location: true,
            x_axis: true,
            y_axis: true,
            img_url: true,
            ms_smoke: {
              select: {
                device_id: true,
                device_name: true,
                group_id: true,
                color: true,
                online: true,
                hub_id: true,
                smoke: {
                  select: {
                    device_id: true,
                    device_name: true,
                    ms_smoke: true,
                    temp: true,
                    signal: true,
                    battery_level: true,
                    temp_alarm: true,
                    temp_alarm_enable: true,
                    temp_diff_alarm_enable: true,
                    temp_high_diff_alarm: true,
                    co_alarm: true,
                    co_alarm_enable: true,
                    critical_co_alarm: true,
                    critical_smoke_alarm: true,
                    smoke_alarm: true,
                    steam_alarm: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!floorPlan) {
      return res.status(404).json({ message: "Floor plan not found" });
    }

    // Count device status
    const { online, offline, total } = countDeviceStatus(floorPlan);

    // Update floorPlan object with online, offline, and total counts
    floorPlan.online = online;
    floorPlan.offline = offline;
    floorPlan.total = total;

    // Update smoke alarms boolean values
    if (floorPlan.zone) {
      floorPlan.zone = floorPlan.zone.map((zoneItem) => {
        if (zoneItem.ms_smoke && zoneItem.ms_smoke.smoke) {
          zoneItem.ms_smoke.smoke.temp_alarm_bool =
            zoneItem.ms_smoke.smoke.temp_alarm === "TEMP_ALARM_NOT_DETECTED"
              ? false
              : true;
          zoneItem.ms_smoke.smoke.temp_high_diff_alarm_bool =
            zoneItem.ms_smoke.smoke.temp_high_diff_alarm ===
            "TEMP_HIGH_DIFF_ALARM_NOT_DETECTED"
              ? false
              : true;
          zoneItem.ms_smoke.smoke.co_alarm_bool =
            zoneItem.ms_smoke.smoke.co_alarm === "CO_ALARM_NOT_DETECTED"
              ? false
              : true;
          zoneItem.ms_smoke.smoke.smoke_alarm_bool =
            zoneItem.ms_smoke.smoke.smoke_alarm === "SMOKE_ALARM_NOT_DETECTED"
              ? false
              : true;
          zoneItem.ms_smoke.smoke.steam_alarm_bool =
            zoneItem.ms_smoke.smoke.steam_alarm === "STEAM_ALARM_NOT_DETECTED"
              ? false
              : true;
        }
        return zoneItem;
      });
    }

    return res.status(200).json(floorPlan);
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send(error);
  }
};

const FloorPlanNotify = async (req, res) => {
  try {
    const floorPlans = await prisma.floorPlan.findMany({
      select: {
        id: true,
        floor: true,
        notify: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    if (!floorPlans) {
      return res.status(404).json({ message: "Floor plan not found" });
    }

    return res.status(200).json(floorPlans);
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send(error);
  }
};

const FloorPlanNotifyUpdate = async (req, res) => {
  try {
    const id = Number(req.params.id);
    // Update the notify field to false for the given id
    const updatedFloorPlan = await prisma.floorPlan.update({
      where: { id: id },
      data: { notify: false },
    });
    return res.status(200).json({ notify: updatedFloorPlan.notify });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send(error);
  }
};

const FloorPlanNotifyById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    // Update the notify field to false for the given id
    const floorPlan = await prisma.floorPlan.findUnique({
      where: { id: id },
    });
    if (!floorPlan) {
      return res.status(404).json({ message: "Floor plan not found" });
    }
    return res.status(200).json({ notify: floorPlan.notify });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send(error);
  }
};

module.exports = {
  FloorPlanRegister,
  FloorPlanUpdate,
  FloorPlanById,
  FloorPlanNotify,
  FloorPlanNotifyUpdate,
  FloorPlanNotifyById,
};
