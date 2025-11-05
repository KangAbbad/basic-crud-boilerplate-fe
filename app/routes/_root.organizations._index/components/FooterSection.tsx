import { PlusIcon } from 'lucide-react'
import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router'

import { Button } from '~/components/ui/button'

export const FooterSection = memo(function FooterSection() {
  const navigate = useNavigate()

  const navigateToOrganizationForm = useCallback(() => {
    navigate('/organizations/form')
  }, [navigate])

  return (
    <div className="border-t border-gray-200 sticky bottom-0 z-20 bg-white">
      <div className="w-full p-4">
        <Button variant="default" className="gap-1 w-full" onClick={navigateToOrganizationForm}>
          <PlusIcon className="w-5 h-5" />
          Add Organization
        </Button>
      </div>
    </div>
  )
})
