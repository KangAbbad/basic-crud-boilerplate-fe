import { ArrowLeftIcon } from 'lucide-react'
import { memo } from 'react'

import { Button } from '~/components/ui/button'

type Props = {
  isEditMode: boolean
  onCancel: () => void
}

export const FormHeader = memo(function FormHeader({ isEditMode, onCancel }: Props) {
  const title = isEditMode ? 'Edit Organization' : 'Create Organization'

  return (
    <div className="border-b border-gray-200 sticky top-0 z-10 bg-white">
      <div className="flex items-center gap-2 p-4 -ml-2">
        <Button type="button" variant="ghost" size="icon" className="h-auto w-auto p-1" onClick={onCancel}>
          <ArrowLeftIcon className="w-6! h-6!" />
        </Button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
    </div>
  )
})
