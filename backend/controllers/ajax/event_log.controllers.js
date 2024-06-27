const prisma = require("../../prisma/prisma");

const EventLogger = async (req, res, next) => {
  try {
    const {
      eventId,
      eventCode,
      sourceObjectId,
      sourceObjectName,
      sourceObjectType,
      hubName,
      hub_id,
      sourceRoomName,
      timestamp,
      msg,
    } = await req.body;
    let createdEvent;
    if (sourceObjectType === "FIRE_PROTECT_2_BASE" && eventId) {
      createdEvent = await prisma.smokeEventCode.upsert({
        where: {
          event_id: eventId,
        },
        update: {},
        create: {
          event_code: eventCode,
          event_id: eventId,
          device_id: sourceObjectId,
          device_name: sourceObjectName,
          timestamp: timestamp,
          description: msg,
        },
      });

      const ajaxMsSmoke = await prisma.ajaxMsSmoke.findUnique({
        where: { device_id: sourceObjectId },
        include: { zone: true },
      });

      if (ajaxMsSmoke && ajaxMsSmoke.zone) {
        await prisma.floorPlan.update({
          where: {
            id: ajaxMsSmoke.zone.floor_plan_id,
          },
          data: {
            notify: true,
          },
        });
      }
    } else if (sourceObjectType === "HUB" && eventId) {
      const hubExists = await prisma.ajaxHub.findUnique({
        where: {
          hub_id: sourceObjectId,
        },
      });
      if (hubExists) {
        createdEvent = await prisma.hubEventCode.upsert({
          where: {
            event_id: eventId,
          },
          update: {},
          create: {
            event_code: eventCode,
            event_id: eventId,
            hub_id: sourceObjectId,
            hub_name: sourceObjectName,
            timestamp: timestamp,
            description: msg,
          },
        });
      }
    } else if (sourceObjectType === "USER" && eventId) {
      console.log(hub_id)
/*       const userExists = await prisma.ajaxUser.findUnique({
        where: {
          user_id: sourceObjectId,
        },
      });

      const hubExists = await prisma.ajaxHub.findUnique({
        where: {
          hub_id: hub_id,
        },
      });
      if (userExists & hubExists) {
        createdEvent = await prisma.userEventCode.upsert({
          where: {
            event_id: eventId,
          },
          update: {},
          create: {
            event_code: eventCode,
            event_id: eventId,
            hub_id: hub_id, 
            user_id: sourceObjectId,
            name: sourceObjectName,
            timestamp: timestamp,
            description: msg,
            additionalData: "",
          },
        });
      } */
    }
    if (createdEvent && createdEvent.timestamp) {
      createdEvent.timestamp = createdEvent.timestamp.toString();
    }
    return res.status(200).json(createdEvent);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {EventLogger};
