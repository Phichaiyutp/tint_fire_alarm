const prisma = require("../../models/prisma/prisma");
const axios = require("axios");
const { LoginInfo, Login } = require("./login.controllers");
require("dotenv").config();
const ajaxUrl = process.env.AJAX_URL;

const SmokeRegister = async (req, res) => {
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
    const updatedSmokes = [];

    for (const hub of hubs) {
      const hub_id = hub.hub_id;
      const devices = await prisma.ajaxMsSmoke.findMany({
        where: {
          hub_id: hub_id,
        },
      });

      for (const device of devices) {
        const user_id = loginDetails.userId;
        const device_id = device.device_id;
        await axios
          .get(
            `${ajaxUrl}/api/user/${user_id}/hubs/${hub_id}/devices/${device.device_id}`,
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
            const deviceData = {
              device_id: data.id,
              device_name: data.deviceName,
              temp: data.temperature,
              signal: data.signalLevel,
              battery_level: data.batteryChargeLevelPercentage,
              temp_alarm: data.tempAlarm,
              temp_alarm_enable: data.tempAlarmEnable,
              temp_diff_alarm_enable: data.tempDiffAlarmEnable,
              temp_high_diff_alarm: data.tempHighDiffAlarm,
              co_alarm: data.coAlarm,
              co_alarm_enable: data.coAlarmEnable,
              critical_co_alarm: data.criticalCoAlarm,
              critical_smoke_alarm: data.criticalSmokeAlarm,
              smoke_alarm: data.smokeAlarm,
              steam_alarm: data.steamAlarm,
            };

            const updatedSmoke = await prisma.ajaxSmoke.upsert({
              where: { device_id: device_id },
              update: deviceData,
              create: deviceData,
            });
            updatedSmokes.push(updatedSmoke);
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
      }
    }
    const payloads = updatedSmokes.map(smoke => {
      if (smoke.installation_date) {
        return {
          ...smoke,
          installation_date: smoke.installation_date.toString(),
        };
      } else {
        return { ...smoke };
      }
    });
    if (res) {
      return res.status(200).json(payloads);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    if (res) {
      return res.status(500).send(error);
    }
  }
};

const SmokeAll = async (req, res, next) => {
  try {
    let smokes = await prisma.ajaxSmoke.findMany();
    const payloads = smokes.reduce((acc, smoke) => {
      const payload = {
        ...smoke,
        installation_date: smoke.installation_date.toString(),
      };
      acc.push(payload);
      return acc;
    }, []);
    return res.status(200).json(payloads);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const SmokeById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let smoke = await prisma.ajaxSmoke.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!smoke) {
      return res.status(404).json({ message: "Smoke not found" });
    }
    if (smoke.installation_date) {
      smoke.installation_date = smoke.installation_date.toString();
    }

    return res.status(200).json(smoke);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { SmokeRegister, SmokeAll, SmokeById };
