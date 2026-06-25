export async function generateAIGraph(prompt) {
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const promptSystemOverlay = `
    You are the Agentflow_AI canvas graph engine. Transform the user's request into a strict JSON workflow graph object.
    The response must contain exactly this JSON shape, with no markdown formatting and no extra text wrappers:
    {
      "name": "String title",
      "description": "String description",
      "nodes": [ {"id": "1", "type": "triggerNode"|"agentNode"|"actionNode", "data": {"label": "Label name", "prompt": "config text or prompt description"}, "position": {"x": 100, "y": 200}} ],
      "edges": [ {"id": "e1-2", "source": "1", "target": "2", "animated": true} ]
    }
  `;

  // 1. Primary Strategy: OpenRouter
  if (openRouterKey) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${openRouterKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "google/gemini-flash-1.5",
          messages: [{ role: "system", content: promptSystemOverlay }, { role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      return JSON.parse(data.choices[0].message.content.trim());
    } catch (e) {
      console.warn("OpenRouter compilation failed, rolling over to fallback layer...");
    }
  }

  // 2. Secondary Strategy: Google Gemini Direct API
  if (geminiKey) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${promptSystemOverlay}\n\nUser Prompt: ${prompt}` }] }]
        })
      });
      const data = await response.json();
      return JSON.parse(data.candidates[0].content.parts[0].text.trim());
    } catch (e) {
      console.warn("Gemini compilation failed, rolling over to deterministic rules engine...");
    }
  }

  // 3. Fallback Strategy: Deterministic Rule-Based Builder
  const cleanPrompt = prompt.toLowerCase();
  let targetNodes = [
    { id: '1', type: 'triggerNode', data: { label: 'Catch Webhook Trigger' }, position: { x: 100, y: 200 } },
    { id: '2', type: 'agentNode', data: { label: 'Process Intent Logic', prompt: 'Analyze content layout structure.' }, position: { x: 400, y: 200 } },
    { id: '3', type: 'actionNode', data: { label: 'Slack Notification Channel' }, position: { x: 700, y: 200 } }
  ];
  
  if (cleanPrompt.includes('email') || cleanPrompt.includes('gmail')) {
    targetNodes[2] = { id: '3', type: 'actionNode', data: { label: 'Gmail SMTP Output Engine' }, position: { x: 700, y: 200 } };
  } else if (cleanPrompt.includes('sheet')) {
    targetNodes[2] = { id: '3', type: 'actionNode', data: { label: 'Google Sheets Pipeline Appender' }, position: { x: 700, y: 200 } };
  } else if (cleanPrompt.includes('discord')) {
    targetNodes[2] = { id: '3', type: 'actionNode', data: { label: 'Discord Bot Webhook Channel' }, position: { x: 700, y: 200 } };
  }

  return {
    name: "Deterministic Fallback Automation Pipeline",
    description: `Automated rule-based graph compiled from: "${prompt}"`,
    nodes: targetNodes,
    edges: [ { id: 'e1-2', source: '1', target: '2', animated: true }, { id: 'e2-3', source: '2', target: '3', animated: true } ],
    version: 1,
    tags: ["Deterministic"]
  };
}