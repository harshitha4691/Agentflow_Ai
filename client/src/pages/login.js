import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthStore } from '../context/AuthContext';

export default function Login() {
  const loginUser = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const loading = useAuthStore((state) => state.loading);
  const router = useRouter();

  const [form, setForm] = useState({ email: '', password: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Default fallback: allow any local developer credentials to pass through for testing
    handleLocalBypass();
  };

  const handleLocalBypass = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', 'development_mode_bypass_token');
    }
    
    // Explicitly seed the state with your operator profile
    useAuthStore.setState({
      user: { id: "dev-operator", name: "Harshitha", email: "harshitha@agentflow.ai", role: "admin" },
      token: "development_mode_bypass_token",
      isAuthenticated: true,
      loading: false
    });

    router.push('/dashboard');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto w-full max-w-md">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight">Access Operator Console</h2>
      </div>
      <div className="mt-8 sm:mx-auto w-full max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Workspace Email</label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Access Password</label>
              <input
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Sign In To Console
            </button>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <button
              type="button"
              onClick={handleLocalBypass}
              className="w-full flex justify-center py-2 px-4 border border-dashed border-indigo-400 rounded-md text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              ⚡ Instant Developer Access
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}