import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AppShell from '@/components/AppShell';
import axios from 'axios';
import { io } from 'socket.io-client';
import CustomAgentNode from '@/components/CustomAgentNode'; // Import custom node layout

// Register custom block types outside the main rendering lifecycle loop
const nodeTypes = {
  agentNode: CustomAgentNode
};

const initialNodes = [
  {
    id: '1',
    position: { x: 50, y: 120 },
    data: { label: '🌐 Webhook Trigger Entry' },
    style: { background: '#EEF2FF', border: '1px solid #6366F1', borderRadius: '8px', padding: '10px', color: '#312E81', fontWeight: '600' }
  },
  {
    id: '2',
    type: 'agentNode', // Swap to use our advanced parameter template layout
    position: { x: 380, y: 60 },
    data: { label: 'LLM Core Reasoning Agent', model: 'gemini-1.5-pro', prompt: '' }
  },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];
let socket;

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState("Custom Agent Engine Workflow");
  const [saveStatus, setSaveStatus] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Connect directly to the real-time event pipeline stream
    socket = io('http://localhost:8080');

    socket.on('execution_log', (data) => {
      setLogs((prevLogs) => [...prevLogs, data]); // Append new execution logs step-by-step
    });

    return () => socket.disconnect();
  }, []);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const handleRunWorkflow = () => {
    setLogs([]); // Reset log screen terminal for a clean run execution loop
    setIsRunning(true);
    setSaveStatus("Orchestrating...");
    
    // ⚡ CRITICAL CHANGE: Pass the active state snapshot configuration array along the line!
    socket.emit('trigger_agent_execution', { workflowName, nodes });
    
    setTimeout(() => {
      setIsRunning(false);
      setSaveStatus("Pipeline Processed Successfully.");
      setTimeout(() => setSaveStatus(""), 3000);
    }, 13000);
  };

  const handleSaveWorkflow = async () => {
    setSaveStatus("Syncing nodes...");
    try {
      await axios.post('http://localhost:8080/api/workflows/save', {
        name: workflowName,
        nodes,
        edges,
      });
      setSaveStatus("Saved layout successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (err) {
      setSaveStatus("Saved locally (Offline mode).");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const addCustomAgentNode = () => {
    const newNode = {
      id: String(nodes.length + 1),
      type: 'agentNode', // Newly generated nodes will also use the custom layout panel
      position: { x: 200, y: 200 },
      data: { label: `Action Node #${nodes.length + 1}`, model: 'gemini-1.5-pro', prompt: '' }
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-120px)] space-y-4">
        
        {/* Upper Control Strip Header */}
        <div className="flex items-center justify-between bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="text-xl font-bold text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-indigo-500 focus:outline-none px-1 py-0.5"
            />
            <button
              onClick={addCustomAgentNode}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-semibold rounded-lg transition-colors"
            >
              + Add Logic Node
            </button>
          </div>
          <div className="flex items-center space-x-3">
            {saveStatus && <span className="text-sm text-indigo-600 font-semibold">{saveStatus}</span>}
            
            <button
              onClick={handleRunWorkflow}
              disabled={isRunning}
              className={`px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors ${
                isRunning ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {isRunning ? 'Running Engine...' : '⚡ Run Pipeline'}
            </button>

            <button
              onClick={handleSaveWorkflow}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              Save Configuration
            </button>
          </div>
        </div>

        {/* SPLIT-SCREEN WORKSPACE LAYER */}
        <div className="flex flex-1 gap-4 min-h-0">
          
          {/* Left Canvas Panel: Drag and Drop React Flow */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes} // Register custom model component mapping here
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
            >
              <Controls />
              <MiniMap nodeStrokeBorderRadius={2} />
              <Background color="#ccc" gap={16} size={1} />
            </ReactFlow>
          </div>

          {/* Right Console Panel: Embedded Live Log Feed Widget */}
          <div className="w-80 bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col shadow-xl">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 select-none">📟 Execution Log Terminal</h3>
            <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs text-green-400 p-2 bg-gray-900 rounded-lg border border-gray-950 shadow-inner">
              {logs.length === 0 ? (
                <p className="text-gray-500 italic text-center mt-10">Standby. Click 'Run Pipeline' to stream live logs...</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="border-b border-gray-950 pb-2 last:border-0 leading-relaxed animate-fadeIn">
                    <span className="text-indigo-400 font-semibold">[{log.timestamp}]</span>{" "}
                    <span className="text-gray-100">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </AppShell>
  );
}