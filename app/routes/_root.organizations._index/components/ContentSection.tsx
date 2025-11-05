import { OrganizationCard } from './OrganizationCard'
import { organizationActions, useOrganizationList, useSearchQuery } from '../stores/organizations.store'

export function ContentSection() {
  const organizationList = useOrganizationList()
  const searchQuery = useSearchQuery()
  const sortedAndFilteredOrganizationList = organizationActions.getSortedAndFilteredOrganizationList()

  if (organizationList.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No organizations yet</p>
          <p className="text-gray-400 text-sm">Create a new organization to get started</p>
        </div>
      </div>
    )
  }

  if (sortedAndFilteredOrganizationList.length === 0 && searchQuery) {
    return (
      <div className="flex-1 overflow-y-auto px-4">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No results found</p>
          <p className="text-gray-400 text-sm">Try searching with different keywords</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-4">
      {sortedAndFilteredOrganizationList.map((organization) => (
        <OrganizationCard key={organization.id} organization={organization} />
      ))}
    </div>
  )
}
