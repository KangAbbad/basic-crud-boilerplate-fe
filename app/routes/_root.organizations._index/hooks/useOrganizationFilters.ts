import { useCallback, useEffect } from 'react'

import { organizationActions, useSearchQuery, useSortBy, useSortDirection } from '../stores/organizations.store'

import { useUrlFilterSync } from '~/lib/hooks/useUrlFilterSync'

export function useOrganizationFilters() {
  const searchQuery = useSearchQuery()
  const sortBy = useSortBy()
  const sortDirection = useSortDirection()

  const { filterList, updateFilter } = useUrlFilterSync({
    defaultFilters: {
      search: '',
      sortBy: 'createdAt',
      sortDir: 'desc',
    },
  })

  useEffect(() => {
    organizationActions.setSearchQuery(filterList.search ?? '')
    organizationActions.setSortBy((filterList.sortBy ?? 'createdAt') as 'name' | 'city' | 'createdAt')
    organizationActions.setSortDirection((filterList.sortDir ?? 'desc') as 'asc' | 'desc')
  }, [filterList])

  const updateSearchQuery = useCallback(
    (value: string) => {
      updateFilter('search', value || null)
    },
    [updateFilter]
  )

  const clearSearch = useCallback(() => {
    updateFilter('search', null)
  }, [updateFilter])

  const updateSortBy = useCallback(
    (field: 'name' | 'city' | 'createdAt') => {
      if (sortBy === field) {
        updateFilter('sortDir', sortDirection === 'asc' ? 'desc' : 'asc')
      } else {
        updateFilter('sortBy', field)
        updateFilter('sortDir', 'asc')
      }
    },
    [sortBy, sortDirection, updateFilter]
  )

  return {
    searchQuery,
    sortBy,
    sortDirection,
    updateSearchQuery,
    clearSearch,
    updateSortBy,
  }
}
