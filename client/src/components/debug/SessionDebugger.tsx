'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function SessionDebugger() {
  const { data: session, status, update } = useSession();
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  useEffect(() => {
    const info = {
      status,
      timestamp: new Date().toISOString(),
      session: session ? {
        email: session.user?.email,
        name: session.user?.name,
        role: session.user?.role,
        id: session.user?.id,
        expires: session.expires,
      } : null,
      cookies: document.cookie ? document.cookie.split(';').map(c => c.trim()) : [],
      localStorage: {
        keys: Object.keys(localStorage),
        nextAuth: Object.keys(localStorage).filter(k => k.includes('next-auth')),
      }
    };
    setSessionInfo(info);
  }, [session, status]);

  const refreshSession = async () => {
    await update();
  };

  const clearSession = () => {
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.reload();
  };

  if (typeof window === 'undefined') return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-2">Session Debugger</div>
      <div className="space-y-1">
        <div>Status: <span className={`px-2 py-1 rounded ${status === 'authenticated' ? 'bg-green-600' : status === 'loading' ? 'bg-yellow-600' : 'bg-red-600'}`}>{status}</span></div>
        {session && (
          <>
            <div>Email: {session.user?.email}</div>
            <div>Role: {session.user?.role}</div>
            <div>ID: {session.user?.id}</div>
          </>
        )}
        <div className="mt-2 space-x-2">
          <button onClick={refreshSession} className="px-2 py-1 bg-blue-600 rounded text-xs">Refresh</button>
          <button onClick={clearSession} className="px-2 py-1 bg-red-600 rounded text-xs">Clear</button>
        </div>
      </div>
      
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-2">
          <summary className="cursor-pointer">Debug Info</summary>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify(sessionInfo, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
