/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error or user registration failed
 */

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Authenticate user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                 refreshToken:
 *                   type: string
 *       400:
 *         description: Validation error or invalid credentials
 */


const express = require('express');
const authControllers = require('../../controllers/auth/auth.controllers');
const { check } = require('express-validator');
const router = express.Router();

const authMiddleware = require("../../middleware/auth")

router.get('/user',authMiddleware, authControllers.userProfile);
router.put('/user',authMiddleware, authControllers.updateUserProfile);

router.post('/signup', [
  check('email', 'Email is not valid').isEmail(),
  check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  check('name', 'Name is required').notEmpty()
], authControllers.signup);

router.post('/signin', [
  check('email', 'Email is not valid').isEmail(),
  check('password', 'Password is required').notEmpty()
], authControllers.signin);

router.post('/refreshtoken', authControllers.refreshToken);

module.exports = router;