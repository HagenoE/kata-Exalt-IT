import { Router } from 'express';
import placeController from '../controllers/place.controller.js';
import errorWrapper from '../error/wrapper.error.js';
import AppError from '../error/app.error.js';
import validator from '../validation/validator.validation.js';
import placeCreate from '../validation/schema/placeCreate.schema.js';
import placeUpdate from '../validation/schema/placeUpdate.schema.js';
/**
* @swagger
* components:
*   schemas:
*     Place:
*       type: object
*       required:
*         - adress
*         - passsLevelId
*         - ageRequire
*         - ownerId
*       properties:
*         id:
*           type: string
*           description: The auto-generated id by the database
*         passLevelId:
*           type: array
*           description: Array of pass level id accepted on a place, refer to Pass collection
*         ageRequire:
*           type: number
*           description: The minimal age require
*         ownerId:
*           type: string
*           description: The place owner, refers to user collection
*         phoneNumber:
*           type: string
*           description: The phone of the place
*         adress:
*           type: string
*           description: The address of the place
*       example:
*           id: 65080f8498b77fcdb34531cb
*           passLevelId: [6505bfd4cde131f0b8b2a6f8, 6505bfd4cde131f0b8b2a6f9]
*           ageRequire: 40
*           ownerId: 6508017672f2b6b11425784e
*           adress: Nightmare Alley
*           phoneNumber: 06 34 43
*/

const placeRouter = Router();

/**
* @swagger
* tags:
*   name: Place
*   description: The place managing API
* /place/:
*   get:
*     summary: Get all place
*     tags: [Place]
*     requestBody:
*       required: false
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Place'
*     responses:
*       200:
*         description: All place created.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Place'
*   post:
*     summary: Add a new place
*     tags: [Place]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Place'
*     responses:
*       200:
*         description: New place created.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Place'
* /place/{id}:
*   get:
*     summary: Get one place
*     tags: [Place]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The place id
*     requestBody:
*       required: false
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Place'
*     responses:
*       201:
*         description: The specify place created.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Place'
*       404:
*         description: The place was not found
*   patch:
*     summary: Update a place
*     tags: [Place]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The place id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Place'
*     responses:
*       201:
*         description: The place updated.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Place'
*       404:
*         description: The place was not found
*   delete:
*     summary: Delete one place
*     tags: [Place]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The place id
*     requestBody:
*       required: false
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Place'
*     responses:
*       204:
*         description: Delete place.
* /place/{id}/user:
*   get:
*     summary: Check if the connected user could access the place
*     tags: [Place]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The place id
*     responses:
*       200:
*         description: Have access.
*         content:
*           application/json:
*             message: 'User has or has not access'
*/

placeRouter.route('/')
  .get(placeController.getAllPlace)
  .post(validator('body', placeCreate), errorWrapper(placeController.addNewPlace));

placeRouter.route('/:id')
  .get(errorWrapper(placeController.getOnePlace))
  .put(validator('body', placeUpdate), errorWrapper(placeController.updatePlace))
  .delete(errorWrapper(placeController.deletePlace));
placeRouter.get('/:id/user', placeController.authorizeForUser);
placeRouter.route('*', (req, res, next) => {
  next(new AppError(404, 'Not found '));
});

export default placeRouter;
