const prisma = require("../../models/prisma/prisma");
const axios = require("axios");
const {
  LoginInfo,
  Login,
} = require("./login.controllers");

require("dotenv").config();
const ajaxUrl = process.env.AJAX_URL;

const ZoneRegister = async (req, res) => {
  try {
    let loginDetails = await LoginInfo();
    //Test APIs
    await axios
      .get(`${ajaxUrl}/api/user/${loginDetails.userId}/hubs`, {
        headers: {
          accept: "application/json",
          "X-Session-Token": loginDetails.sessionToken,
          "X-Api-Key": process.env.AJAX_API_KEY,
        },
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          loginDetails = await Login();
        } else {
          console.error(error.response.data);
          if (res) {
            return res.status(500).json(error.response.data);
          }
        }
      });

    const hubs = await prisma.ajaxMsHub.findMany({
      where: {
        user_id: loginDetails.userId,
      },
    });

    if (hubs.length == 0) {
      if (res) {
        return res.status(404).send("No hubs found for user.");
      }
    }
    const updatedZone = [];
    for (const hub of hubs) {
      await axios
      .get(
        `${ajaxUrl}/api/user/${loginDetails.userId}/hubs/${hub.hub_id}/rooms`,
        {
          headers: {
            accept: "application/json",
            "X-Session-Token": loginDetails.sessionToken,
            "X-Api-Key": process.env.AJAX_API_KEY,
          },
        }
      )
      .then(async (response) => {
        const data = await response.data;
        for (const item of data) {
          const zoneData = {
            room_id: item.id,
            name: item.roomName,
            img_url: item.imageUrls?.big,
          };
          const newZone = await prisma.zone.upsert({
            where: { room_id: item.id },
            update: {
              name: item.roomName,
              img_url: item.imageUrls?.big,
            },
            create: zoneData,
          });
          updatedZone.push(newZone);
        }
      })
      .catch((error) => {
        console.error(error.response.data);
        if (res) {
          return res.status(500).json(error.response.data);
        }
      });
    }
    if (res) {
      return res.status(201).json(updatedZone);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    if (res) {
      return res.status(500).send(error);
    }
  }
};

const ZoneAll = async (req, res, next) => {
  try {
    const zones = await prisma.zone.findMany();
    return res.json(zones);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const ZoneById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const zone = await prisma.zone.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!zone) {
      return res.status(404).json({ message: "Zone not found" });
    }
    return res.json(zone);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = { ZoneRegister, ZoneAll, ZoneById };
