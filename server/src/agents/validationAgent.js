/**
 * 🔍 Agentflow_AI Validation Agent
 * Pure architectural module responsible for checking configuration payloads 
 * against structural rules before passing tasks to the execution engine layer.
 */
export const validateNodeConfigurations = (nodes) => {
  console.log("🔍 [Validation Agent] Evaluating node parameters against compliance schemas...");

  const failures = [];

  for (const node of nodes) {
    // 🤖 Rule 1: Custom AI Agents must have an instruction prompt context
    if (node.type === 'agentNode') {
      const promptText = node.data?.prompt || '';
      if (!promptText.trim()) {
        failures.push({
          nodeId: node.id,
          label: node.data?.label || 'LLM Agent',
          error: "MISSING_REQUIRED_FIELDS",
          message: "System prompt context cannot be left completely blank."
        });
      }
    }

    // 🌐 Rule 2: Webhook Trigger Entries must be named correctly
    if (node.id === '1' && (!node.data?.label)) {
      failures.push({
        nodeId: node.id,
        label: 'Trigger Node',
        error: "INVALID_STRUCTURE",
        message: "Entry trigger requires a valid identifier tag."
      });
    }
  }

  return {
    isValid: failures.length === 0,
    failures,
    timestamp: new Date().toISOString()
  };
};