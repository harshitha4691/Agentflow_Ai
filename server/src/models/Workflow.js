import mongoose from 'mongoose';

const workflowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: "Untitled Automation Workflow"
  },
  description: {
    type: String,
    default: "Custom agent orchestration pipeline script loop."
  },
  // Store node arrays matching the structural specifications of React Flow
  nodes: {
    type: Array,
    default: []
  },
  // Store continuous layout linkage paths connecting our functional AI operators
  edges: {
    type: Array,
    default: []
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export const Workflow = mongoose.model('Workflow', workflowSchema);