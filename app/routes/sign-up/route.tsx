import { SignUp } from '@clerk/react-router'

import type { Route } from './+types/route'

export function meta(_metaArgs: Route.MetaArgs) {
  return [{ title: 'Sign Up - Basic CRUD Boilerplate' }]
}

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignUp
        appearance={{
          elements: {
            cardBox: 'shadow-none!',
            card: 'rounded-none!',
            formButtonPrimary: 'py-3!',
            formFieldInput: 'py-3!',
            socialButtonsIconButton: 'py-2!',
          },
        }}
      />
    </div>
  )
}
