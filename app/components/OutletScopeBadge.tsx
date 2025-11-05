import { GlobeIcon, StoreIcon } from 'lucide-react'
import { useMemo } from 'react'

import { Badge } from '~/components/ui/badge'
import { useOrganizationList } from '~/routes/_root.organizations._index/stores/organizations.store'
import { getOrganizationScopeLabel } from '~/routes/_root.organizations._index/utils/organizationFiltering'

type OrganizationScopeBadgeProps = {
  organizationId?: string
  variant?: 'default' | 'secondary' | 'outline'
  showIcon?: boolean
  className?: string
}

export function OrganizationScopeBadge({
  organizationId,
  variant,
  showIcon = true,
  className,
}: OrganizationScopeBadgeProps) {
  const organizationList = useOrganizationList()
  const organization = useMemo(
    () => organizationList.find((o) => o.id === organizationId),
    [organizationList, organizationId]
  )

  const label = getOrganizationScopeLabel(organizationId, organization?.name)
  const badgeVariant = variant ?? (organizationId ? 'default' : 'secondary')

  return (
    <Badge variant={badgeVariant} className={className}>
      {showIcon && (
        <>{organizationId ? <StoreIcon className="h-3 w-3 mr-1" /> : <GlobeIcon className="h-3 w-3 mr-1" />}</>
      )}
      {label}
    </Badge>
  )
}
