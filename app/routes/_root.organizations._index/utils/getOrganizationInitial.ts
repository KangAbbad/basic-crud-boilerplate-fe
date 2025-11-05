export function getOrganizationInitial(organizationName: string): string {
  return organizationName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 3)
}
