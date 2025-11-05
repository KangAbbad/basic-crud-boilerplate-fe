# Store Layer

[← Type Layer](./type-layer.md) | [Next: Persistence Layer →](./persistence-layer.md)

---

## Purpose

Centralized state management with Legend State observables.

**File**: `stores/{feature}.store.ts`

---

## Example from Carts Feature

```typescript
import { observable } from '@legendapp/state'
import { useSelector } from '@legendapp/state/react'

import type { CartDTO, CreateCartFormDTO, UpdateCartDTO } from '../types/cart.types'
import { cartIndexedDbStorage } from '../utils/indexedDbStorage'

type SortField = 'createdAt' | 'estimationDate' | 'totalPrice'
type SortDirection = 'asc' | 'desc'
export type FilterStatus = 'all' | 'draft' | 'paid' | 'completed' | 'cancelled'

type CartStoreType = {
  cartList: CartDTO[]
  selectedCart: CartDTO | null
  searchQuery: string
  filterStatus: FilterStatus
  sortBy: SortField
  sortDirection: SortDirection
  isInitialized: boolean
}

const getInitialState = (): CartStoreType => ({
  cartList: [],
  selectedCart: null,
  searchQuery: '',
  filterStatus: 'all',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  isInitialized: false,
})

export const cartStore$ = observable<CartStoreType>(getInitialState())

const saveToIndexedDb = async (): Promise<void> => {
  try {
    const { isInitialized, ...persistedData } = cartStore$.get()
    await cartIndexedDbStorage.save(persistedData)
  } catch (error) {
    console.error('Failed to save cartList to IndexedDB:', error)
  }
}

export const initializeCartStorage = async (): Promise<void> => {
  try {
    const dbData = await cartIndexedDbStorage.load()
    if (dbData) {
      cartStore$.set({
        ...dbData,
        isInitialized: true,
      })
    } else {
      cartStore$.isInitialized.set(true)
    }
  } catch (error) {
    console.error('Failed to initialize cart storage:', error)
    cartStore$.isInitialized.set(true)
  }
}

export const cartActions = {
  createCart: ({ formData, contactSnapshot, servicePackageSnapshot, ... }): CartDTO => {
    const id = crypto.randomUUID()
    const slug = generateCartSlug(outletName)

    const newCart: CartDTO = {
      id,
      slug,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // ... map all fields
    }

    cartStore$.cartList.push(newCart)
    saveToIndexedDb()
    return newCart
  },

  getCartList: (): CartDTO[] => {
    return cartStore$.cartList.get()
  },

  getCartBySlug: (slug: string): CartDTO | undefined => {
    return cartStore$.cartList.get().find((c) => c.slug === slug)
  },

  updateCart: (slug: string, updates: UpdateCartDTO): void => {
    const list = cartStore$.cartList.get()
    const index = list.findIndex((c) => c.slug === slug)
    if (index >= 0) {
      const cart = cartStore$.cartList[index]
      Object.entries(updates).forEach(([key, val]) => {
        (cart[key as keyof CartDTO] as any).set(val)
      })
      cart.updatedAt.set(new Date().toISOString())
      saveToIndexedDb()
    }
  },

  deleteCart: (slug: string): void => {
    const list = cartStore$.cartList.get()
    const index = list.findIndex((c) => c.slug === slug)
    if (index >= 0) {
      cartStore$.cartList.splice(index, 1)
      saveToIndexedDb()
    }
  },

  setSearchQuery: (query: string): void => {
    cartStore$.searchQuery.set(query)
  },

  setFilterStatus: (status: FilterStatus): void => {
    cartStore$.filterStatus.set(status)
  },

  setSortBy: (field: SortField): void => {
    cartStore$.sortBy.set(field)
  },

  setSortDirection: (direction: SortDirection): void => {
    cartStore$.sortDirection.set(direction)
  },
}

// ===== TYPED SELECTOR HOOKS =====

export const useCartList = (): CartDTO[] => {
  const list = useSelector(cartStore$.cartList)
  return (Array.isArray(list) ? list : []) as CartDTO[]
}

export const useIsInitialized = (): boolean => {
  return useSelector(cartStore$.isInitialized) ?? false
}

export const useSearchQuery = (): string => {
  return useSelector(cartStore$.searchQuery) ?? ''
}

export const useFilterStatus = (): FilterStatus => {
  return useSelector(cartStore$.filterStatus) ?? 'all'
}

export const useFilteredCartList = (): CartDTO[] => {
  const selectedOutlet = useSelectedOutlet()
  const cartList = useCartList()
  const outletFiltered = filterByOutlet(cartList, selectedOutlet?.id ?? null)
  return cartActions.getSortedAndFilteredCartListFromList(outletFiltered)
}
```

---

## Generic Template

