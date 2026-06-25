/**
 * 🔌 Agentflow_AI Base Integration Class
 * Standardized structural contract that all third-party service modules 
 * (Slack, Gmail, Discord, Sheets) must extend to ensure unified runtime actions.
 */
export class BaseIntegration {
  constructor(providerName) {
    this.providerName = providerName;
  }

  /**
   * Initializes OAuth or API handshake configs
   */
  async initialize(credentials) {
    throw new Error(`initialize() not implemented for provider: ${this.providerName}`);
  }

  /**
   * Executes a specific tool action (e.g., 'send_message', 'append_row')
   */
  async executeAction(actionName, payload) {
    throw new Error(`executeAction() not implemented for provider: ${this.providerName}`);
  }

  /**
   * Maps provider-specific raw errors to our internal Recovery Agent error codes
   */
  handleError(error) {
    const message = error.message || '';
    
    if (message.includes('invalid_grant') || message.includes('401') || message.includes('expired')) {
      return 'AUTH_EXPIRED';
    }
    if (message.includes('rate') || message.includes('429')) {
      return 'RATE_LIMIT';
    }
    
    return 'TRANSIENT_API_FAILURE';
  }
}