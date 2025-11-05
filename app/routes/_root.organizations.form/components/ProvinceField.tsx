import { memo } from 'react'
import { Controller, type Control } from 'react-hook-form'

import type { OrganizationFormDTO } from '../../_root.organizations._index/types/organization.types'

import { SelectProvince } from '~/components/CustomSelect/SelectProvince'
import { Label } from '~/components/ui/label'

type Props = {
  control: Control<OrganizationFormDTO>
}

export const ProvinceField = memo(function ProvinceField({ control }: Props) {
  return (
    <Controller
      name="province"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="province">
            Province <span className="text-destructive">*</span>
          </Label>
          <SelectProvince value={value} error={error?.message} onChange={onChange} />
          {error && <p className="text-red-600 text-sm">{error?.message}</p>}
        </div>
      )}
    />
  )
})
