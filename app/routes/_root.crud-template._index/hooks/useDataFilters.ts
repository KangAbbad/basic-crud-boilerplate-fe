import { useCallback, useEffect } from 'react'

import {
  dataActions,
  useFilterStatus,
  useSearchQuery,
  useSortBy,
  useSortDirection,
  type FilterStatus,
  type SortDirection,
  type SortField,
} from '../stores/crud-template.store'

import { useUrlFilterSync } from '~/lib/hooks/useUrlFilterSync'

export function useDataFilters() {
  const searchQuery = useSearchQuery()
  const sortBy = useSortBy()
  const sortDirection = useSortDirection()
  const filterStatus = useFilterStatus()

  const { filterList, updateFilter } = useUrlFilterSync({
    defaultFilters: {
      search: '',
      sortBy: 'createdAt',
      sortDir: 'desc',
      status: 'all',
    },
  })

  useEffect(() => {
    dataActions.setSearchQuery(filterList.search ?? '')
    dataActions.setSortBy((filterList.sortBy ?? 'createdAt') as SortField)
    dataActions.setSortDirection((filterList.sortDir ?? 'desc') as SortDirection)
    dataActions.setFilterStatus((filterList.status ?? 'all') as FilterStatus)
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

  const updateFilterStatus = useCallback(
    (status: FilterStatus) => {
      updateFilter('status', status)
    },
    [updateFilter]
  )

  const updateSortBy = useCallback(
    (field: SortField) => {
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
    filterStatus,
    updateSearchQuery,
    clearSearch,
    updateFilterStatus,
    updateSortBy,
  }
}
