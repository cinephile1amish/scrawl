// load and inject environment variables before anything
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { setupDatabase } from './database';
import { setupCache } from './cache';
import cookieParser from 'cookie-parser';
import { attachEvents } from './event/socket';
import { Server } from 'socket.io';
import http from 'http';
import api from './routes';

setupDatabase(process.env.DATABASE_URL || '');
setupCache(process.env.REDIS_URL || '', process.env.REDIS_USER || '', process.env.REDIS_PWD || '');

const app: express.Application = express();
app.use(express.json());
app.use(cookieParser());
app.use('/api', api);

// Serve the React App
app.use(express.static('web/build')); 

// Prepare HTTP server
const server = http.createServer(app);

// Create the socket.io instance
const socketio = new Server(server);

// Attach events to this instance
attachEvents(socketio);

server.listen(process.env.PORT, () => console.log("Server is up!"));
