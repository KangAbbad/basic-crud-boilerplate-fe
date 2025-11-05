import { memo } from 'react'
import { Controller, type Control } from 'react-hook-form'

import { OrganizationLogoUpload } from './OrganizationLogoUpload'
import type { OrganizationFormDTO } from '../../_root.organizations._index/types/organization.types'

type Props = {
  control: Control<OrganizationFormDTO>
}

export const LogoField = memo(function LogoField({ control }: Props) {
  return (
    <Controller
      name="logo"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <OrganizationLogoUpload logo={value} error={error?.message} onLogoChange={onChange} />
      )}
    />
  )
})
