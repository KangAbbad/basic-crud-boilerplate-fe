import { XIcon } from 'lucide-react'
import { memo } from 'react'

import { FILTER_STATUS_OPTIONS, SORT_OPTIONS } from '../constants'
import { useDataFilters } from '../hooks/useDataFilters'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { cn } from '~/lib/utils/cn'

export const HeaderSection = memo(function HeaderSection() {
  const {
    searchQuery,
    sortBy,
    sortDirection,
    filterStatus,
    updateSearchQuery,
    clearSearch,
    updateFilterStatus,
    updateSortBy,
  } = useDataFilters()

  return (
    <div className="border-b border-gray-200 sticky top-0 z-10 bg-white">
      <div className="p-4">
        <h1 className="text-xl font-bold">Crud Template</h1>
      </div>
      <div className="space-y-3 w-full px-4 pb-3">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search name, phone..."
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
          <Select value={filterStatus} onValueChange={updateFilterStatus}>
            <SelectTrigger
              className={cn(
                'rounded-full w-auto h-9!',
                filterStatus !== 'all' && 'bg-info text-white [&_svg]:text-white! [&_svg]:opacity-100'
              )}
            >
              <SelectValue placeholder="Filter by status..." />
            </SelectTrigger>
            <SelectContent>
              {FILTER_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
