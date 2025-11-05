import { SignIn } from '@clerk/react-router'

import type { Route } from './+types/route'

export function meta(_metaArgs: Route.MetaArgs) {
  return [{ title: 'Sign In - Basic CRUD Boilerplate' }]
}

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn
        appearance={{
          elements: {
            cardBox: 'shadow-none!',
            card: 'rounded-none!',
            formButtonPrimary: 'py-3!',
            formFieldInput: 'py-3!',
            formFieldLabel: 'text-left!',
            socialButtonsIconButton: 'py-2!',
          },
        }}
      />
    </div>
  )
}
