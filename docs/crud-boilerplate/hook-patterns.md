# Common Hook Patterns

[← Form Patterns](./form-patterns.md) | [Next: Checklist →](./checklist.md)

---

Beyond standard form hooks, here are common patterns from actual features:

---

## 1. Filter/Search Hook with URL Sync

**Use Case**: List pages with search/filter/sort synced to URL params

**File**: `hooks/use{Feature}Filters.ts`

### Example from Carts Feature

```typescript
import { useCallback, useEffect } from 'react'

import type { FilterStatus } from '../stores/cart.store'
import { cartActions, useFilterStatus, useSearchQuery, useSortBy, useSortDirection } from '../stores/cart.store'
import { useUrlFilterSync } from '~/lib/hooks/useUrlFilterSync'

export function useCartFilters() {
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
    cartActions.setSearchQuery(filterList.search ?? '')
    cartActions.setSortBy((filterList.sortBy ?? 'createdAt') as 'createdAt' | 'estimationDate' | 'totalPrice')
    cartActions.setSortDirection((filterList.sortDir ?? 'desc') as 'asc' | 'desc')
    cartActions.setFilterStatus((filterList.status ?? 'all') as FilterStatus)
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
    (field: 'createdAt' | 'estimationDate' | 'totalPrice') => {
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
```

### Generic Template

```typescript
import { useCallback, useEffect } from 'react'

import type { FilterStatus } from '../stores/{feature}.store'
import { {feature}Actions, useFilterStatus, useSearchQuery, useSortBy, useSortDirection } from '../stores/{feature}.store'
import { useUrlFilterSync } from '~/lib/hooks/useUrlFilterSync'

export function use{Feature}Filters() {
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
    {feature}Actions.setSearchQuery(filterList.search ?? '')
    {feature}Actions.setSortBy((filterList.sortBy ?? 'createdAt') as SortField)
    {feature}Actions.setSortDirection((filterList.sortDir ?? 'desc') as 'asc' | 'desc')
    {feature}Actions.setFilterStatus((filterList.status ?? 'all') as FilterStatus)
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
```

### Benefits
- URL params sync (shareable URLs)
- Browser back/forward support
- Debounced search (300ms)

---

## 2. Local Filter Hook (No URL)

**Use Case**: Complex filtering without URL sync (modals, drawers)

### Example from Audit Logs Feature

```typescript
import { useState, useMemo } from 'react'

export function useAuditLogList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'occurredAt' | 'entity'>('occurredAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [entityFilter, setEntityFilter] = useState<'all' | string>('all')

  const auditLogList = auditLogActions.getAuditLogList()

  const filteredAndSortedList = useMemo(() => {
    let result = [...auditLogList]

    // Apply filters
    if (entityFilter !== 'all') {
      result = result.filter((log) => log.entity === entityFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((log) =>
        log.entityID.toLowerCase().includes(query) ||
        log.actor.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      let compareA: any = a[sortBy]
      let compareB: any = b[sortBy]

      if (sortBy === 'occurredAt') {
        compareA = new Date(compareA).getTime()
        compareB = new Date(compareB).getTime()
      }

      if (compareA < compareB) {
        return sortDirection === 'asc' ? -1 : 1
      }
      if (compareA > compareB) {
        return sortDirection === 'asc' ? 1 : -1
      }
      return 0
    })

    return result
  }, [auditLogList, searchQuery, sortBy, sortDirection, entityFilter])

  return {
    auditLogList: filteredAndSortedList,
    searchQuery,
    setSearchQuery,
    entityFilter,
    setEntityFilter,
  }
}
```

### Generic Template

```typescript
import { useState, useMemo } from 'react'

export function use{Feature}List() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState<'all' | string>('all')

  const {feature}List = {feature}Actions.get{Feature}List()

  const filteredAndSortedList = useMemo(() => {
    let result = [...{feature}List]

    // Apply filters
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter((item) =>
        item.name.toLowerCase().includes(query)
        // Add other searchable fields
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      let compareA: any = a[sortBy]
      let compareB: any = b[sortBy]

      // Handle date fields
      if (sortBy === 'createdAt') {
        compareA = new Date(compareA).getTime()
        compareB = new Date(compareB).getTime()
      }

      if (compareA < compareB) {
        return sortDirection === 'asc' ? -1 : 1
      }
      if (compareA > compareB) {
        return sortDirection === 'asc' ? 1 : -1
      }
      return 0
    })

    return result
  }, [{feature}List, searchQuery, sortBy, sortDirection, statusFilter])

  return {
    {feature}List: filteredAndSortedList,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  }
}
```

### Benefits
- Full control, no URL coupling
- Complex multi-criteria filtering
- Memoized for performance

---

## 3. Modal State Hook

### Example from Outlets Feature

```typescript
import { useObservable } from '@legendapp/state/react'

export function useLocationPicker(initialLat?: number, initialLng?: number) {
  const isOpen$ = useObservable(false)
  const latitude$ = useObservable(initialLat ?? -6.2088)
  const longitude$ = useObservable(initialLng ?? 106.8456)

  const showModal = (): void => {
    isOpen$.set(true)
  }

  const hideModal = (): void => {
    isOpen$.set(false)
  }

  const selectLocation = (lat: number, lng: number): void => {
    latitude$.set(lat)
    longitude$.set(lng)
    hideModal()
  }

  return {
    isOpen$,
    latitude$,
    longitude$,
    showModal,
    hideModal,
    selectLocation,
  }
}
```

