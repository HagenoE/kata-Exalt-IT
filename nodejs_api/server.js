import express from 'express';
import multer from 'multer';

import passRouter from './app/routes/pass.router.js';
import errorHandler from './app/error/handler.error.js';
import placeRouter from './app/routes/place.router.js';

const app = express();
const multiparser = multer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(multiparser.none());

app.use('/pass', passRouter);
app.use('/place', placeRouter);
app.use('*', errorHandler);

export default app;
