const prisma = require("../../models/prisma/prisma");

const Devices = async (req, res) => {
  try {
    const floorPlan = await prisma.floorPlan.findMany({
        select: {
          name: true,
          zone: {
            select: {
              ms_smoke: {
                select: {
                  device_id: true,
                  device_name: true,
                  online: true,
                },
              },
            },
          },
        },
      });
  
      if (!floorPlan || floorPlan.length === 0) {
        return res.status(404).json({ message: "No data available"});
      }
  
      function countDeviceStatus(floorPlans) {
        let online = 0;
        let offline = 0;
        let total = 0;
  
        floorPlans.forEach((floorPlan) => {
          if (!floorPlan.zone) {
            return;
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
        });
  
        return { online, offline, total };
      }
  
      return res.status(200).json(countDeviceStatus(floorPlan));
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send(error);
  }
};


module.exports = {Devices}