# Persistence Layer

[← Store Layer](./store-layer.md) | [Next: Route Layer →](./route-layer.md)

---

## Purpose

IndexedDB persistence for offline-first functionality.

---

## Storage Setup

**File**: `utils/indexedDbStorage.ts`

**Example from Carts Feature:**
```typescript
import type { CartStoreType } from '../stores/cart.store'
import { IndexedDbStorage } from '~/lib/utils/indexedDbStorage'

const STORE_NAME = 'cartStore'

export const cartIndexedDbStorage = new IndexedDbStorage<Omit<CartStoreType, 'isInitialized'>>(STORE_NAME)
```

**Generic Template:**
```typescript
import type { {Feature}StoreType } from '../stores/{feature}.store'
import { IndexedDbStorage } from '~/lib/utils/indexedDbStorage'

const STORE_NAME = '{feature}Store'

export const {feature}IndexedDbStorage = new IndexedDbStorage<Omit<{Feature}StoreType, 'isInitialized'>>(STORE_NAME)
```

---

## Save Pattern (in store)

**Example from Carts Feature:**
```typescript
const saveToIndexedDb = async (): Promise<void> => {
  try {
    const { isInitialized, ...persistedData } = cartStore$.get()
    await cartIndexedDbStorage.save(persistedData)
  } catch (error) {
    console.error('Failed to save cartList to IndexedDB:', error)
  }
}
```

**Generic Template:**
```typescript
const saveToIndexedDb = async (): Promise<void> => {
  try {
    const { isInitialized, ...persistedData } = {feature}Store$.get()
    await {feature}IndexedDbStorage.save(persistedData)
  } catch (error) {
    console.error('Failed to save {feature}List to IndexedDB:', error)
  }
}
```

Call after every mutation:
```typescript
create{Feature}: (...) => {
  // ... create logic
  {feature}Store$.{feature}List.push(new{Feature})
  saveToIndexedDb()  // ← Call after mutation
  return new{Feature}
}
```

---

## Load Pattern (in store)

**Example from Carts Feature:**
```typescript
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
```

**Generic Template:**
```typescript
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
```

Call in component (ContentSection.tsx):
```typescript
useEffect(() => {
  initialize{Feature}Storage()
}, [])
```

---

## Key Points

- Omit `isInitialized` from persisted data
- Call save after EVERY mutation
- Initialize storage in a component (not route)
- Use consistent naming: `{feature}IndexedDbStorage`

---

[← Store Layer](./store-layer.md) | [Next: Route Layer →](./route-layer.md)