```typescript
import { observable } from '@legendapp/state'
import { useSelector } from '@legendapp/state/react'

import type { {Feature}DTO, Create{Feature}FormDTO, Update{Feature}DTO } from '../types/{feature}.types'
import { {feature}IndexedDbStorage } from '../utils/indexedDbStorage'

type SortField = 'createdAt' | 'field1' | 'field2'
type SortDirection = 'asc' | 'desc'
export type FilterStatus = 'all' | 'status1' | 'status2'

type {Feature}StoreType = {
  {feature}List: {Feature}DTO[]
  selected{Feature}: {Feature}DTO | null
  searchQuery: string
  filterStatus: FilterStatus
  sortBy: SortField
  sortDirection: SortDirection
  isInitialized: boolean
}

const getInitialState = (): {Feature}StoreType => ({
  {feature}List: [],
  selected{Feature}: null,
  searchQuery: '',
  filterStatus: 'all',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  isInitialized: false,
})

export const {feature}Store$ = observable<{Feature}StoreType>(getInitialState())

const saveToIndexedDb = async (): Promise<void> => {
  try {
    const { isInitialized, ...persistedData } = {feature}Store$.get()
    await {feature}IndexedDbStorage.save(persistedData)
  } catch (error) {
    console.error('Failed to save {feature}List to IndexedDB:', error)
  }
}

export const initialize{Feature}Storage = async (): Promise<void> => {
  try {
    const dbData = await {feature}IndexedDbStorage.load()
    if (dbData) {
      {feature}Store$.set({
        ...dbData,
        isInitialized: true,
      })
    } else {
      {feature}Store$.isInitialized.set(true)
    }
  } catch (error) {
    console.error('Failed to initialize {feature} storage:', error)
    {feature}Store$.isInitialized.set(true)
  }
}

export const {feature}Actions = {
  create{Feature}: ({ formData, ... }): {Feature}DTO => {
    const id = crypto.randomUUID()
    const slug = generate{Feature}Slug()

    const new{Feature}: {Feature}DTO = {
      id,
      slug,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // ... map all fields
    }

    {feature}Store$.{feature}List.push(new{Feature})
    saveToIndexedDb()
    return new{Feature}
  },

  get{Feature}List: (): {Feature}DTO[] => {
    return {feature}Store$.{feature}List.get()
  },

  get{Feature}BySlug: (slug: string): {Feature}DTO | undefined => {
    return {feature}Store$.{feature}List.get().find((item) => item.slug === slug)
  },

  update{Feature}: (slug: string, updates: Update{Feature}DTO): void => {
    const list = {feature}Store$.{feature}List.get()
    const index = list.findIndex((item) => item.slug === slug)
    if (index >= 0) {
      const item = {feature}Store$.{feature}List[index]
      Object.entries(updates).forEach(([key, val]) => {
        (item[key as keyof {Feature}DTO] as any).set(val)
      })
      item.updatedAt.set(new Date().toISOString())
      saveToIndexedDb()
    }
  },

  delete{Feature}: (slug: string): void => {
    const list = {feature}Store$.{feature}List.get()
    const index = list.findIndex((item) => item.slug === slug)
    if (index >= 0) {
      {feature}Store$.{feature}List.splice(index, 1)
      saveToIndexedDb()
    }
  },

  setSearchQuery: (query: string): void => {
    {feature}Store$.searchQuery.set(query)
  },

  setFilterStatus: (status: FilterStatus): void => {
    {feature}Store$.filterStatus.set(status)
  },

  setSortBy: (field: SortField): void => {
    {feature}Store$.sortBy.set(field)
  },

  setSortDirection: (direction: SortDirection): void => {
    {feature}Store$.sortDirection.set(direction)
  },
}

// ===== TYPED SELECTOR HOOKS =====

export const use{Feature}List = (): {Feature}DTO[] => {
  const list = useSelector({feature}Store$.{feature}List)
  return (Array.isArray(list) ? list : []) as {Feature}DTO[]
}

export const useIsInitialized = (): boolean => {
  return useSelector({feature}Store$.isInitialized) ?? false
}

export const useSearchQuery = (): string => {
  return useSelector({feature}Store$.searchQuery) ?? ''
}

export const useFilterStatus = (): FilterStatus => {
  return useSelector({feature}Store$.filterStatus) ?? 'all'
}

export const useFiltered{Feature}List = (): {Feature}DTO[] => {
  const selectedOutlet = useSelectedOutlet()
  const {feature}List = use{Feature}List()
  const outletFiltered = filterByOutlet({feature}List, selectedOutlet?.id ?? null)
  return {feature}Actions.getSortedAndFiltered{Feature}ListFromList(outletFiltered)
}
```

---

## Key Points

- Use `observable()` to create store
- Export actions object with CRUD operations
- Call `saveToIndexedDb()` after every mutation
- Create typed selector hooks with `useSelector()`
- Include `isInitialized` for loading state management
- Provide outlet filtering hook at the end

---

[← Type Layer](./type-layer.md) | [Next: Persistence Layer →](./persistence-layer.md)
