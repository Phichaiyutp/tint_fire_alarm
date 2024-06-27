const prisma = require("../../prisma/prisma");
const axios = require("axios");
const {
  LoginInfo,
  Login,
} = require("./login.controllers");
require("dotenv").config();
const ajaxUrl = process.env.AJAX_URL;

const MasterHubRegister = async (req, res) => {
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
      .then(async (response) => {
        const data = response.data;
        const payload = await Promise.all(
          data.map(async (item) => {
            return await prisma.ajaxMsHub.upsert({
              where: { hub_id: item.hubId },
              update: {
                hub_binding_role: item.hubBindingRole,
                user_id: loginDetails.userId,
              },
              create: {
                hub_id: item.hubId,
                hub_binding_role: item.hubBindingRole,
                user_id: loginDetails.userId,
              },
            });
          })
        );
        if (res) {
          return res.status(201).json(payload);
        }
      })
      .catch(async (error) => {
        if (error.response && error.response.status === 401) {
          await Login();
          loginDetails = await LoginInfo();
          await axios
            .get(`${ajaxUrl}/api/user/${loginDetails.userId}/hubs`, {
              headers: {
                accept: "application/json",
                "X-Session-Token": loginDetails.sessionToken,
                "X-Api-Key": process.env.AJAX_API_KEY,
              },
            })
            .then(async (response) => {
              const data = response.data;
              const payload = await Promise.all(
                data.map(async (item) => {
                  return await prisma.ajaxMsHub.upsert({
                    where: { hub_id: item.hubId },
                    update: {
                      hub_binding_role: item.hubBindingRole,
                      user_id: loginDetails.userId,
                    },
                    create: {
                      hub_id: item.hubId,
                      hub_binding_role: item.hubBindingRole,
                      user_id: loginDetails.userId,
                    },
                  });
                })
              );
              if (res) {
                return res.status(201).json(payload);
              }
            })
            .catch(async (error) => {
              console.error(error.response.data);
              return res.status(500).json(error.response.data);
            });
        } else {
          console.error(error.response.data);
          return res.status(500).json(error.response.data);
        }
      });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).send(error);
  }
};

const MasterHubAll = async (req, res) => {
  try {
    const hubs = await prisma.ajaxMsHub.findMany();
    return res.json(hubs);
  } catch (error) {
    console.error("Error fetching hubs:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching hubs" });
  }
};

const MasterHubById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const hub = await prisma.ajaxMsHub.findUnique({
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

module.exports = { MasterHubRegister, MasterHubAll, MasterHubById };
