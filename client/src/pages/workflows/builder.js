import { useState, useCallback } from 'react';
import AppShell from "@/components/AppShell";
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function WorkflowBuilder() {
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleAISubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setGenerating(true);
    try {
      const res = await fetch('http://localhost:8080/api/workflows/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const payload = await res.json();
      
      if (payload.success && payload.graph) {
        setNodes(payload.graph.nodes);
        setEdges(payload.graph.edges);
      }
    } catch (err) {
      console.error("AI Node generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  const saveWorkflowToDatabase = async () => {
    if (nodes.length === 0) return alert("Canvas must contain elements before persistence.");

    try {
      await fetch('http://localhost:8080/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "Interactive Canvas Workflow",
          description: `Constructed from prompt: ${prompt}`,
          status: 'active',
          nodes,
          edges
        })
      });
      alert("Workflow saved to database successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppShell>
      <div className="space-y-4 h-[calc(100vh-120px)] flex flex-col">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Automation Builder Canvas</h1>
            <p className="text-gray-500 text-xs">Type your ideas below to watch your automated graph render visually.</p>
          </div>
          <button
            onClick={saveWorkflowToDatabase}
            className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 uppercase tracking-wider"
          >
            Save Graph Blueprint
          </button>
        </div>

        {/* Dynamic Prompt Generation Inputs */}
        <form onSubmit={handleAISubmit} className="flex gap-2 bg-white p-3 border border-gray-200 rounded-xl shadow-xs">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none"
            placeholder="e.g., Read entries from Google Sheets and post a summary breakdown directly to Discord..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            type="submit"
            disabled={generating}
            className="px-4 py-2 bg-gray-900 text-white font-semibold rounded-lg text-xs hover:bg-gray-800 disabled:bg-gray-400"
          >
            {generating ? "AI Rendering..." : "Generate Graph"}
          </button>
        </form>

        {/* Live Draggable React Flow Node Board Workspace */}
        <div className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-xl overflow-hidden relative shadow-inner">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background color="#cbd5e1" gap={16} size={1} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </AppShell>
  );
}