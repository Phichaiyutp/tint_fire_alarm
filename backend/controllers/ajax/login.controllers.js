const { writeFileSync,readFileSync } = require("fs");
const axios = require("axios");
const prisma = require("../../models/prisma/prisma");
const ajaxKeyPath = require.resolve("../../config/ajax.config.json");
require("dotenv").config();
const ajaxUrl = process.env.AJAX_URL;

const Login = async () => {
  try {
    const data = await prisma.ajaxUser.findUnique({
      where: {
        id: 1,
      },
    });

    if (!data) {
      throw new Error("User not found");
    }

    const response = await axios.post(
      `${ajaxUrl}/api/login`,
      {
        login: data.email,
        passwordHash: data.password,
        userRole: data.user_role,
      },
      {
        headers: {
          accept: "application/json",
          "X-Api-Key": process.env.AJAX_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      console.log("Failed to authenticate");
      return { error: "Failed to authenticate" };
    }

    const responseData = response.data;
    writeFileSync(ajaxKeyPath, JSON.stringify(responseData, null, 2));
    return responseData;
  } catch (error) {
    console.error("Error:", error);
    return { error: error.message };
  }
};

const LoginInfo = async () => {
  try {
    const ajaxConfig = await readFileSync(ajaxKeyPath, "utf-8");
    const data = JSON.parse(ajaxConfig);
    return data;
  } catch (error) {
    console.error("Error:", error);
    return { error: error.message };
  }
};


module.exports = { Login, LoginInfo };
