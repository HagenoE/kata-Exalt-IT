import express from 'express';
import multer from 'multer';



import passRouter from './routes/pass.router.js';
import errorHandler from './error/handler.error.js'

const app = express();
const multiparser = multer()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(multiparser.none())

app.use('/pass', passRouter);
app.use('*', errorHandler)

export default app;
