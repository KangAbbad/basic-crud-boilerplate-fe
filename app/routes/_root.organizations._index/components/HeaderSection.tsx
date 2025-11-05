import { ArrowLeftIcon, XIcon } from 'lucide-react'
import { memo, useCallback } from 'react'
import { useNavigate } from 'react-router'

import { useOrganizationFilters } from '../hooks/useOrganizationFilters'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

const SORT_OPTIONS = [
  { value: 'createdAt' as const, label: 'Latest' },
  { value: 'name' as const, label: 'Name' },
  { value: 'city' as const, label: 'City' },
]

export const HeaderSection = memo(function HeaderSection() {
  const navigate = useNavigate()
  const { searchQuery, sortBy, sortDirection, updateSearchQuery, clearSearch, updateSortBy } = useOrganizationFilters()

  const navigateToHome = useCallback(() => {
    navigate('/')
  }, [navigate])

  return (
    <div className="border-b border-gray-200 sticky top-0 z-10 bg-white">
      <div className="flex items-center gap-2 w-full p-4 -ml-1">
        <Button type="button" variant="ghost" size="icon" className="h-auto w-auto p-1" onClick={navigateToHome}>
          <ArrowLeftIcon className="w-6! h-6!" />
        </Button>
        <h1 className="text-xl font-bold">Organization</h1>
      </div>
      <div className="space-y-3 w-full px-4 pb-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search organization, city, or address..."
            value={searchQuery}
            className="cursor-text py-5 pr-10"
            onChange={(e) => {
              updateSearchQuery(e.target.value)
            }}
          />
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Clear search"
              className="absolute right-2 top-1/2 text-gray-400 hover:text-gray-600 w-auto h-auto p-1 -translate-y-1/2"
              onClick={clearSearch}
            >
              <XIcon className="w-4! h-4!" />
            </Button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {SORT_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? 'info' : 'outline'}
              size="sm"
              className="rounded-full"
              onClick={() => {
                updateSortBy(option.value)
              }}
            >
              {option.label} {sortBy === option.value && (sortDirection === 'asc' ? '↑' : '↓')}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
})
