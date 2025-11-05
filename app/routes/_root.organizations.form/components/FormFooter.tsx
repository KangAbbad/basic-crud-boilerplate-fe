import { memo } from 'react'

import { Button } from '~/components/ui/button'

type Props = {
  onSubmit: () => void
}

export const FormFooter = memo(function FormFooter({ onSubmit }: Props) {
  return (
    <div className="border-t border-gray-200 sticky bottom-0 z-20 bg-white p-4">
      <Button className="h-11 w-full" onClick={onSubmit}>
        Save
      </Button>
    </div>
  )
})
