import { idID } from '@clerk/localizations'
import { ClerkProvider } from '@clerk/react-router'
import type { ReactNode } from 'react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY')
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      localization={{
        ...idID,
        signIn: {
          ...idID.signIn,
          start: {
            ...idID.signIn?.start,
            title: 'Welcome to Basic CRUD Boilerplate',
            subtitle: 'Please sign in to continue',
          },
        },
        signUp: {
          ...idID.signUp,
          start: {
            ...idID.signUp?.start,
            title: 'Welcome to Basic CRUD Boilerplate',
            subtitle: 'Please sign up to continue',
          },
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
