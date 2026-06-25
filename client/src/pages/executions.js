import { useEffect, useState } from 'react';
import AppShell from "@/components/AppShell";
import { io } from 'socket.io-client';

export default function Executions() {
  const [logs, setLogs] = useState([]);
  const [liveStream, setLiveStream] = useState([]);

  useEffect(() => {
    // 1. Fetch historical record table logs
    fetch('http://localhost:8080/api/executions/audit-records')
      .then((res) => res.json())
      .then((payload) => { if (payload.success) setLogs(payload.data); })
      .catch((err) => console.error("History fetch error:", err));

    // 2. Open active websocket link for live agent telemetry streaming
    const socket = io('http://localhost:8080');

    socket.on('execution_log', (newEvent) => {
      setLiveStream((prev) => [newEvent, ...prev]);
    });

    return () => { socket.disconnect(); };
  }, []);

  return (
    <AppShell>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Historical Audit Table */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Transaction Audit History</h1>
            <p className="text-gray-500 text-xs">Review permanent runtime record assets indexed inside MongoDB.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase">
                  <th className="p-3">ID</th>
                  <th className="p-3">Workflow Name</th>
                  <th className="p-3">Engine</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th> {/* Action Header */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {logs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-blue-600 font-bold">{log.id}</td>
                    <td className="p-3 font-semibold text-gray-900">{log.workflowName}</td>
                    <td className="p-3 text-gray-500">{log.engine}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-bold text-[10px]">
                        {log.status}
                      </span>
                    </td>
                    {/* Interactive Run Trigger Action */}
                    <td className="p-3 text-right">
                      <button
                        onClick={async () => {
                          try {
                            await fetch('http://localhost:8080/api/executions', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ executionId: log.id, snapshot: log })
                            });
                          } catch (err) {
                            console.error("Pipeline trigger error:", err);
                          }
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded-md tracking-wider uppercase transition-colors"
                      >
                        Run Pipeline
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Side: Live WebSocket Agent Feed Drawer Terminal */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Live Agent Stream</h2>
            <p className="text-gray-500 text-xs">Real-time thought event capture channel via Socket.IO.</p>
          </div>

          <div className="bg-gray-900 text-gray-100 rounded-xl p-4 font-mono text-xs h-[400px] overflow-y-auto space-y-2 shadow-lg border border-gray-800">
            {liveStream.length === 0 ? (
              <p className="text-gray-500 animate-pulse">⏳ Idle console channel. Launch an automation flow to stream active reasoning sequences...</p>
            ) : (
              liveStream.map((stream, idx) => (
                <div key={idx} className="border-b border-gray-800 pb-1 animate-fadeIn">
                  <span className="text-gray-500 text-[10px] mr-2">[{stream.timestamp}]</span>
                  <span className={`font-bold uppercase tracking-wider text-[10px] mr-1 ${
                    stream.agent === 'planner' ? 'text-blue-400' :
                    stream.agent === 'validation' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {stream.agent}:
                  </span>
                  <span className="text-gray-200">{stream.message}</span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </AppShell>
  );
}