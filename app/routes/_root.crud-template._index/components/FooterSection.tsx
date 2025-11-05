import { PlusIcon } from 'lucide-react'
import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router'

import { BottomTabs } from '~/components/BottomTabs'
import { Button } from '~/components/ui/button'

export const FooterSection = memo(function FooterSection() {
  const navigate = useNavigate()

  const navigateToCrudForm = useCallback(() => {
    navigate('/crud-template/form')
  }, [navigate])

  return (
    <div className="border-t border-gray-200 sticky bottom-0 z-20 bg-white">
      <div className="p-2">
        <Button variant="default" className="gap-1 w-full" onClick={navigateToCrudForm}>
          <PlusIcon className="w-5 h-5" />
          Add Data
        </Button>
      </div>
      <BottomTabs />
    </div>
  )
})
