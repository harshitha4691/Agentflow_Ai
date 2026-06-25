/**
 * 🛡️ Agentflow_AI Recovery Agent
 * Pure architectural module responsible for intercepting task execution failures,
 * classifying their structural type, and determining the optimal recovery mitigation step.
 */
export const classifyAndRouteFailure = (errorMessage, currentRetryCount = 0) => {
  console.log(`🛡️ [Recovery Agent] Intercepted execution fault signal: "${errorMessage}"`);

  const lowerMessage = errorMessage.toLowerCase();

  // 🚨 CRITICAL ESCALATION RULES: Fatal structural blockers must escalate instantly
  const immediateEscalationTriggers = [
    'integration_not_connected',
    'auth_expired',
    'missing_credential',
    'permission_denied',
    'servicedisabled',
    'accessnotconfigured'
  ];

  const needsImmediateEscalation = immediateEscalationTriggers.some(trigger => 
    lowerMessage.includes(trigger)
  );

  if (needsImmediateEscalation) {
    return {
      classification: "FATAL_AUTH_INTEGRATION_ERROR",
      action: "escalate",
      reason: "Critical access credential barrier detected. Halting pipeline execution sequence immediately to prevent log flooding.",
      nextRetryDelayMs: 0
    };
  }

  // ⚠️ TRANSIENT FAILURE RULES: Network drops or rate limits can retry with backoff
  if (lowerMessage.includes('rate_limit') || lowerMessage.includes('429')) {
    return {
      classification: "RATE_LIMIT",
      action: currentRetryCount < 3 ? "retry_with_backoff" : "escalate",
      reason: "Rate ceiling reached. Appending exponential backoff delay intervals.",
      nextRetryDelayMs: Math.pow(2, currentRetryCount) * 5000 // 5s, 10s, 20s...
    };
  }

  // Default fallback classification for standard processing exceptions
  const maxRetries = 2;
  const canRetry = currentRetryCount < maxRetries;

  return {
    classification: "TRANSIENT_API_FAILURE",
    action: canRetry ? "retry_with_backoff" : "escalate",
    reason: canRetry 
      ? `Transient system anomaly encountered. Scheduling execution retry loop operational block.` 
      : `Max retry tolerance threshold (${maxRetries}) exhausted. Handing off to human operator escalation queue.`,
    nextRetryDelayMs: canRetry ? 3000 : 0
  };
};