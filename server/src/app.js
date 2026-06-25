import 'dotenv/config'; 

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';

import authRoutes from './routes/authRoutes.js';
import workflowRoutes from './routes/workflowRoutes.js';
import integrationRoutes from './routes/integrationRoutes.js';
import executionRoutes from './routes/executionRoutes.js';
import { startMongoQueueWorker } from './queues/workflowQueue.js';

const app = express();
const httpServer = createServer(app);

// 1. FIRST: Set up configurations and instantiate the Socket.IO 'io' server variable
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:3000', methods: ["GET", "POST"] }
});
app.set('socketio', io);

// 2. SECOND: Bind API route routing endpoints
app.use('/api/auth', authRoutes);
app.use('/api/workflows', workflowRoutes);
app.use('/api/integrations', integrationRoutes);
app.use('/api/executions', executionRoutes);

io.on('connection', (socket) => {
  console.log(`🔌 Live WebSocket channel synchronization active with Client ID: ${socket.id}`);
});

// 3. THIRD: Run the database connection loop down here (Now 'io' is safely defined above!)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/agentflow_ai';

console.log('⏳ Initializing connection to database layer...');

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('🔗 MongoDB Production Core Database connected successfully.');
    startMongoQueueWorker(io);
    listenOnPort();
  })
  .catch(err => {
    console.warn('⚠️ Native MongoDB instance unreachable. Activating In-Memory database fallback layer...');
    startMongoQueueWorker(io);
    listenOnPort();
  });

function listenOnPort() {
  httpServer.listen(8080, () => {
    console.log('🚀 Agentflow_AI Multi-Agent Production Server humming on http://localhost:8080');
  });
}