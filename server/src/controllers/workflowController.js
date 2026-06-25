import { Workflow } from '../models/Workflow.js';

// Save a new workflow or update an existing one safely
export const saveWorkflow = async (req, res) => {
  try {
    const { id, name, description, nodes, edges } = req.body;
    
    // Fallback ID for local testing if user context is fully bypassed
    const userId = req.user?.id || "64f1a2b3c4d5e6f7a8b9c0d1";

    if (id) {
      // 1. Explicit Update: Update existing workflow structure if a direct ID is passed
      const updatedWorkflow = await Workflow.findByIdAndUpdate(
        id,
        { name, description, nodes, edges },
        { new: true }
      );
      return res.json({ success: true, workflow: updatedWorkflow });
    }

    // 2. Continuous Upsert: Find by user identity and update, or create a fresh one if it doesn't exist
    const savedWorkflow = await Workflow.findOneAndUpdate(
      { createdBy: userId, name: name }, // Match criteria to stop duplicate generation loops
      { name, description, nodes, edges, createdBy: userId },
      { upsert: true, new: true }
    );

    console.log(`💾 Workflow state synced successfully to MongoDB database for user context: ${userId}`);
    return res.status(200).json({ success: true, workflow: savedWorkflow });
  } catch (err) {
    console.error("❌ Mongoose Operation Error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Fetch all workflows belonging to the user session
export const getUserWorkflows = async (req, res) => {
  try {
    const userId = req.user?.id || "64f1a2b3c4d5e6f7a8b9c0d1";
    const workflows = await Workflow.find({ createdBy: userId }).sort({ updatedAt: -1 });
    res.json({ success: true, workflows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};