import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState, type ReactNode, useEffect, Suspense, lazy } from 'react'

const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        gcTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient()
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    browserQueryClient ??= makeQueryClient()
    return browserQueryClient
  }
}

// const persister = createSyncStoragePersister({
//   storage: typeof window !== 'undefined' ? window.localStorage : undefined,
// })

const TanstackQueryDevtoolsProduction = lazy(() =>
  import('@tanstack/react-query-devtools/build/modern/production.js').then((d) => ({
    default: d.ReactQueryDevtools,
  }))
)

export function TanstackQueryProvider({ children }: { children: ReactNode }) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary
  const queryClient = getQueryClient()
  const [showDevtools, setShowDevtools] = useState<boolean>(false)

  useEffect(() => {
    // @ts-expect-error
    window.toggleDevtools = () => {
      setShowDevtools((ps) => !ps)
    }
  }, [])

  return (
    // <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools buttonPosition="bottom-left" />
      {showDevtools && (
        <Suspense fallback={null}>
          <TanstackQueryDevtoolsProduction />
        </Suspense>
      )}
    </QueryClientProvider>
  )
}
