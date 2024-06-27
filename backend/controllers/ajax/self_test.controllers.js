const prisma = require("../../models/prisma/prisma");
const axios = require("axios");
const {
  LoginInfo,
  Login,
} = require("./login.controllers");
require("dotenv").config();
const ajaxUrl = process.env.AJAX_URL;

const SelfTestSmokeById = async (req, res) => {
  try {
    let loginDetails = await LoginInfo();
    const device_id = req.params.id;
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
          return res.status(500).json(error.response.data);
        }
      });

    const device = await prisma.AjaxMsSmoke.findUnique({
      where: {
        device_id: device_id,
      },
    });

    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    await axios
      .put(
        `${ajaxUrl}/api/user/${loginDetails.userId}/hubs/${device.hub_id}/commands/arming`,
        {
          command: "DISARM",
          ignoreProblems: true,
        },
        {
          headers: {
            accept: "application/json",
            "X-Session-Token": loginDetails.sessionToken,
            "X-Api-Key": process.env.AJAX_API_KEY,
          },
        }
      )
      .then(async (response) => {
        await axios
          .post(
            `${ajaxUrl}/api/user/${loginDetails.userId}/hubs/${device.hub_id}/devices/${device_id}/command`,
            {
              command: "SELF_TEST",
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
          .then(async (response) => {
            await axios
              .post(
                `${ajaxUrl}/api/user/${loginDetails.userId}/hubs/${device.hub_id}/commands/arming`,
                {
                  command: "DISARM",
                  ignoreProblems: true,
                },
                {
                  headers: {
                    accept: "application/json",
                    "X-Session-Token": loginDetails.sessionToken,
                    "X-Api-Key": process.env.AJAX_API_KEY,
                  },
                }
              )
              .then(async (response) => {
                return res
                  .status(200)
                  .json({ message: "Self-test successfully" });
              })
              .catch((error) => {
                console.error(error.response.data);
                return res.status(500).json(error.response.data);
              });
          })
          .catch((error) => {
            console.error(error.response.data);
            return res.status(500).json(error.response.data);
          });
      })
      .catch((error) => {
        console.error(error.response.data);
        return res.status(500).json(error.response.data);
      });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send(error);
  }
};

const SelfTestSmokeAll = async (req, res) => {
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
          return res.status(500).json(error.response.data);
        }
      });

    const hubs = await prisma.ajaxMsHub.findMany({
      where: {
        user_id: loginDetails.userId,
      },
    });

    if (hubs.length === 0) {
      return res.status(404).send("No hubs found for user.");
    }
    for (const hub of hubs) {
      const devices = await prisma.ajaxMsSmoke.findMany({
        where: {
          hub_id: hub.hub_id,
        },
      });
      if (devices.length === 0) {
        return res.status(404).json({ error: "Device not found" });
      }
      for (const device of devices) {
        await axios
          .get(
            `${ajaxUrl}/api/user/${loginDetails.userId}/hubs/${device.hub_id}/commands/arming`,
            {
              command: "DISARM",
              ignoreProblems: true,
            },
            {
              headers: {
                accept: "application/json",
                "X-Session-Token": loginDetails.sessionToken,
                "X-Api-Key": process.env.AJAX_API_KEY,
              },
            }
          )
          .then(async (response) => {
            console.log(response.data)
          })
        await axios
          .put(
            `${ajaxUrl}/api/user/${loginDetails.userId}/hubs/${device.hub_id}/commands/arming`,
            {
              command: "DISARM",
              ignoreProblems: true,
            },
            {
              headers: {
                accept: "application/json",
                "X-Session-Token": loginDetails.sessionToken,
                "X-Api-Key": process.env.AJAX_API_KEY,
              },
            }
          )
          .then(async (response) => {
            await axios
              .post(
                `${ajaxUrl}/api/user/${loginDetails.userId}/hubs/${device.hub_id}/devices/${device.device_id}/command`,
                {
                  command: "SELF_TEST",
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
              .then(async (response) => {
                await axios
                  .post(
                    `${ajaxUrl}/api/user/${loginDetails.userId}/hubs/${device.hub_id}/commands/arming`,
                    {
                      command: "DISARM",
                      ignoreProblems: true,
                    },
                    {
                      headers: {
                        accept: "application/json",
                        "X-Session-Token": loginDetails.sessionToken,
                        "X-Api-Key": process.env.AJAX_API_KEY,
                      },
                    }
                  )
                  .then(async (response) => {
                    return res
                      .status(200)
                      .json({ message: "Self-test successfully" });
                  })
                  .catch((error) => {
                    console.error(error.response.data);
                    return res.status(500).json(error.response.data);
                  });
              })
              .catch((error) => {
                console.error(error.response.data);
                return res.status(500).json(error.response.data);
              });
          })
          .catch((error) => {
            console.error(error.response.data);
            return res.status(500).json(error.response.data);
          });
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send(error);
  }
};

module.exports = { SelfTestSmokeById, SelfTestSmokeAll };
