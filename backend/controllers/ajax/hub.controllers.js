const prisma = require("../../models/prisma/prisma");
const axios = require("axios");
const {
  LoginInfo,
  Login,
} = require("./login.controllers");
require("dotenv").config();
const ajaxUrl = process.env.AJAX_URL;

const HubRegister = async (req, res, next) => {
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

    if (hubs.length === 0) {
      if (res) {
        return res.status(404).send("No hubs found for user.");
      }
    }

    const updatedHubs = [];
    for (const hub of hubs) {
      await axios
        .get(`${ajaxUrl}/api/user/${loginDetails.userId}/hubs/${hub.hub_id}`, {
          headers: {
            accept: "application/json",
            "X-Session-Token": loginDetails.sessionToken,
            "X-Api-Key": process.env.AJAX_API_KEY,
          },
        })
        .then(async (response) => {
          const data = response.data;
          const hubData = {
            hub_id: hub.hub_id,
            name: data.name,
            cellular_signal: data.gsm.signalLevel,
            connection: !data.connectionLostAsMalfunction,
            battery_level: data.battery.chargeLevelPercentage,
            battery_state: data.battery.state,
            ethernet_ip: data.ethernet.ip,
            ethernet_subnet: data.ethernet.mask,
            ethernet_gateway: data.ethernet.gate,
            ethernet_dns: data.ethernet.dns,
            sim1_number: data.gsm.simCards[0].number,
            sim2_number: data.gsm.simCards[1].number,
            active_sim_card: data.gsm.activeSimCard,
            average_noise: data.noiseLevel.avgValueDataChannel,
          };

          const updatedHub = await prisma.ajaxHub.upsert({
            where: { hub_id: hub.hub_id },
            update: hubData,
            create: hubData,
          });

          updatedHubs.push(updatedHub);
        })
        .catch(async (error) => {
          console.error(error.response.data);
          if (res) {
            return res.status(500).json(error.response.data);
          }
        });
    }
    if (res) {
      return res.status(201).json(updatedHubs);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send(error);
  }
};

const HubAll = async (req, res, next) => {
  try {
    const hubs = await prisma.ajaxHub.findMany();
    return res.json(hubs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const HubById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const hub = await prisma.ajaxHub.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!hub) {
      return res.status(404).json({ message: "Hub not found" });
    }
    return res.json(hub);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
module.exports = { HubRegister, HubAll, HubById };
