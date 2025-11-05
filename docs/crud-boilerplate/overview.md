# Overview & Architecture

[Back to Main](./README.md) | [Next: Type Layer →](./type-layer.md)

---

## Layered Architecture

Every CRUD feature follows this structure:

```
📁 app/routes/_root.{feature}._index/
├── 📁 types/           # Zod schemas, DTOs
├── 📁 stores/          # Legend State observables
├── 📁 components/      # UI components
├── 📁 hooks/           # Custom hooks (optional)
├── 📁 utils/           # Helper functions
└── 📄 route.tsx        # Page component

📁 app/routes/_root.{feature}.form/
├── 📁 components/      # Form field components
├── 📁 hooks/           # Form hooks (optional)
└── 📄 route.tsx        # Form page
```

---

## Key Principles

- Zod v4-mini for validation
- Legend State for state management
- React Hook Form for forms
- Manual IndexedDB persistence
- No `any` or `unknown` types
- Follow all `/docs/code-standard/` rules

---

## File Structure Details

### List Feature Directory

```
app/routes/_root.{feature}._index/
├── types/{feature}.types.ts
├── stores/{feature}.store.ts
├── utils/indexedDbStorage.ts
├── constants.ts (optional)
├── components/
│   ├── HeaderSection.tsx
│   ├── ContentSection.tsx
│   ├── FooterSection.tsx
│   └── {Feature}Card.tsx
└── route.tsx
```

### Form Feature Directory

```
app/routes/_root.{feature}.form/
├── hooks/
│   ├── use{Feature}FormData.ts
│   └── use{Feature}FormSubmit.ts
├── components/
│   ├── FormHeader.tsx
│   ├── FormFooter.tsx
│   └── {Field}Field.tsx (dedicated field)
└── route.tsx
```

---

## Layer Responsibilities

| Layer | Responsibility | Example Files |
|-------|---------------|---------------|
| **Type** | Schemas, DTOs, validation | `cart.types.ts` |
| **Store** | State, actions, hooks | `cart.store.ts` |
| **Persistence** | IndexedDB storage | `indexedDbStorage.ts` |
| **Component** | UI elements | `CartCard.tsx`, `ContactField.tsx` |
| **Hook** | Business logic | `useCartFilters.ts`, `useCartPricing.ts` |
| **Route** | Page layout | `route.tsx` |
| **Utility** | Helpers | `cartPriceCalculator.ts` |

---

[Back to Main](./README.md) | [Next: Type Layer →](./type-layer.md)
