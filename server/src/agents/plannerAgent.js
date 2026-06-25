/**
 * 🧠 Agentflow_AI Planner Agent
 * Pure architectural module responsible for determining the execution sequence 
 * of workflow nodes based on graph edge link topology.
 */
export const planWorkflowExecution = (nodes, edges) => {
  console.log("🧠 [Planner Agent] Analyzing incoming graph topology data packets...");

  // 1. Locate the absolute entryway node (e.g., Webhook Trigger Entry)
  const triggerNode = nodes.find(node => !edges.some(edge => edge.target === node.id));
  
  if (!triggerNode) {
    return {
      success: false,
      executionPath: [],
      confidenceScore: 0.0,
      error: "GRAPH_CYCLE_DETECTED: Unable to isolate an entry point trigger node."
    };
  }

  const executionPath = [triggerNode];
  let currentNodes = [triggerNode];
  let visited = new Set([triggerNode.id]);

  // 2. Traversal algorithm to sequence downstream node linkages
  while (currentNodes.length > 0) {
    const nextNodes = [];
    
    for (const node of currentNodes) {
      // Pin point all edge targets connected directly to this block
      const connectedEdges = edges.filter(edge => edge.source === node.id);
      
      for (const edge of connectedEdges) {
        const targetNode = nodes.find(n => n.id === edge.target);
        
        if (targetNode && !visited.has(targetNode.id)) {
          visited.add(targetNode.id);
          executionPath.push(targetNode);
          nextNodes.push(targetNode);
        }
      }
    }
    currentNodes = nextNodes;
  }

  // 3. Evaluate operational clarity to build the required confidence score
  const totalCustomAgents = nodes.filter(n => n.type === 'agentNode').length;
  const configuredAgents = nodes.filter(n => n.type === 'agentNode' && n.data?.prompt).length;
  
  // High confidence if custom models have customized prompts configured
  const confidenceScore = totalCustomAgents === 0 ? 1.0 : (configuredAgents / totalCustomAgents);

  return {
    success: true,
    executionPath: executionPath.map(node => ({
      id: node.id,
      label: node.data?.label || "Unnamed Operation",
      type: node.type || "default"
    })),
    confidenceScore: parseFloat(confidenceScore.toFixed(2)),
    error: null
  };
};