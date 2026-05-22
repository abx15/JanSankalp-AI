'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SessionGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  fallback?: React.ReactNode;
}

export default function SessionGuard({ children, requiredRole, fallback }: SessionGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      setIsValidating(true);
      
      if (status === 'loading') return;

      if (!session) {
        console.log('No session found, redirecting to signin...');
        router.push('/auth/signin');
        return;
      }

      // Check session validity via API
      try {
        const response = await fetch('/api/auth/refresh');
        const data = await response.json();
        
        if (!data.authenticated) {
          console.log('Session invalid, redirecting to signin...');
          router.push('/auth/signin');
          return;
        }

        // Check role requirements
        if (requiredRole && session.user?.role !== requiredRole) {
          console.log(`Access denied. Required: ${requiredRole}, Found: ${session.user?.role}`);
          
          // Redirect based on role
          if (session.user?.role === 'ADMIN') {
            router.push('/dashboard/admin');
          } else if (session.user?.role === 'OFFICER') {
            router.push('/dashboard/officer');
          } else {
            router.push('/dashboard');
          }
          return;
        }

        console.log('Session validated successfully for:', session.user?.email, 'Role:', session.user?.role);
      } catch (error) {
        console.error('Session validation error:', error);
        router.push('/auth/signin');
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, [session, status, router, requiredRole]);

  if (status === 'loading' || isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Validating session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
