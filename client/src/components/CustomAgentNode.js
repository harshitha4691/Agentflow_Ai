import React, { memo } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';

export default memo(({ id, data }) => {
  const { setNodes } = useReactFlow();

  // Helper function to update the data object of this specific node inside global state
  const updateNodeField = (field, value) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              [field]: value,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <div className="bg-white border-2 border-emerald-500 rounded-xl shadow-md min-w-[240px] overflow-hidden text-left font-sans">
      {/* Node Header */}
      <div className="bg-emerald-50 px-3 py-2 border-b border-emerald-100 flex items-center space-x-2">
        <span className="text-base">🤖</span>
        <div className="text-sm font-bold text-emerald-900">{data.label}</div>
      </div>
      
      {/* Node Parameters */}
      <div className="p-3 space-y-3 bg-white">
        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Model Router</label>
          <select 
            value={data.model || 'gemini-1.5-pro'}
            className="mt-1 block w-full text-xs font-medium bg-gray-50 border border-gray-200 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-700"
            onChange={(e) => updateNodeField('model', e.target.value)}
          >
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="gpt-4o">OpenAI GPT-4o</option>
            <option value="claude-3.5-sonnet">Claude 3.5 Sonnet</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">System Prompt Context</label>
          <textarea 
            rows="2"
            value={data.prompt || ''}
            placeholder="Ex: You are an expert data engineer extractor..."
            className="mt-1 block w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded p-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-gray-700 resize-none"
            onChange={(e) => updateNodeField('prompt', e.target.value)}
          />
        </div>
      </div>

      <Handle type="target" position={Position.Left} style={{ background: '#10B981', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right} style={{ background: '#10B981', width: 8, height: 8 }} />
    </div>
  );
});