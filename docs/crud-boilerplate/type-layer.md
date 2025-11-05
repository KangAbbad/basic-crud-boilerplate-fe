# Type Layer

[← Overview](./overview.md) | [Next: Store Layer →](./store-layer.md)

---

## Purpose

Define all data structures using Zod v4-mini schemas. Never use `any` or `unknown`.

**File**: `types/{feature}.types.ts`

---

## Example from Carts Feature

```typescript
import { z } from 'zod/v4-mini'

// ===== ENUMS =====

export const CartStatusDTOSchema = z.enum(['draft', 'paid', 'completed', 'cancelled'])
export const PaymentMethodDTOSchema = z.enum(['cash', 'bank_transfer'])
export const PaymentStatusDTOSchema = z.enum(['pending', 'paid', 'refunded'])

// ===== SNAPSHOT SCHEMAS =====

const ContactSnapshotDTOSchema = z.object({
  name: z.string().check(z.minLength(1)),
  phoneNumber: z.string().check(z.minLength(1)),
  address: z.optional(z.string()),
})

const ServicePackageSnapshotDTOSchema = z.object({
  name: z.string().check(z.minLength(1)),
  code: z.string().check(z.minLength(1)),
  basePrice: z.object({
    amount: z.number().check(z.positive()),
    unit: z.enum(['kg', 'item']),
  }),
})

// ===== CORE DTO =====

export const CartDTOSchema = z.object({
  id: z.string().check(z.minLength(1)),
  slug: z.string().check(z.minLength(1)),
  status: CartStatusDTOSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  contactID: z.string().check(z.minLength(1)),
  contactSnapshot: ContactSnapshotDTOSchema,
  servicePackageID: z.string().check(z.minLength(1)),
  servicePackageSnapshot: ServicePackageSnapshotDTOSchema,
  // ... more fields
  outletID: z.string().check(z.minLength(1, 'Outlet wajib dipilih')),
})

// ===== FORM SCHEMAS =====

export const CreateCartFormDTOSchema = z.object({
  contactID: z.string().check(z.minLength(1, 'Wajib dipilih')),
  servicePackageID: z.string().check(z.minLength(1, 'Wajib dipilih')),
  serviceAddonIDList: z.array(z.string()),
  orderDate: z.string().check(z.minLength(1, 'Wajib diisi')),
  estimationDate: z.string().check(z.minLength(1, 'Wajib diisi')),
  weightQuantity: z.number().check(z.gt(0, 'Wajib diisi')),
  itemQuantity: z.number().check(z.gt(0, 'Wajib diisi')),
  perfumeID: z.string(),
  couponCode: z.optional(z.string()),
  notes: z.optional(z.string()),
  paymentMethod: PaymentMethodDTOSchema,
  outletID: z.string().check(z.minLength(1, 'Outlet wajib dipilih')),
})

export const UpdateCartDTOSchema = z.object({
  contactID: z.optional(z.string().check(z.minLength(1))),
  servicePackageID: z.optional(z.string().check(z.minLength(1))),
  // ... all fields optional for partial updates
  status: z.optional(CartStatusDTOSchema),
})

// ===== TYPE INFERENCES =====

export type CartStatusDTO = z.infer<typeof CartStatusDTOSchema>
export type PaymentMethodDTO = z.infer<typeof PaymentMethodDTOSchema>
export type CartDTO = z.infer<typeof CartDTOSchema>
export type CreateCartFormDTO = z.infer<typeof CreateCartFormDTOSchema>
export type UpdateCartDTO = z.infer<typeof UpdateCartDTOSchema>
```

---

## Generic Template

```typescript
import { z } from 'zod/v4-mini'

// ===== ENUMS =====

export const {Feature}StatusDTOSchema = z.enum(['status1', 'status2', 'status3'])

// ===== SNAPSHOT SCHEMAS (if needed) =====

const RelatedEntitySnapshotDTOSchema = z.object({
  name: z.string().check(z.minLength(1)),
  // ... other fields
})

// ===== CORE DTO =====

export const {Feature}DTOSchema = z.object({
  id: z.string().check(z.minLength(1)),
  slug: z.string().check(z.minLength(1)),
  status: {Feature}StatusDTOSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
  // ... your feature fields
  outletID: z.string().check(z.minLength(1, 'Outlet wajib dipilih')),
})

// ===== FORM SCHEMAS =====

export const Create{Feature}FormDTOSchema = z.object({
  // ... all required fields for creation
  outletID: z.string().check(z.minLength(1, 'Outlet wajib dipilih')),
})

export const Update{Feature}DTOSchema = z.object({
  // ... all fields optional for partial updates
  status: z.optional({Feature}StatusDTOSchema),
})

// ===== TYPE INFERENCES =====

export type {Feature}StatusDTO = z.infer<typeof {Feature}StatusDTOSchema>
export type {Feature}DTO = z.infer<typeof {Feature}DTOSchema>
export type Create{Feature}FormDTO = z.infer<typeof Create{Feature}FormDTOSchema>
export type Update{Feature}DTO = z.infer<typeof Update{Feature}DTOSchema>
```

---

## Validation Patterns

### Required String
```typescript
name: z.string().check(z.minLength(1, 'Wajib diisi'))
```

### Optional String
```typescript
notes: z.optional(z.string())
```

### Number Validation
```typescript
quantity: z.number().check(z.gt(0, 'Wajib diisi'))
price: z.number().check(z.nonnegative())
percentage: z.number().check(z.nonnegative(), z.lte(100))
```

### Array
```typescript
serviceAddonIDList: z.array(z.string())
```

---

## Key Points

- Use Zod v4-mini (`import { z } from 'zod/v4-mini'`)
- Infer types from schemas (never duplicate type definitions)
- Use "DTO" suffix for all data types
- Create separate schemas for: Core DTO, Create Form, Update
- Snapshot related entities for denormalized data
- Include outletID for multi-outlet features

---

[← Overview](./overview.md) | [Next: Store Layer →](./store-layer.md)
