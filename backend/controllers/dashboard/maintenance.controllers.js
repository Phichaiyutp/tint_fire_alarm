const prisma = require("../../models/prisma/prisma");
const { format } = require("date-fns");
const arraySort = require('array-sort');

const MaintenanceById = async (req, res) => {
  try {
    const search = req.query.search || "";
    const id = Number(req.params.id);


    function formatLifeTime(duration) {
      const days = Math.floor(duration / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      return `${days}D-${hours}H-${minutes}M`;
    }

    const floorPlan = await prisma.floorPlan.findFirst({
      where: {
        id: id,
      },
      select: {
        name: true,
        zone: {
          select: {
            ms_smoke: {
              where: {
                device_name: { contains: search, mode: "insensitive" },
              },
              select: {
                id: true,
                device_id: true,
                device_name: true,
                online: true,
                smoke: {
                  select: {
                    battery_level: true,
                    installation_date: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (floorPlan) {
      const output = [];

      for (const zoneItem of floorPlan.zone) {
        if (!zoneItem.ms_smoke) {
          continue;
        }
        const { smoke } = zoneItem.ms_smoke;

        if (!smoke) {
          return Response.json({ error: "Smoke not found" }, { status: 404 });
        }

        const installation_date = format(
          new Date(parseInt(smoke.installation_date) * 1000),
          "yyyy-MM-dd HH:mm:ss"
        );
        const life_time = Date.now() - parseInt(smoke.installation_date) * 1000;
        const formattedLifeTime = formatLifeTime(life_time);

        const item = {
          site_name: floorPlan.name,
          device_id: zoneItem.ms_smoke.device_id,
          device_name: zoneItem.ms_smoke.device_name,
          online: zoneItem.ms_smoke.online,
          battery_level: smoke.battery_level,
          installation_date,
          life_time,
          life_time_date: formattedLifeTime,
        };
        output.push(item);
      }

      const sortName = req.query.sortName || "";
      const sort = req.query.sort || "desc";

      let payload = [];
      switch (sortName) {
        case "device_name":
          payload = arraySort(output, "device_name", {
            reverse: sort === "desc" ? true : false,
          });
          break;
        case "status":
          payload = arraySort(output, "online", {
            reverse: sort === "desc" ? true : false,
          });
          break;
        case "site_name":
          payload = arraySort(output, "site_name", {
            reverse: sort === "desc" ? true : false,
          });
          break;
        case "battery_level":
          payload = arraySort(output, "battery_level", {
            reverse: sort === "desc" ? true : false,
          });
          break;
        case "life_time":
          payload = arraySort(output, "life_time", {
            reverse: sort === "desc" ? true : false,
          });
          break;
        default:
          payload = output;
          break;
      }
      return res.status(200).json(payload);
    } else {
      return res.status(500).json({ error: "Floor plan not found" });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send(error);
  }
};


module.exports = {
    MaintenanceById,
  };
  