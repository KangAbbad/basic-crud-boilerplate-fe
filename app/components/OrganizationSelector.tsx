import { useMemo } from 'react'

import { Badge } from '~/components/ui/badge'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useOrganizationList } from '~/routes/_root.organizations._index/stores/organizations.store'

type OrganizationSelectorProps = {
  value?: string
  error?: string
  label?: string
  required?: boolean
  placeholder?: string
  disabled?: boolean
  showBadge?: boolean
  allowGlobal?: boolean // If false, must select a specific organization (for carts)
  onChange: (value: string | undefined) => void
}

export function OrganizationSelector({
  value,
  onChange,
  error,
  label = 'Organization Scope',
  required = false,
  placeholder = 'Select organization scope',
  disabled = false,
  showBadge = true,
  allowGlobal = true,
}: OrganizationSelectorProps) {
  const organizationList = useOrganizationList()
  const selectedOrganization = useMemo(
    () => organizationList.find((organization) => organization.id === value),
    [organizationList, value]
  )

  // Normalize value: undefined, null, or empty string → '__GLOBAL__'
  const normalizedValue = value && value !== '' ? value : '__GLOBAL__'

  return (
    <div className="space-y-2">
      <Label htmlFor="organizationID">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Select
        value={normalizedValue}
        onValueChange={(val) => {
          const newValue = val === '__GLOBAL__' ? undefined : val
          onChange(newValue)
        }}
        disabled={disabled}
      >
        <SelectTrigger id="organizationID">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {allowGlobal && <SelectItem value="__GLOBAL__">All Organizations</SelectItem>}
          {organizationList.map((organization) => (
            <SelectItem key={organization.id} value={organization.id}>
              {organization.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showBadge && (
        <div className="flex gap-2">
          {value && value !== '' ? (
            <Badge>Organisasi-spesifik: {selectedOrganization?.name}</Badge>
          ) : (
            allowGlobal && <Badge variant="secondary">Available in all organizations</Badge>
          )}
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  )
}
