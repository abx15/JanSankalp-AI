"use client";

import { SessionProvider } from "next-auth/react";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider 
      refetchInterval={5 * 60} // Refetch every 5 minutes
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  );
};
