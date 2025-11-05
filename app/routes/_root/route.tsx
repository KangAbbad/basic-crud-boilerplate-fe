import { useAuth } from '@clerk/react-router'
import { useEffect } from 'react'
import { Outlet } from 'react-router'

import { initializeDataStorage } from '../_root.crud-template._index/stores/crud-template.store'
import {
  initializeOrganizationsStorage,
  useIsInitialized,
} from '../_root.organizations._index/stores/organizations.store'

// Initialize react-scan for development performance monitoring
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  import('react-scan').then((mod) => {
    mod.scan()
  })
}

export default function RootLayout() {
  // const navigate = useNavigate()
  // const location = useLocation()
  // const { isLoaded, isSignedIn } = useAuth()
  const { isLoaded } = useAuth()
  // const organizationList = useOrganizationList()
  const isOrganizationInitialized = useIsInitialized()

  useEffect(() => {
    initializeOrganizationsStorage()
    initializeDataStorage()
  }, [])

  // useEffect(() => {
  //   const isOrganizationRoute = location.pathname.startsWith('/organizations')
  //   if (!isOrganizationRoute && isInitialized && organizationList?.length === 0) {
  //     navigate('/organizations/form', { replace: true })
  //   }
  // }, [organizationList, isInitialized, location.pathname, navigate])

  if (!isOrganizationInitialized || !isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // if (!isSignedIn) {
  //   return <Navigate to="/sign-in" replace />
  // }

  return (
    <div className="mobile-container">
      <Outlet />
    </div>
  )
}
