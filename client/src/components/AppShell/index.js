import { useAuthStore } from '../../context/AuthContext';
import { useRouter } from 'next/router';
import { LayoutDashboard, GitBranch, Radio, Cpu, LogOut } from 'lucide-react';

export default function AppShell({ children }) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Workflow Builder', path: '/workflows/builder', icon: GitBranch },
    { name: 'Integrations', path: '/integrations', icon: Cpu },
    { name: 'Executions Logs', path: '/executions', icon: Radio },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Workspace Operations Navigation Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">AF</div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">Agentflow_AI</span>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = router.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => router.push(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile Card and Session Actions Area */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <div className="px-4 py-2">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name || 'Operator Profile'}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role || 'operator'}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Canvas Viewport */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}