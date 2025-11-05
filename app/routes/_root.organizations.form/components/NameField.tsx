import { memo } from 'react'
import { Controller, type Control } from 'react-hook-form'

import type { OrganizationFormDTO } from '../../_root.organizations._index/types/organization.types'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

type Props = {
  control: Control<OrganizationFormDTO>
}

export const NameField = memo(function NameField({ control }: Props) {
  return (
    <Controller
      name="name"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Organization name"
            className={error ? 'border-red-500' : ''}
            value={value}
            onChange={onChange}
          />
          {error && <p className="text-red-600 text-sm">{error.message}</p>}
        </div>
      )}
    />
  )
})
