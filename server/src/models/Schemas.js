import mongoose from 'mongoose';

// 1. Users Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['admin', 'operator'], default: 'operator' },
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

// 2. Workflows Schema
const WorkflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['draft', 'active', 'paused', 'archived'], default: 'draft' },
  triggerConfig: { type: Object, default: {} },
  nodes: { type: Array, default: [] },
  edges: { type: Array, default: [] },
  version: { type: Number, default: 1 },
  tags: { type: [String], default: [] },
  lastExecutionAt: { type: Date }
}, { timestamps: true });

// 3. Executions Schema
const ExecutionSchema = new mongoose.Schema({
  workflow: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow', required: true },
  snapshot: { type: Object, required: true },
  status: { type: String, enum: ['PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'RETRYING', 'PAUSED', 'CANCELLED'], default: 'PENDING' },
  currentNodeId: { type: String },
  inputPayload: { type: Object, default: {} },
  outputPayload: { type: Object, default: {} },
  error: { type: String },
  retryCount: { type: Number, default: 0 },
  duration: { type: Number, default: 0 }
}, { timestamps: true });

// 4. ExecutionLogs Schema
const ExecutionLogSchema = new mongoose.Schema({
  execution: { type: mongoose.Schema.Types.ObjectId, ref: 'Execution', required: true },
  workflow: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow', required: true },
  nodeId: { type: String },
  agent: { type: String, enum: ['planner', 'execution', 'validation', 'recovery', 'monitoring'], required: true },
  level: { type: String, enum: ['info', 'warning', 'error', 'success'], default: 'info' },
  message: { type: String, required: true },
  metadata: { type: Object, default: {} }
}, { timestamps: true });

// 5. Integrations Schema
const IntegrationSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: String, enum: ['gmail', 'slack', 'google-sheets', 'discord', 'openrouter', 'gemini'], required: true },
  isConnected: { type: Boolean, default: false },
  scopes: { type: [String], default: [] },
  accessTokenEncrypted: { type: String },
  refreshTokenEncrypted: { type: String },
  expiresAt: { type: Date },
  errorLog: { type: String }
}, { timestamps: true });

// 6. Notifications Schema
const NotificationSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workflow: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow' },
  execution: { type: mongoose.Schema.Types.ObjectId, ref: 'Execution' },
  type: { type: String, default: 'info' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);
export const Workflow = mongoose.model('Workflow', WorkflowSchema);
export const Execution = mongoose.model('Execution', ExecutionSchema);
export const ExecutionLog = mongoose.model('ExecutionLog', ExecutionLogSchema);
export const Integration = mongoose.model('Integration', IntegrationSchema);
export const Notification = mongoose.model('Notification', NotificationSchema);