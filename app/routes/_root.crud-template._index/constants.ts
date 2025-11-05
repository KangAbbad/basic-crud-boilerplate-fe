export const FILTER_STATUS_OPTIONS = [
  { value: 'all' as const, label: 'All' },
  { value: 'draft' as const, label: 'Draft' },
  { value: 'completed' as const, label: 'Completed' },
  { value: 'cancelled' as const, label: 'Cancelled' },
]

export const SORT_OPTIONS = [
  { value: 'createdAt' as const, label: 'Latest' },
  { value: 'name' as const, label: 'Name' },
]
