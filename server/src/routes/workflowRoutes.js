import express from 'express';
import { Workflow, Execution, ExecutionLog } from '../models/Schemas.js';
import { generateAIGraph } from '../services/aiService.js';
import { runAgentOrchestrationChain } from '../agents/orchestrator.js';

const router = express.Router();

// Mock standard User Reference Id since auth middleware can be added later
const DEFAULT_USER_ID = "64b0f0b2f1d2c3a4b5e6f7a1";

// Analytics Telemetry Endpoint
router.get('/dashboard', async (req, res) => {
  try {
    const totalCount = await Workflow.countDocuments();
    const executions = await Execution.find();
    const totalExecutions = executions.length;
    const successCount = executions.filter(e => e.status === 'COMPLETED').length;
    const successRate = totalExecutions > 0 ? Math.round((successCount / totalExecutions) * 100) : 100;

    res.json({
      totalWorkflows: totalCount,
      activeWorkflows: await Workflow.countDocuments({ status: 'active' }),
      executionCount: totalExecutions,
      successRate: `${successRate}%`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create Manual Workflow
router.post('/', async (req, res) => {
  try {
    const newWorkflow = new Workflow({ ...req.body, owner: DEFAULT_USER_ID });
    await newWorkflow.save();
    res.status(201).json(newWorkflow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Prompt-To-Workflow Generation Endpoint
router.post('/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    const computedGraph = await generateAIGraph(prompt);
    res.json({ success: true, graph: computedGraph });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List All User Workflows
router.get('/', async (req, res) => {
  try {
    const list = await Workflow.find().sort({ updatedAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch Single Specific Workflow
router.get('/:id', async (req, res) => {
  try {
    const item = await Workflow.findById(req.params.id);
    res.json(item);
  } catch (err) {
    res.status(404).json({ error: "Workflow entity not found" });
  }
});

// Update Existing Workflow Properties
router.put('/:id', async (req, res) => {
  try {
    const updated = await Workflow.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Execute Canvas Pipeline Trigger Action
router.post('/:id/execute', async (req, res) => {
  try {
    const wf = await Workflow.findById(req.params.id);
    if (!wf) return res.status(404).json({ error: "Target missing" });

    const runInstance = new Execution({
      workflow: wf._id,
      snapshot: { nodes: wf.nodes, edges: wf.edges },
      status: 'PENDING',
      inputPayload: { triggeredVia: "Operator Console Frontend UI" }
    });
    await runInstance.save();

    // Trigger asynchronous multi-agent engine runtime 
    const io = req.app.get('socketio');
    runAgentOrchestrationChain(io, runInstance._id, DEFAULT_USER_ID);

    res.json({ success: true, message: "Multi-agent chain pipeline successfully triggered", executionId: runInstance._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;