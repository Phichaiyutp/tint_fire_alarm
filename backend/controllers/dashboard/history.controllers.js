const prisma = require("../../prisma/prisma");
const { format } = require("date-fns");

const History = async (req, res) => {
  try {
    const filter = req.query.filter || "";
    const search = req.query.search || "";
    const sort = req.query.sort || "desc";
    
    //console.log(filter,search,sort)
    const event_code = getEventCodes(filter);
    const whereCondition = filter
      ? {
          OR: [
            event_code.length > 0 ? { event_code: { in: event_code } } : {},
            search
              ? { description: { contains: search, mode: "insensitive" } }
              : {},
          ],
        }
      : search
      ? { description: { contains: search, mode: "insensitive" } }
      : {};

    const data = await prisma.smokeEventCode.findMany({
      where: whereCondition,
      include: {
        smoke: true,
      },
      orderBy: {
        timestamp: sort,
      },
      take: 5000,
    });

    const payload = await Promise.all(
      data.map(async (item) => {
        const formattedDate = formatDate(item.timestamp);
        const zone_name = await getZoneName(item.device_id);

        return {
          id: item.id,
          device_name: item.device_name,
          description: item.description,
          zone_name: zone_name,
          datetime: formattedDate,
        };
      })
    );
    return res.status(200).json(payload);
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send(error);
  }
};

function getEventCodes(filter) {
  switch (filter) {
    case "high_temp":
      return [
        "M_03_22",
        "M_03_23",
        "M_03_2A",
        "M_03_2B",
        "M_03_32",
        "M_03_33",
        "M_03_34",
        "M_03_35",
        "M_4D_22",
        "M_4D_23",
        "M_4D_2A",
        "M_4D_2B",
        "M_4D_33",
        "M_4D_34",
        "M_4D_35",
        "M_4D_3D",
        "M_4D_3E",
      ];
    case "smoke":
      return ["M_03_20", "M_4D_2D"];
    case "co":
      return ["M_4D_30", "M_4D_3C"];
    case "signal_loss":
      return ["M_28_04"];
    default:
      return [];
  }
}

async function getZoneName(device_id) {
  const ajaxMsSmoke = await prisma.ajaxMsSmoke.findUnique({
    where: { device_id },
    include: { zone: true },
  });
  return ajaxMsSmoke?.zone?.name || null;
}

function formatDate(timestamp) {
  const date = new Date(parseInt(BigInt(timestamp)));
  return format(date, "yyyy-MM-dd HH:mm:ss zzz");
}

module.exports = {
  History,
};
