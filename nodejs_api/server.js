import express from 'express';

import router from './routes/index.router.js';
import errorHandler from './error/handler.error.js'

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(router);
app.use('*', errorHandler)

export default app;
