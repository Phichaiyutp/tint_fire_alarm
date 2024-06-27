const prisma = require("../../models/prisma/prisma");
const axios = require("axios");
const {
  LoginInfo,
  Login,
} = require("./login.controllers");
require("dotenv").config();
const ajaxUrl = process.env.AJAX_URL;

const MuteSmokeById = async (req, res) => {
  try {
    let loginDetails = await LoginInfo();
    const device_id = req.params.id;

    const device = await prisma.AjaxMsSmoke.findUnique({
      where: {
        device_id: device_id,
      },
    });

    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    await axios
      .post(
        `${ajaxUrl}/api/user/${loginDetails.userId}/hubs/${device.hub_id}/devices/${device_id}/command`,
        {
          command: "MUTE",
          deviceType: "FireProtect2PlusSb",
        },
        {
          headers: {
            accept: "application/json",
            "X-Session-Token": loginDetails.sessionToken,
            "X-Api-Key": process.env.AJAX_API_KEY,
          },
        }
      )
      .then((data) => {
        return res.status(200).json({ message: "Device muted successfully" });
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          loginDetails = await Login();
          await axios
            .post(
              `${ajaxUrl}/api/user/${loginDetails.userId}/hubs/${device.hub_id}/devices/${device_id}/command`,
              {
                command: "MUTE",
                deviceType: "FireProtect2PlusSb",
              },
              {
                headers: {
                  accept: "application/json",
                  "X-Session-Token": loginDetails.sessionToken,
                  "X-Api-Key": process.env.AJAX_API_KEY,
                },
              }
            )
            .then(() => {
              return res
                .status(200)
                .json({ message: "Device muted successfully" });
            })
            .catch((error) => {
              console.error(error.response.data);
              return res.status(500).json(error.response.data);
            });
        } else if (error.response && error.response.status === 503) {
          console.error("Device offline:", error.message);
          return res.status(503).json({ error: "Device offline" });
        } else {
          console.error("Unexpected error:", error.message);
          return res
            .status(500)
            .json({ error: "An unexpected error occurred" });
        }
      });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send(error);
  }
};

module.exports = { MuteSmokeById };
