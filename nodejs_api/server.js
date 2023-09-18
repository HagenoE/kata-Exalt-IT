import express from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

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

app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(cors({
  origin: '*',
  credentials: true,
}));

const limiter = rateLimit({
  max: 1000,
  windowMs: 1000 * 60 * 10,
  message: 'Trop de tentative de cette adresse. Veillez reesayer plus tard',
});
app.use(limiter);

const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'Swagger for kata_nodejs_api',
      version: '0.1.0',
      description:
        'This is a node API application made with Express and documented with Swagger for Exalt IT',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'Exalt IT',
        url: 'https://www.exalt-company.com/',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
      },
    ],
  },
  apis: ['./app/routes/*.router.js'],
};

const specs = swaggerJsdoc(options);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs),
);

app.use('/pass', passRouter);
app.use('/place', placeRouter);
app.use('/user', userRouter);

app.all('*', (req, res, next) => next(new AppError(404, `Can't not find ${req.originalUrl} on this server`)));

app.use(errorHandler);

export default app;
