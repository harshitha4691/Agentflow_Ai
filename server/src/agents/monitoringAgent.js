/**
 * 📊 Agentflow_AI Monitoring Agent
 * Pure architectural module responsible for tracking execution performance metrics,
 * calculating processing durations, and packaging final telemetry payloads.
 */
export const compileExecutionMetrics = (workflowName, totalNodes, stepDurations = []) => {
  console.log("📊 [Monitoring Agent] Aggregating pipeline runtime telemetry...");

  // Calculate the total time elapsed across all node steps
  const totalDurationMs = stepDurations.reduce((sum, current) => sum + current, 0);
  
  // Calculate the average execution time per node block
  const avgNodeDurationMs = totalNodes > 0 ? (totalDurationMs / totalNodes) : 0;

  return {
    workflowName,
    metrics: {
      totalProcessedNodes: totalNodes,
      totalDurationSeconds: parseFloat((totalDurationMs / 1000).toFixed(2)),
      averageStepLatencyMs: Math.round(avgNodeDurationMs),
    },
    systemHealth: {
      langGraphStatus: 'not-installed', // Default orchestrator hook requested by spec
      memoryUsage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      timestamp: new Date().toISOString()
    }
  };
};