import { lazy, Suspense, useEffect, useState } from 'react'

const ReloadPromptClient = lazy(() =>
  import('./ReloadPrompt.client').then((mod) => ({
    default: mod.ReloadPromptClient,
  }))
)

export function ReloadPrompt() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <Suspense fallback={null}>
      <ReloadPromptClient />
    </Suspense>
  )
}
