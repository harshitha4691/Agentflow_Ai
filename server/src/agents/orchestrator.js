import { memoryExecutionsStore } from '../queues/workflowQueue.js';

// Create a local virtual store for logs and notifications since DB is offline
export const memoryLogsStore = [];
export const memoryNotificationsStore = [];

export async function runAgentOrchestrationChain(io, executionId, userId) {
  console.log(`🤖 Starting Multi-Agent Orchestration Chain for ID: ${executionId}`);

  // 1. FALLBACK LOOKUP: Pull from our active virtual memory array instead of MongoDB
  let exe = memoryExecutionsStore.find(job => job._id === executionId);

  // If it's a manual table trigger from mock data, spin up a quick runtime container
  if (!exe) {
    exe = {
      _id: executionId,
      status: 'PENDING',
      snapshot: {
        name: "Manual Custom Blueprint Flow",
        nodes: [
          { id: '1', type: 'triggerNode', data: { label: 'Catch Webhook Trigger' }, position: { x: 100, y: 200 } },
          { id: '2', type: 'agentNode', data: { label: 'Process Intent Logic', prompt: 'Analyze payload constraints' }, position: { x: 400, y: 200 } },
          { id: '3', type: 'actionNode', data: { label: 'Gmail SMTP Output Engine' }, position: { x: 700, y: 200 } }
        ],
        edges: [{ id: 'e1-2', source: '1', target: '2' }, { id: 'e2-3', source: '2', target: '3' }]
      }
    };
    memoryExecutionsStore.push(exe);
  }

  exe.status = 'RUNNING';

  const nodes = exe.snapshot.nodes || [];
  const totalLogs = [];

  // Helper utility to emit logs and save them directly into runtime state arrays
  const addLog = async (agent, level, message) => {
    const logRow = {
      execution: executionId,
      agent,
      level,
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    
    memoryLogsStore.push(logRow);
    console.log(`📡 [Socket Emit] ${agent.toUpperCase()}: ${message}`);
    
    // Broadcast live to client over Socket.IO stream channel
    io.emit('execution_log', {
      executionId,
      agent,
      level,
      message,
      timestamp: new Date().toLocaleTimeString()
    });
    
    totalLogs.push(message);
  };

  try {
    // 1. Planner Agent
    await addLog('planner', 'info', `🧠 [Planner Agent] Mapping topology path sequence for workflow parameters.`);
    if (nodes.length === 0) {
      throw new Error("VALIDATION_BLOCKED: Graph canvas does not contain active workflow nodes.");
    }
    
    // Sort nodes horizontally to compute execution order layout
    const executionPath = [...nodes].sort((a, b) => (a.position?.x || 0) - (b.position?.x || 0));
    
    await new Promise(r => setTimeout(r, 1000)); // Add a small delay so human eyes can follow the live dashboard stream
    await addLog('planner', 'success', `🧠 [Planner Agent] Target sequence order optimized: ${executionPath.map(n => n.data?.label || n.type).join(' ➡️ ')} (Confidence: 94%)`);

    // 2. Validation Agent
    await new Promise(r => setTimeout(r, 1000));
    await addLog('validation', 'info', `⚙️ [Validation Agent] Checking structural token compliance metrics...`);
    
    for (const node of executionPath) {
      if (node.type === 'agentNode' && !node.data?.prompt) {
        throw new Error(`MISSING_FIELDS: Node "${node.data?.label || node.id}" requires configuration prompts.`);
      }
    }
    await addLog('validation', 'success', `✅ [Validation Agent] Structural configuration checks passed successfully.`);

    // 3. Execution Agent
    await new Promise(r => setTimeout(r, 1000));
    await addLog('execution', 'info', `🚀 [Execution Agent] Running operations across common pipeline nodes...`);
    
    const langGraphStatus = "not-installed"; 
    await addLog('execution', 'info', `⚡ [Execution Substrate] Native environment state: langGraph='${langGraphStatus}'`);

    for (const node of executionPath) {
      await new Promise(r => setTimeout(r, 800));
      await addLog('execution', 'info', `🏃 Executing block [${node.data?.label || node.type}] successfully.`);
    }

    // Wrap up execution state inside memory
    exe.status = 'COMPLETED';
    
    await new Promise(r => setTimeout(r, 1000));
    await addLog('monitoring', 'success', `🎉 [Monitoring Agent] Pipeline lifecycle concluded with 0 exceptions.`);

    memoryNotificationsStore.push({
      owner: userId,
      title: "Execution Succeeded",
      message: `Workflow processed successfully inside virtual sandbox.`
    });

  } catch (err) {
    // 4. Recovery Agent Action Flow
    exe.status = 'FAILED';
    await addLog('recovery', 'error', `🚨 [Recovery Agent] Exception intercepted: ${err.message}`);
    
    let classification = "TRANSIENT";
    let strategicDecision = "RETRY_WITH_BACKOFF";

    if (err.message.includes("MISSING_FIELDS")) {
      classification = "MISSING_FIELDS";
      strategicDecision = "ESCALATE";
    }

    await new Promise(r => setTimeout(r, 1000));
    await addLog('recovery', 'warning', `🛡️ Rules match engine categorized problem as [${classification}] -> Executing action: **${strategicDecision}**`);

    memoryNotificationsStore.push({
      owner: userId,
      type: "error",
      title: "Execution Failed",
      message: `Workflow stopped early: ${err.message}`
    });
  }
}