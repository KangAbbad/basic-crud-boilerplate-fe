import { memo } from 'react'
import { Controller, type Control, useWatch } from 'react-hook-form'

import type { OrganizationFormDTO } from '../../_root.organizations._index/types/organization.types'

import { SelectCity } from '~/components/CustomSelect/SelectCity'
import { Label } from '~/components/ui/label'

type Props = {
  control: Control<OrganizationFormDTO>
}

export const CityField = memo(function CityField({ control }: Props) {
  const selectedProvince = useWatch({ control, name: 'province' })

  return (
    <Controller
      name="city"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="city">
            City <span className="text-destructive">*</span>
          </Label>
          <SelectCity
            value={value}
            disabled={!selectedProvince}
            provinceID={selectedProvince}
            error={error?.message}
            onChange={onChange}
          />
          {error && <p className="text-red-600 text-sm">{error?.message}</p>}
        </div>
      )}
    />
  )
})
