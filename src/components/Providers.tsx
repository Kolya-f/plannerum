'use client'

import { AuthProvider } from '@/lib/auth/context'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const AuthProviderAny = AuthProvider as any
  return (
    <AuthProviderAny>
      {children}
    </AuthProviderAny>
  )
}
