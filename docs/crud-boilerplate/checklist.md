# Implementation Checklist

[← Hook Patterns](./hook-patterns.md) | [Next: Best Practices →](./best-practices.md)

---

Follow these steps when building a new CRUD feature:

---

## Phase 1: Type Layer

- [ ] Create `types/{feature}.types.ts`
- [ ] Define enum schemas (status, etc.)
- [ ] Define snapshot schemas (related entities)
- [ ] Define core DTO schema
- [ ] Define form schemas (Create, Update)
- [ ] Export all type inferences

---

## Phase 2: Store Layer

- [ ] Create `stores/{feature}.store.ts`
- [ ] Define store type with all state fields
- [ ] Create observable with `observable()`
- [ ] Implement `create{Feature}` action
- [ ] Implement `get{Feature}List` action
- [ ] Implement `get{Feature}BySlug` action
- [ ] Implement `update{Feature}` action
- [ ] Implement `delete{Feature}` action
- [ ] Add search/filter/sort setter actions
- [ ] Create typed selector hooks
- [ ] Create `useFiltered{Feature}List` with outlet filtering

---

## Phase 3: Persistence Layer

- [ ] Create `utils/indexedDbStorage.ts`
- [ ] Setup storage instance with correct type
- [ ] Add `saveToIndexedDb` private function to store
- [ ] Add `initialize{Feature}Storage` export function
- [ ] Call save after every mutation in actions

---

## Phase 4: Component Layer (List)

- [ ] Create `components/HeaderSection.tsx` (search/filter UI)
- [ ] Create `components/ContentSection.tsx` (list + empty states)
- [ ] Create `components/FooterSection.tsx` (Add New button)
- [ ] Create `components/{Feature}Card.tsx` (list item display)
- [ ] Create list page `route.tsx` (compose sections)

---

## Phase 5: Form Components

- [ ] Create form page `_root.{feature}.form/route.tsx`
- [ ] Create `hooks/use{Feature}FormData.ts`
- [ ] Create `hooks/use{Feature}FormSubmit.ts`
- [ ] Create field components for each input
- [ ] Create `components/FormHeader.tsx`
- [ ] Create `components/FormFooter.tsx`

---

## Phase 6: Integration & Testing

- [ ] Test create operation
- [ ] Test read/list operation
- [ ] Test update operation
- [ ] Test delete operation
- [ ] Test search/filter/sort
- [ ] Test outlet filtering
- [ ] Run `bun typecheck`
- [ ] Fix all type errors

---

[← Hook Patterns](./hook-patterns.md) | [Next: Best Practices →](./best-practices.md)
