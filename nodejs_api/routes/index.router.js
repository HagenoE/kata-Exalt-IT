import { Router } from 'express';
import AppError from '../error/app.error.js'

const router = Router();

router.route('/')
  .get((req, res) => {
    res.send('ok');
  });

router.route('*', (req, res, next) => {
  next(new AppError(404, 'Not found '))
})

export default router;
