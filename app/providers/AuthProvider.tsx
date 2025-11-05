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
            title: 'Selamat Datang di Qlover Laundry',
            subtitle: 'Silahkan masuk untuk melanjutkan',
          },
        },
        signUp: {
          ...idID.signUp,
          start: {
            ...idID.signUp?.start,
            title: 'Selamat Datang di Qlover Laundry',
            subtitle: 'Silahkan daftar untuk melanjutkan',
          },
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
