/**
 * Core filtering utilities for organization-scoped data
 *
 * Business Rules:
 * - Global data (organizationId = undefined/null) is visible to ALL organizations
 * - Organization-specific data is only visible in that organization
 * - When an organization is selected, show both global entities AND organization-specific entities
 */

/**
 * Filter a list of entities by organization scope
 * @param dataList - Array of entities with optional organizationId
 * @param selectedOrganizationId - Currently selected organization ID (null if no organization selected)
 * @returns Filtered array showing global entities + organization-specific entities
 */
export const filterByOrganization = <T extends { organizationId?: string }>(
  dataList: T[],
  selectedOrganizationId: string | null
): T[] => {
  // If no organization selected, return all data
  if (!selectedOrganizationId) return dataList

  // Return global entities (no organizationId) + entities for selected organization
  return dataList.filter(
    (entity) =>
      !entity.organizationId || // Global entities
      entity.organizationId === selectedOrganizationId // Organization-specific entities
  )
}

/**
 * Check if an entity is globally available
 * @param entity - Entity with optional organizationId
 * @returns true if entity is available to all organizations
 */
export const isGlobalEntity = <T extends { organizationId?: string }>(entity: T): boolean => {
  return !entity.organizationId
}

/**
 * Check if an entity belongs to a specific organization
 * @param entity - Entity with optional organizationId
 * @param organizationId - Organization ID to check against
 * @returns true if entity belongs to the specified organization
 */
export const belongsToOrganization = <T extends { organizationId?: string }>(
  entity: T,
  organizationId: string
): boolean => {
  return entity.organizationId === organizationId
}

/**
 * Get scope label for display
 * @param organizationId - Optional organization ID
 * @param organizationName - Optional organization name for display
 * @returns Human-readable scope label
 */
export const getOrganizationScopeLabel = (organizationId?: string, organizationName?: string): string => {
  if (!organizationId) return 'All Organizations'
  return organizationName ?? 'Organization-specific'
}

/**
 * Group entities by organization scope
 * @param dataList - Array of entities with optional organizationId
 * @returns Object with global and organization-specific groups
 */
export const groupByOrganizationScope = <T extends { organizationId?: string }>(
  dataList: T[]
): {
  global: T[]
  organizationSpecific: Map<string, T[]>
} => {
  const global: T[] = []
  const organizationSpecific = new Map<string, T[]>()

  dataList.forEach((entity) => {
    if (!entity.organizationId) {
      global.push(entity)
    } else {
      const organizationEntities = organizationSpecific.get(entity.organizationId) ?? []
      organizationEntities.push(entity)
      organizationSpecific.set(entity.organizationId, organizationEntities)
    }
  })

  return { global, organizationSpecific }
}
