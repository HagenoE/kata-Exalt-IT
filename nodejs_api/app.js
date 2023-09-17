import http from 'node:http';
import mongoose from 'mongoose';
import app from './server.js';
import './app/utils/env.utils.js';

const port = process.env.PORT ?? 3000;
await mongoose.connect(process.env.DB_URI);

const server = http.createServer(app);

server.listen(port);
