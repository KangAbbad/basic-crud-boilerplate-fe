import { useRegisterSW } from 'virtual:pwa-register/react'

export function ReloadPromptClient() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r)
    },
    onRegisterError(error) {
      console.log('SW registration error', error)
    },
  })

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  return (
    <div className="fixed bottom-0 right-0 z-50 m-4">
      {(offlineReady || needRefresh) && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 max-w-sm p-4 shadow-lg">
          <div className="mb-3">
            {offlineReady ? (
              <span className="text-sm text-gray-700 dark:text-gray-300">App ready to work offline</span>
            ) : (
              <span className="text-sm text-gray-700 dark:text-gray-300">
                New content available, click reload to update.
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {needRefresh && (
              <button
                className="rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors px-4 py-2"
                onClick={() => updateServiceWorker(true)}
              >
                Reload
              </button>
            )}
            <button
              className="rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm transition-colors px-4 py-2"
              onClick={() => {
                close()
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
