const prisma = require("../../prisma/prisma");
const axios = require("axios");
const {
  LoginInfo,
  Login,
} = require("./login.controllers");
require("dotenv").config();
const ajaxUrl = process.env.AJAX_URL;

const MasterSmokeRegister = async (req, res) => {
  try {
    let loginDetails = await LoginInfo();
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
          await axios
            .get(`${ajaxUrl}/api/user/${loginDetails.userId}/hubs`, {
              headers: {
                accept: "application/json",
                "X-Session-Token": loginDetails.sessionToken,
                "X-Api-Key": process.env.AJAX_API_KEY,
              },
            })
            .catch((error) => {
              console.error(error.response.data);
              if (res) {
                return res.status(500).json(error.response.data);
              }
            });
        } else {
          console.error("Unexpected error:", error.message);
          if (res) {
            return res
              .status(500)
              .json({ error: "An unexpected error occurred" });
          }
        }
      });

    const hubs = await prisma.ajaxMsHub.findMany({
      where: {
        user_id: loginDetails.userId,
      },
    });

    if (hubs.length === 0) {
      if (res) {
        return res.status(404).json({ message: "No hubs found for user." });
      }
    }

    for (const hub of hubs) {
      await axios
        .get(
          `${ajaxUrl}/api/user/${loginDetails.userId}/hubs/${hub.hub_id}/devices`,
          {
            headers: {
              accept: "application/json",
              "X-Session-Token": loginDetails.sessionToken,
              "X-Api-Key": process.env.AJAX_API_KEY,
            },
          }
        )
        .then(async (response) => {
          const payload = [];
          const updatedMsSmokes = [];
          for (const item of response.data) {
            // Process and update smoke detector devices
            if (item.deviceType == "FireProtect2PlusSb") {
              const deviceData = {
                device_id: item.id,
                device_type: item.deviceType,
                device_name: item.deviceName,
                room_id: item.roomId,
                group_id: item.groupId,
                color: item.color,
                online: item.online,
                hub_id: hub.hub_id,
              };

              const updatedMsSmoke = await prisma.ajaxMsSmoke.upsert({
                where: { device_id: item.id },
                update: deviceData,
                create: deviceData,
              });
              payload.push(updatedMsSmoke);
            }
          }
          updatedMsSmokes.push({ hub_id: hub.hub_id, MsSmoke: payload });
          if (res) {
            return res.status(201).json(updatedMsSmokes);
          }
        })
        .catch((error) => {
          console.error(error.response.data);
          if (res) {
            return res.status(500).json(error.response.data);
          }
        });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    if (res) {
      return res.status(500).send(error);
    }
  }
};

const MasterSmokeAll = async (req, res) => {
  try {
    const hubs = await prisma.ajaxMsSmoke.findMany();
    return res.json(hubs);
  } catch (error) {
    console.error("Error fetching hubs:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching hubs" });
  }
};

const MasterSmokeById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const hub = await prisma.ajaxMsSmoke.findUnique({
      where: {
        id,
      },
    });
    if (!hub) {
      return res.status(404).json({ message: "Hub not found" });
    }
    return res.json(hub);
  } catch (error) {
    console.error("Error fetching hub:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the hub" });
  }
};

module.exports = { MasterSmokeRegister, MasterSmokeAll, MasterSmokeById };
