'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

export default function TestAuth() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <div className="space-y-4">
        <div>
          <strong>Status:</strong> {status}
        </div>
        
        {session ? (
          <div>
            <div>
              <strong>Logged in as:</strong> {session.user?.email}
            </div>
            <div>
              <strong>Role:</strong> {session.user?.role}
            </div>
            <div>
              <strong>Name:</strong> {session.user?.name}
            </div>
            <button 
              onClick={() => signOut()}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div>
            <p>Not logged in</p>
            <button 
              onClick={() => signIn('credentials', {
                email: 'admin@jansankalp.ai',
                password: 'admin123'
              })}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Sign In as Admin
            </button>
          </div>
        )}
        
        <div className="mt-8">
          <a href="/dashboard/admin" className="text-blue-500 underline">
            Go to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
