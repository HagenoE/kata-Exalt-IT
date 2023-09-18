import { Router } from 'express';
import passController from '../controllers/pass.controller.js';
import AppError from '../error/app.error.js';
import errorWrapper from '../error/wrapper.error.js';
import validator from '../validation/validator.validation.js';
import passValidator from '../validation/schema/pass.schema.js';
import authController from '../controllers/auth.controller.js';

/**
* @swagger
* components:
*   schemas:
*     Pass:
*       type: object
*       required:
*         - passLevel
*       properties:
*         id:
*           type: string
*           description: The auto-generated id by the database
*         passLevel:
*           type: string
*           description: The name of pass level
*         createdAt:
*           type: string
*           format: date
*           description: The date of creation of pass level
*         updatedAt:
*           type: string
*           format: date
*           description: The date of update of pass level
*       example:
*         id: 6505bfd4cde131f0b8b2a6fa
*         passLevel: Vaccinated"
*         createdAt: "2023-09-16T14:46:44.566Z"
*         updatedAt: null
*/

const passRouter = Router();

passRouter.route('/')
  /**
  * @swagger
  * tags:
  *   name: Pass
  *   description: The pass managing API
  * /pass/:
  *   get:
  *     summary: Get all pass
  *     tags: [Pass]
  *     requestBody:
  *       required: false
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Pass'
  *     responses:
  *       200:
  *         description: All pass created.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Pass'
  *   post:
  *     summary: Add a new pass
  *     tags: [Pass]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Pass'
  *     responses:
  *       200:
  *         description: New pass created.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Pass'
  * /pass/{id}:
  *   get:
  *     summary: Get one pass
  *     tags: [Pass]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The pass id
  *     requestBody:
  *       required: false
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Pass'
  *     responses:
  *       201:
  *         description: The specify pass created.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Pass'
  *       404:
  *         description: The pass was not found
  *   patch:
  *     summary: Update a pass
  *     tags: [Pass]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The pass id
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Pass'
  *     responses:
  *       201:
  *         description: The pass updated.
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/Pass'
  *       404:
  *         description: The pass was not found
  *   delete:
  *     summary: Delete one pass
  *     tags: [Pass]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: The pass id
  *     requestBody:
  *       required: false
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Pass'
  *     responses:
  *       204:
  *         description: Delete pass.
  */
  .get(errorWrapper(passController.getAllPass))
  .post(authController.isAdmin, validator('body', passValidator), errorWrapper(passController.addPass));
passRouter.route('/:id')
  .get(authController.isOwner, errorWrapper(passController.getOne))
  .patch(authController.isOwner, validator('body', passValidator), errorWrapper(passController.updatePass))
  .delete(authController.isOwner, errorWrapper(passController.deletePass));

passRouter.route('*', (req, res, next) => {
  next(new AppError(404, 'Not found '));
});

export default passRouter;
