import express from 'express';
import multer from 'multer';

import passRouter from './app/routes/pass.router.js';
import errorHandler from './app/error/handler.error.js';
import placeRouter from './app/routes/place.router.js';
import AppError from './app/error/app.error.js';
import userRouter from './app/routes/user.router.js';

const app = express();
const multiparser = multer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(multiparser.none());

app.use('/pass', passRouter);
app.use('/place', placeRouter);
app.use('/user', userRouter);

app.all('*', (req, res, next) => next(new AppError(404, `Can't not find ${req.originalUrl} on this server`)));

app.use(errorHandler);

export default app;
