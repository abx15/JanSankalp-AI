'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function TestAllRoles() {
  const { data: session, status } = useSession();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testLogin = async (email: string, password: string, role: string) => {
    addLog(`🔐 Testing ${role} login with ${email}`);
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        addLog(`❌ ${role} login failed: ${result.error}`);
      } else {
        addLog(`✅ ${role} login successful!`);
        addLog(`👤 User: ${session?.user?.name}`);
        addLog(`🔐 Role: ${session?.user?.role}`);
      }
    } catch (error) {
      addLog(`❌ ${role} login error: ${error}`);
    }
  };

  const testLogout = async () => {
    addLog('🚪 Signing out...');
    await signOut();
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">🧪 Role-Based Authentication Test</h1>
        
        {/* Session Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Session Status</h2>
          <div className="space-y-2">
            <div><strong>Status:</strong> <span className={`px-2 py-1 rounded ${status === 'authenticated' ? 'bg-green-100 text-green-800' : status === 'loading' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{status}</span></div>
            {session && (
              <>
                <div><strong>Email:</strong> {session.user?.email}</div>
                <div><strong>Name:</strong> {session.user?.name}</div>
                <div><strong>Role:</strong> <span className={`px-2 py-1 rounded ${session.user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : session.user?.role === 'OFFICER' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{session.user?.role}</span></div>
              </>
            )}
          </div>
          
          {session && (
            <button 
              onClick={testLogout}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Different Roles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => testLogin('admin@jansankalp.ai', 'admin123', 'ADMIN')}
              className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              <div className="font-bold">👑 Admin Login</div>
              <div className="text-sm">admin@jansankalp.ai</div>
            </button>
            
            <button
              onClick={() => testLogin('officer@jansankalp.ai', 'officer123', 'OFFICER')}
              className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <div className="font-bold">👔 Officer Login</div>
              <div className="text-sm">officer@jansankalp.ai</div>
            </button>
            
            <button
              onClick={() => testLogin('citizen@jansankalp.ai', 'citizen123', 'CITIZEN')}
              className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <div className="font-bold">👤 Citizen Login</div>
              <div className="text-sm">citizen@jansankalp.ai</div>
            </button>
          </div>
        </div>

        {/* Dashboard Links */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Dashboard Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/dashboard/admin" className="block p-4 border rounded-lg hover:bg-gray-50">
              <div className="font-bold">👑 Admin Dashboard</div>
              <div className="text-sm text-gray-600">/dashboard/admin</div>
            </a>
            
            <a href="/dashboard/officer" className="block p-4 border rounded-lg hover:bg-gray-50">
              <div className="font-bold">👔 Officer Dashboard</div>
              <div className="text-sm text-gray-600">/dashboard/officer</div>
            </a>
            
            <a href="/dashboard" className="block p-4 border rounded-lg hover:bg-gray-50">
              <div className="font-bold">👤 Citizen Dashboard</div>
              <div className="text-sm text-gray-600">/dashboard</div>
            </a>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Activity Logs</h2>
            <button 
              onClick={clearLogs}
              className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
            >
              Clear Logs
            </button>
          </div>
          <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs yet. Try logging in with different roles...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
