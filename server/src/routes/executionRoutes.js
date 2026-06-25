import express from 'express';
import { memoryExecutionsStore } from '../queues/workflowQueue.js';
import { runAgentOrchestrationChain } from '../agents/orchestrator.js';

const router = express.Router();

// 🚀 THIS IS THE ENDPOINT YOUR BUTTON HITS
router.post('/', async (req, res) => {
  try {
    const { executionId, snapshot } = req.body;
    const io = req.app.get('socketio');

    console.log(`📥 [API] Manual execution triggered for ID: ${executionId}`);

    // 1. Instantly register the job as PENDING in our memory store
    const jobExists = memoryExecutionsStore.find(j => j._id === executionId);
    if (!jobExists) {
      memoryExecutionsStore.push({
        _id: executionId,
        status: 'PENDING',
        createdAt: new Date(),
        snapshot: snapshot
      });
    } else {
      jobExists.status = 'PENDING';
    }

    // 2. Respond to the frontend immediately so the browser doesn't freeze
    res.json({ success: true, message: "Orchestration chain initiated in memory background queue." });

    // 3. Immediately kick off the Multi-Agent logs stream right now!
    const mockUserId = "64b0f0b2f1d2c3a4b5e6f7a1";
    await runAgentOrchestrationChain(io, executionId, mockUserId);

  } catch (err) {
    console.error("Execution route crash:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET endpoint to supply mock records for your dashboard table view
router.get('/audit-records', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: "TX-9018", workflowName: "Custom Agent Engine Workflow", engine: "Claude 3.5 Sonnet", status: "Success" },
      { id: "TX-9017", workflowName: "Custom Agent Engine Workflow", engine: "Gemini 1.5 Pro", status: "Success" },
      { id: "TX-9016", workflowName: "Automated Data Pipeline", engine: "Gemini 1.5 Pro", status: "Success" }
    ]
  });
});

export default router;