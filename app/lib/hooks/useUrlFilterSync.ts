import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'

type SortDirection = 'asc' | 'desc'

export type UrlFilterConfig = {
  search?: string
  sortBy?: string
  sortDir?: SortDirection
  status?: string
  tab?: string
  category?: string
}

export type UseUrlFilterSyncOptions = {
  defaultFilters: UrlFilterConfig
  debounceSearch?: number
}

export type UseUrlFilterSyncReturn = {
  filterList: UrlFilterConfig
  updateFilter: (key: keyof UrlFilterConfig, value: string | null) => void
  updateFilterList: (updates: Partial<UrlFilterConfig>) => void
}

export function useUrlFilterSync(options: UseUrlFilterSyncOptions): UseUrlFilterSyncReturn {
  const { defaultFilters, debounceSearch = 300 } = options
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterList, setFilterList] = useState<UrlFilterConfig>(() => ({
    search: searchParams.get('search') ?? defaultFilters.search,
    sortBy: searchParams.get('sortBy') ?? defaultFilters.sortBy,
    sortDir: (searchParams.get('sortDir') as SortDirection) ?? defaultFilters.sortDir,
    status: searchParams.get('status') ?? defaultFilters.status,
    tab: searchParams.get('tab') ?? defaultFilters.tab,
    category: searchParams.get('category') ?? defaultFilters.category,
  }))

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const syncToUrl = (newFilters: UrlFilterConfig) => {
    const params = new URLSearchParams(searchParams)

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== defaultFilters[key as keyof UrlFilterConfig]) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    setSearchParams(params, { replace: true })
  }

  const updateFilter = (key: keyof UrlFilterConfig, value: string | null) => {
    setFilterList((prev) => {
      const updated = {
        ...prev,
        [key]: value,
      }

      if (key === 'search') {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
        debounceTimerRef.current = setTimeout(() => {
          syncToUrl(updated)
        }, debounceSearch)
      } else {
        syncToUrl(updated)
      }

      return updated
    })
  }

  const updateFilterList = (updates: Partial<UrlFilterConfig>) => {
    setFilterList((prev) => {
      const updated = {
        ...prev,
        ...updates,
      }
      syncToUrl(updated)
      return updated
    })
  }

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return {
    filterList,
    updateFilter,
    updateFilterList,
  }
}
