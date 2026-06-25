import AppShell from "@/components/AppShell";

export default function ExecutionsLogs() {
  const history = [
    { id: "TX-9018", workflow: "Custom Agent Engine Workflow", engine: "Claude 3.5 Sonnet", duration: "11.2s", status: "Success" },
    { id: "TX-9017", workflow: "Custom Agent Engine Workflow", engine: "Gemini 1.5 Pro", duration: "13.0s", status: "Success" }
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Execution Audit Logs</h1>
          <p className="text-gray-500 mt-1">Review deep transaction tracking metadata for past workflow iterations.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="px-6 py-3">Transaction ID</th>
                <th className="px-6 py-3">Target Workflow</th>
                <th className="px-6 py-3">Injected Engine</th>
                <th className="px-6 py-3">Runtime Speed</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700 font-medium">
              {history.map((h, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-indigo-600">{h.id}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">{h.workflow}</td>
                  <td className="px-6 py-4">{h.engine}</td>
                  <td className="px-6 py-4 text-gray-500">{h.duration}</td>
                  <td className="px-6 py-4"><span className="text-xs bg-green-100 text-green-800 font-bold px-2.5 py-0.5 rounded-full">{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}