import http from 'node:http';
import app from './server.js';
import mongoose from 'mongoose';
import './utils/env.utils.js'

console.log(process.env.PORT)
const port = process.env.PORT ?? 3000;
await mongoose.connect(process.env.DB_URI)

const server = http.createServer(app);

server.listen(port, () => console.log(`http://localhost:${port}`));
