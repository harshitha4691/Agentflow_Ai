import { useEffect, useState } from 'react';
import AppShell from "@/components/AppShell";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ totalWorkflows: 0, activeWorkflows: 0, executionCount: 0, successRate: "100%" });
  const [recentWf, setRecentWf] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/workflows/dashboard')
      .then(res => res.json())
      .then(data => setMetrics(data))
      .catch(err => console.error(err));

    fetch('http://localhost:8080/api/workflows')
      .then(res => res.json())
      .then(data => setRecentWf(data.slice(0, 4)))
      .catch(err => console.error(err));
  }, []);

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Operator Dashboard</h1>
          <p className="text-gray-500 text-sm">Real-time system health metrics, active analytics arrays, and agent activities.</p>
        </div>

        {/* Metric Grid Panel Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {[
            { title: "Total Pipelines Loaded", value: metrics.totalWorkflows, icon: "📁", color: "text-blue-600" },
            { title: "Active Production Workflows", value: metrics.activeWorkflows, icon: "⚡", color: "text-green-600" },
            { title: "Total Processed Executions", value: metrics.executionCount, icon: "🤖", color: "text-purple-600" },
            { title: "Orchestrator Success Metric", value: metrics.successRate, icon: "🛡️", color: "text-amber-600" }
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{item.title}</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{item.value}</h3>
              </div>
              <span className={`text-2xl p-2 bg-gray-50 rounded-lg ${item.color}`}>{item.icon}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Action Control Feed */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Automated Workflows</h3>
            <div className="divide-y divide-gray-100">
              {recentWf.length === 0 ? (
                <p className="text-sm text-gray-400 py-4">No workflows found. Head to the builder canvas to spin up an automated pipeline!</p>
              ) : (
                recentWf.map((wf, i) => (
                  <div key={i} className="py-3 flex items-center justify-between hover:bg-gray-50 px-2 rounded-lg transition-colors">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{wf.name}</h4>
                      <p className="text-xs text-gray-500 mt-0.5 max-w-md truncate">{wf.description || 'No description supplied.'}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${wf.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                      {wf.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Orchestration Reasoning Activity Feed Panel */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-2">AI Reasoning Engine</h3>
            <p className="text-xs text-gray-400 mb-4">Live tracking channel events across orchestration agent sub-systems.</p>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-xs">
                <span className="font-bold text-blue-700 block">🧠 Planner Subsystem</span>
                Graph topology path mapped successfully. Resource overhead footprint within performance specifications.
              </div>
              <div className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-lg text-xs">
                <span className="font-bold text-emerald-700 block">🛡️ Validation Layer</span>
                Active node metadata packages examined. Zero structural field anomalies detected.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}