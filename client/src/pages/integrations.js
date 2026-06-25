import AppShell from "@/components/AppShell";

export default function Integrations() {
  const platforms = [
    { name: "Slack", type: "Notification", icon: "💬", desc: "Post execution summaries straight to workspace channels.", status: "Connected" },
    { name: "GitHub", type: "DevOps", icon: "💻", desc: "Trigger automated commits and tracking loops on pull requests.", status: "Configure" },
    { name: "Discord Webhooks", type: "Notification", icon: "👾", desc: "Forward stream outputs directly into community logs.", status: "Configure" }
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">App Integrations</h1>
          <p className="text-gray-500 mt-1">Link third-party platforms to your active automated pipeline workflows.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((p, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl p-2 bg-gray-50 rounded-lg">{p.icon}</span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${p.status === 'Connected' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{p.status}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mt-4">{p.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">{p.type}</p>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{p.desc}</p>
              </div>
              <button className="mt-5 w-full py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm font-semibold rounded-lg text-gray-700 transition-colors">
                Manage Integration
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}