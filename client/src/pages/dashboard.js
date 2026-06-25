import { useEffect, useState } from 'react';
import AppShell from "@/components/AppShell";
import { io } from "socket.io-client";

export default function Dashboard() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Connect to our backend socket server gateway
    const socket = io("http://localhost:8080");

    socket.on("connect", () => {
      console.log("🌐 Linked into WebSocket agent stream.");
    });

    // Capture incoming reasoning feed logs out of the stream context
    socket.on("execution_log", (data) => {
      setLogs((prevLogs) => [data, ...prevLogs].slice(0, 8)); // Display the 8 most recent entries
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back, Operator</h1>
          <p className="text-gray-500 mt-1">System cluster monitoring and automated orchestration workspace console status.</p>
        </div>

        {/* Statistical Tracker Canvas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Active Workflows</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Agent Executions Run</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">Active</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Success Rate Tracker</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">100%</p>
          </div>
        </div>

        {/* Real-Time Live Activity Command Terminal Console */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Real-time AI Reasoning Feed (Live Stream)</h3>
          
          <div className="bg-gray-950 rounded-lg p-4 font-mono text-sm text-green-400 min-h-[220px] max-h-[300px] overflow-y-auto space-y-2 border border-gray-800 shadow-inner">
            {logs.length === 0 ? (
              <p className="text-gray-500 italic animate-pulse">Initializing background websocket connection handshakes...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="flex items-start space-x-2 border-b border-gray-900 pb-1 last:border-0">
                  <span className="text-indigo-400 select-none">[{log.timestamp}]</span>
                  <span className="text-gray-100">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}