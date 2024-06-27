const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");
const prisma = require("../../models/prisma/prisma");
require("dotenv").config();

const jwtSecret = process.env.JWT_SECRET;
const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
const tokenExpiration = process.env.TOKEN_EXPIRATION;
const refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION;

const signup = async (req, res) => {
  await check("email", "Email is not valid").isEmail().run(req);
  await check("password", "Password must be at least 6 characters long")
    .isLength({ min: 6 })
    .run(req);
  await check("name", "Name is required").notEmpty().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, name, image } = req.body;
  const hashedPassword = crypto.SHA256(password).toString();

  try {
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword, // Storing hashed password
        roleId: 1,
        groupId: 1,
        image: image,
      },
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ error: "User registration failed", details: error.message });
  }
};


const signin = async (req, res) => {
  await check("email", "Email is not valid").isEmail().run(req);
  await check("password", "Password is required").notEmpty().run(req);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  const hashedPassword = crypto.SHA256(password).toString(); // Hashing input password

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.password !== hashedPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = jwt.sign({ email: user.email }, jwtSecret, {
    expiresIn: tokenExpiration,
  });
  const refreshToken = jwt.sign({ email: user.email }, jwtRefreshSecret, {
    expiresIn: refreshTokenExpiration,
  });

  res.json({ accessToken, refreshToken });
};


const userProfile = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    await check("name", "Name is required").notEmpty().run(req);
    await check("image", "Image is required").notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const email = req.user.email;
    const { name, image } = req.body;

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name,
        image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    if (error.code === "P2025") {
      // Prisma error code for record not found
      res.status(404).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

const refreshToken = (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, jwtRefreshSecret, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwt.sign({ email: user.email }, jwtSecret, {
      expiresIn: tokenExpiration,
    });
    res.json({ accessToken });
  });
};

module.exports = {
  userProfile,
  updateUserProfile,
  signup,
  signin,
  refreshToken,
};