### Generic Template

```typescript
import { useObservable } from '@legendapp/state/react'

export function use{Feature}Modal(initialValue?: DataType) {
  const isOpen$ = useObservable(false)
  const selected{Feature}$ = useObservable<DataType | null>(initialValue ?? null)

  const showModal = (): void => {
    isOpen$.set(true)
  }

  const hideModal = (): void => {
    isOpen$.set(false)
  }

  const select{Feature} = (value: DataType): void => {
    selected{Feature}$.set(value)
    hideModal()
  }

  const clearSelection = (): void => {
    selected{Feature}$.set(null)
  }

  return {
    isOpen$,
    selected{Feature}$,
    showModal,
    hideModal,
    select{Feature},
    clearSelection,
  }
}
```

### Benefits
- Clean modal state with Legend State
- Reusable pattern

---

## 4. Live Calculation Hook

### Example from Carts Feature

```typescript
import { useMemo } from 'react'
import { useWatch, type Control } from 'react-hook-form'

import { calculateCartPricing } from '~/lib/utils/cartPriceCalculator'

export const useCartPricing = (control: Control<CreateCartFormDTO>) => {
  const servicePackageID = useWatch({ control, name: 'servicePackageID' })
  const weightQuantity = useWatch({ control, name: 'weightQuantity' })
  const itemQuantity = useWatch({ control, name: 'itemQuantity' })

  const estimatedTotal = useMemo(() => {
    if (!servicePackageID || !weightQuantity || !itemQuantity) {
      return null
    }

    return calculateCartPricing({
      servicePackage: selectedPackage,
      serviceAddons: selectedAddonList,
      weightQuantity,
      itemQuantity,
      taxPercentage,
      couponDiscountPercent: 0,
    })
  }, [servicePackageID, weightQuantity, itemQuantity])

  return {
    estimatedTotal,
  }
}
```

### Generic Template

```typescript
import { useMemo } from 'react'
import { useWatch, type Control } from 'react-hook-form'

import { calculate{Feature}Total } from '~/lib/utils/{feature}Calculator'

export const use{Feature}Calculation = (control: Control<Create{Feature}FormDTO>) => {
  const field1 = useWatch({ control, name: 'field1' })
  const field2 = useWatch({ control, name: 'field2' })
  const field3 = useWatch({ control, name: 'field3' })

  const calculatedResult = useMemo(() => {
    if (!field1 || !field2) {
      return null
    }

    return calculate{Feature}Total({
      field1,
      field2,
      field3,
      // ... other calculation parameters
    })
  }, [field1, field2, field3])

  return {
    calculatedResult,
  }
}
```

### Benefits
- Live updates as user types
- Centralized calculation logic
- Memoized for performance

---

## 5. Metrics/Aggregation Hook

### Example from Overview Feature

```typescript
import { useMemo } from 'react'

import { useCartList } from '~/routes/_root.carts._index/stores/cart.store'
import { useSelectedOutlet } from '~/routes/_root.outlets._index/stores/outlets.store'

export function useTodayMetrics() {
  const carts = useCartList()
  const selectedOutlet = useSelectedOutlet()

  return useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const filtered = selectedOutlet
      ? carts.filter((cart) => cart.outletID === selectedOutlet.id)
      : carts

    const todayCount = filtered.filter((cart) => {
      const createdDate = new Date(cart.createdAt)
      return createdDate >= today
    }).length

    const todayRevenue = filtered
      .filter((cart) => cart.status === 'paid')
      .reduce((sum, cart) => sum + cart.totalPrice, 0)

    return {
      todayCount,
      todayRevenue,
    }
  }, [carts, selectedOutlet])
}
```

### Generic Template

```typescript
import { useMemo } from 'react'

import { use{Feature}List } from '~/routes/_root.{feature}._index/stores/{feature}.store'
import { useSelectedOutlet } from '~/routes/_root.outlets._index/stores/outlets.store'

export function use{Feature}Metrics() {
  const {feature}List = use{Feature}List()
  const selectedOutlet = useSelectedOutlet()

  return useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const filtered = selectedOutlet
      ? {feature}List.filter((item) => item.outletID === selectedOutlet.id)
      : {feature}List

    const todayCount = filtered.filter((item) => {
      const createdDate = new Date(item.createdAt)
      return createdDate >= today
    }).length

    const totalValue = filtered
      .filter((item) => item.status === 'completed')
      .reduce((sum, item) => sum + item.value, 0)

    return {
      todayCount,
      totalValue,
      // Add other metrics as needed
    }
  }, [{feature}List, selectedOutlet])
}
```

### Benefits
- Reusable metrics
- Outlet filtering
- Memoized

---

## Pattern Decision Guide

| Use Case | Hook Pattern | Example |
|----------|--------------|---------|
| List page with URL sync | `use{Feature}Filters` | Carts list |
| Local filtering (no URL) | `use{Feature}List` | Audit logs |
| Modal state | `use{Feature}Modal` | Location picker |
| Live calculations | `use{Feature}Calculation` | Cart pricing |
| Dashboard metrics | `use{Feature}Metrics` | Today's sales |

---

[← Form Patterns](./form-patterns.md) | [Next: Checklist →](./checklist.md)
