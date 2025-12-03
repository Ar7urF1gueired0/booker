'use client';

import { ReactNode } from 'react';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from '@/context/AuthContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={4000}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      preventDuplicate
    >
      <AuthProvider>{children}</AuthProvider>
    </SnackbarProvider>
  );
}
