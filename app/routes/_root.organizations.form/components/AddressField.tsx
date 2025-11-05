import { memo } from 'react'
import { Controller, type Control } from 'react-hook-form'

import type { OrganizationFormDTO } from '../../_root.organizations._index/types/organization.types'

import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'

type Props = {
  control: Control<OrganizationFormDTO>
}

export const AddressField = memo(function AddressField({ control }: Props) {
  return (
    <Controller
      name="address"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="address">
            Address <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="address"
            placeholder="Complete address"
            rows={3}
            className={error ? 'border-red-500' : ''}
            value={value}
            onChange={onChange}
          />
          {error && <p className="text-red-600 text-sm">{error?.message}</p>}
        </div>
      )}
    />
  )
})
