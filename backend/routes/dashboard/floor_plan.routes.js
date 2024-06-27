/**
 * @swagger
 * /api/dashboard/floorplan:
 *   post:
 *     summary: Register a floor plan
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - FloorPlans
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - floor
 *               - img
 *               - width
 *               - height
 *             properties:
 *               name:
 *                 type: string
 *               floor:
 *                 type: string
 *               img:
 *                 type: string
 *               width:
 *                 type: integer
 *               height:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Floor plan created or updated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 * 
 * /api/dashboard/floorplan/{id}:
 *   get:
 *     summary: View a specific floor plan by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - FloorPlans
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the floor plan to view
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Floor plan retrieved successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 * 
 *   put:
 *     summary: Update a specific floor plan by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - FloorPlans
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the floor plan to update
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - floor
 *               - img
 *               - width
 *               - height
 *             properties:
 *               name:
 *                 type: string
 *               floor:
 *                 type: string
 *               img:
 *                 type: string
 *               width:
 *                 type: integer
 *               height:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Floor plan updated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 * 
 * /api/dashboard/floorplan/notify:
 *   get:
 *     summary: View all floor plan notifications
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - FloorPlans
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 * 
 * /api/dashboard/floorplan/notify/{id}:
 *   get:
 *     summary: View notifications for a specific floor plan by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - FloorPlans
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the floor plan to view notifications
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 * 
 *   put:
 *     summary: Update notifications for a specific floor plan by ID
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - FloorPlans
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the floor plan to update notifications
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - notificationField1
 *               - notificationField2
 *             properties:
 *               notificationField1:
 *                 type: string
 *               notificationField2:
 *                 type: string
 *     responses:
 *       200:
 *         description: Notifications updated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */

const express = require('express');
const router = express.Router();
const floorPlanControllers = require("../../controllers/dashboard/floor_plan.controllers");
const authMiddleware = require("../../middleware/auth");

router.get('/notify/:id', authMiddleware, floorPlanControllers.FloorPlanNotifyById);
router.put('/notify/:id', authMiddleware, floorPlanControllers.FloorPlanNotifyUpdate);
router.get('/notify', authMiddleware, floorPlanControllers.FloorPlanNotify);
router.put('/:id', authMiddleware, floorPlanControllers.FloorPlanUpdate);
router.get('/:id', authMiddleware, floorPlanControllers.FloorPlanById);
router.post('/', authMiddleware, floorPlanControllers.FloorPlanRegister);

module.exports = router;
