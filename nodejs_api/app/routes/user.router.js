import { Router } from 'express';
import errorWapper from '../error/wrapper.error.js';
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';
import AppError from '../error/app.error.js';
import validator from '../validation/validator.validation.js';
import userCreate from '../validation/schema/userCreate.schema.js';
import userUpdate from '../validation/schema/userUpdate.schema.js';

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       required:
*         - age
*         - phoneNumber
*         - email
*         - password
*         - passwordConfirm
*         - passLevelId
*       properties:
*         id:
*           type: string
*           description: The auto-generated id by the database
*         passLevelId:
*           type: String
*           description: Pass level id accepted
*         firstName:
*           type: String
*           description: First name of user
*         LastName:
*           type: String
*           description: Last name of user
*         age:
*           type: number
*           description: Age of user
*         phoneNumber:
*           type: string
*           description: The phone of the user
*         adress:
*           type: string
*           description: The address of the user
*         email:
*           type: string
*           description: Email of user
*         password:
*           type: string
*           description: password for connexion, Recorded in hashed string
*         passwordConfirm:
*           type: string
*           description: confirm of the user password given
*         passwordChangedAt:
*           type: string
*           format: date
*           description: Age of user
*         passwordResetToken:
*           type: string
*           description: token when user forgot his password
*         passwordResetExpires:
*           type: string
*           format: date
*           description: Duration of reset token
*         role:
*           type: string
*           description: Role of user
*       example:
*           id: 6508017672f2b6b11425784e
*           passLevelId: [6505bfd4cde131f0b8b2a6f8, 6505bfd4cde131f0b8b2a6f9]
*           firstName: "John"
*           LastName: "Doe"
*           age: 40
*           adress: "seven street"
*           email: "test@mail.fr"
*           password: "$2b$12$HC1dxM7eW13od2cHvMRq3u26pk1rNKEZJVB3/Yp/xNWgJf7Wx3xxG"
*           passwordConfirm: null
*           passwordChangedAt: null
*           passwordResetToken: null
*           passwordResetExpires: null
*           role: "user"
*/

const userRouter = Router();

/**
* @swagger
* tags:
*   name: User
*   description: The user managing API
* /user/:
*   get:
*     summary: Get all user
*     tags: [User]
*     requestBody:
*       required: false
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: All user created.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*   post:
*     summary: Add a new user
*     tags: [User]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: New user created.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
* /user/{id}:
*   get:
*     summary: Get one user
*     tags: [User]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The user id
*     requestBody:
*       required: false
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       201:
*         description: The specify user created.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       404:
*         description: The user was not found
*   patch:
*     summary: Update a user
*     tags: [User]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The user id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       201:
*         description: The user updated.
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/User'
*       404:
*         description: The user was not found
*   delete:
*     summary: Delete one user
*     tags: [User]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The user id
*     requestBody:
*       required: false
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       204:
*         description: Delete user.
*
* /user/places:
*   get:
*     summary: Check all place that user could go with his pass level
*     tags: [User]
*     responses:
*       200:
*         description: Place allow.
*         content:
*           application/json:
*              $ref: '#/components/schemas/Place'
*
* /user/singup:
*   post:
*     summary: Save new user
*     tags: [User]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: User is registred.
*         content:
*           application/json:
*              $ref: '#/components/schemas/Place'
*
* /user/login:
*   post:
*     summary: Log the current user
*     tags: [User]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       200:
*         description: User is logged.
*         content:
*           application/json:
*              $ref: '#/components/schemas/User'
*       400:
*         description: Miss email or password.
*         content:
*           application/json:
*             message:"Email and password is required"
*       401:
*         description: .
*         content:
*           application/json:
*               message:"Email and password are incorrect"
*
* /user/forgotPassword:
*   post:
*     summary: Generated link for change password and send email
*     tags: [User]
*     responses:
*       200:
*         description: Email send.
*         content:
*           application/json:
*              message:"send message"
*       500:
*         description: Error during the send.
*         content:
*           application/json:
*             message:"error message"
*
* /user/resetPassword/{:token}:
*   patch:
*     summary: Reset path for change password with the sending link
*     tags: [User]
*     parameters:
*       - in: path
*         name: token
*         schema:
*           type: string
*         required: true
*         description: The user token generated when he logged
*     responses:
*       201:
*         description: Genereated link for choose a new password.
*         content:
*           application/json:
*              $ref: '#/components/schemas/User'
*       400:
*         description: Error during the genereation of reset link.
*         content:
*           application/json:
*             message:"error message"
*
* /user/updatePassword:
*   patch:
*     summary: Udapte password for the current user
*     tags: [User]
*     responses:
*       201:
*         description: Password updated by the current user.
*         content:
*           application/json:
*              $ref: '#/components/schemas/User'
*       401:
*         description: Wrong password.
*         content:
*           application/json:
*             message:"wrong password"
*/

// auth route
userRouter.post('/signup', validator('body', userCreate), errorWapper(authController.signUp));
userRouter.post('/login', errorWapper(authController.login));

//  Method for password for the current user
userRouter.post('/forgotPassword', errorWapper(authController.forgotPassword));
userRouter.patch('/resetPassword/:token', errorWapper(authController.resetPassword));
userRouter.patch('/updatePassword', authController.isLogged, errorWapper(authController.updatePassword));

userRouter.route('/')
  .get(authController.isAdmin, errorWapper(userController.getAllUser))
  .post(authController.isAdmin, validator('body', userCreate), errorWapper(userController.addUser));

userRouter.get('/places', userController.placeCanAccess);

userRouter.route('/:id')
  .get(authController.isOwner, errorWapper(userController.findOneUser))
  .put(authController.isOwner, validator('body', userUpdate), errorWapper(userController.updateUser))
  .delete(authController.isAdmin, errorWapper(userController.deleteUser));

userRouter.route('*', (req, res, next) => {
  next(new AppError(404, 'Not found '));
});

export default userRouter;
