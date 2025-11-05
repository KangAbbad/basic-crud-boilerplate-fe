import { memo } from 'react'
import { Controller, type Control } from 'react-hook-form'

import type { OrganizationFormDTO } from '../../_root.organizations._index/types/organization.types'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { sanitizeNumberInput } from '~/lib/utils/numberInputValidator'

type Props = {
  control: Control<OrganizationFormDTO>
}

export const PostalCodeField = memo(function PostalCodeField({ control }: Props) {
  return (
    <Controller
      name="postalCode"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="postalCode">
            Postal Code <span className="text-destructive">*</span>
          </Label>
          <Input
            id="postalCode"
            placeholder="12345"
            className={error ? 'border-red-500' : ''}
            value={value}
            onChange={(e) => {
              onChange(sanitizeNumberInput(e.target.value))
            }}
          />
          {error && <p className="text-red-600 text-sm">{error?.message}</p>}
        </div>
      )}
    />
  )
})
