const prisma = require("../../models/prisma/prisma");
const arraySort = require('array-sort');

const SelfTestById = async (req, res) => {
  try {
    const search = req.query.search || "";
    const id = Number(req.params.id);
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
              },
            },
          },
        },
      },
    });

    if (!floorPlan) {
      return Response.json({ error: "Floor plan not found" }, { status: 404 });
    } else {
      const output = [];
      for (const zoneItem of floorPlan.zone) {
        if (!zoneItem.ms_smoke) {
          continue;
        }
        const item = {
          site_name: floorPlan.name,
          device_id: zoneItem.ms_smoke.device_id,
          device_name: zoneItem.ms_smoke.device_name,
          online: zoneItem.ms_smoke.online,
        };
        output.push(item);
      }

      const sortName = req.query.sortName || "";
      const sort = req.query.sort || "desc";

      let payload = [];
      switch (sortName) {
        case "device_name":
          payload = arraySort(output, "device_name", {
            reverse: sort === "desc",
          });
          break;
        case "status":
          payload = arraySort(output, "online", {
            reverse: sort === "desc",
          });
          break;
        case "site_name":
          payload = arraySort(output, "site_name", {
            reverse: sort === "desc",
          });
          break;
        default:
          payload = output;
          break;
      }
      return res.status(200).json(payload);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send(error);
  }
};

module.exports = {
  SelfTestById,
};