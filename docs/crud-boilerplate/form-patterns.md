# Form Patterns with React Hook Form

[← Input Fields](./input-fields.md) | [Next: Hook Patterns →](./hook-patterns.md)

---

## Form Initialization Hook

**File**: `hooks/use{Feature}FormData.ts`

### Example from Carts Feature

```typescript
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router'

import { cartActions, useIsInitialized } from '../../_root.carts._index/stores/cart.store'
import { CreateCartFormDTOSchema, type CartDTO, type CreateCartFormDTO } from '../../_root.carts._index/types/cart.types'
import { useSelectedOutlet } from '../../_root.outlets._index/stores/outlets.store'

const getInitialFormData = (selectedCart?: CartDTO, selectedOutletID?: string): CreateCartFormDTO => {
  if (!selectedOutletID && !selectedCart) {
    throw new Error('Silakan pilih outlet terlebih dahulu')
  }

  return {
    contactID: selectedCart?.contactID ?? '',
    servicePackageID: selectedCart?.servicePackageID ?? '',
    orderDate: selectedCart?.orderDate ?? new Date().toISOString().split('T')[0],
    // ... all form fields with defaults
    outletID: selectedCart?.outletID ?? selectedOutletID ?? '',
  }
}

export const useCartFormData = () => {
  const [searchParams] = useSearchParams()
  const isCartInitialized = useIsInitialized()
  const selectedOutlet = useSelectedOutlet()

  const cartSlug = searchParams.get('slug')
  const existingCart = useMemo(
    () => (isCartInitialized && cartSlug ? cartActions.getCartBySlug(cartSlug) : undefined),
    [isCartInitialized, cartSlug]
  )

  const form = useForm<CreateCartFormDTO>({
    resolver: zodResolver(CreateCartFormDTOSchema),
    defaultValues: getInitialFormData(existingCart, selectedOutlet?.id),
    mode: 'onSubmit',
  })

  useEffect(() => {
    form.reset(getInitialFormData(existingCart, selectedOutlet?.id))
  }, [existingCart, selectedOutlet?.id, form])

  return {
    form,
    existingCart,
    selectedOutlet,
  }
}
```

### Generic Template

```typescript
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router'

import { {feature}Actions, useIsInitialized } from '../../_root.{feature}._index/stores/{feature}.store'
import { Create{Feature}FormDTOSchema, type {Feature}DTO, type Create{Feature}FormDTO } from '../../_root.{feature}._index/types/{feature}.types'
import { useSelectedOutlet } from '../../_root.outlets._index/stores/outlets.store'

const getInitialFormData = (selected{Feature}?: {Feature}DTO, selectedOutletID?: string): Create{Feature}FormDTO => {
  if (!selectedOutletID && !selected{Feature}) {
    throw new Error('Silakan pilih outlet terlebih dahulu')
  }

  return {
    field1: selected{Feature}?.field1 ?? '',
    field2: selected{Feature}?.field2 ?? 0,
    // ... all form fields with defaults
    outletID: selected{Feature}?.outletID ?? selectedOutletID ?? '',
  }
}

export const use{Feature}FormData = () => {
  const [searchParams] = useSearchParams()
  const is{Feature}Initialized = useIsInitialized()
  const selectedOutlet = useSelectedOutlet()

  const {feature}Slug = searchParams.get('slug')
  const existing{Feature} = useMemo(
    () => (is{Feature}Initialized && {feature}Slug ? {feature}Actions.get{Feature}BySlug({feature}Slug) : undefined),
    [is{Feature}Initialized, {feature}Slug]
  )

  const form = useForm<Create{Feature}FormDTO>({
    resolver: zodResolver(Create{Feature}FormDTOSchema),
    defaultValues: getInitialFormData(existing{Feature}, selectedOutlet?.id),
    mode: 'onSubmit',
  })

  useEffect(() => {
    form.reset(getInitialFormData(existing{Feature}, selectedOutlet?.id))
  }, [existing{Feature}, selectedOutlet?.id, form])

  return {
    form,
    existing{Feature},
    selectedOutlet,
  }
}
```

---

## Form Submission Hook

**File**: `hooks/use{Feature}FormSubmit.ts`

### Example from Carts Feature

```typescript
import type { UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { cartActions } from '../../_root.carts._index/stores/cart.store'
import type { CartDTO, CreateCartFormDTO } from '../../_root.carts._index/types/cart.types'
import { useContactList } from '../../_root.contacts._index/stores/contacts.store'

type Props = {
  form: UseFormReturn<CreateCartFormDTO>
  existingCart?: CartDTO
  outletName?: string
}

export const useCartFormSubmit = ({ form, existingCart, outletName }: Props) => {
  const navigate = useNavigate()
  const contactList = useContactList()

  const cancelCartForm = () => {
    navigate('/carts')
  }

  const submitCartForm = (): void => {
    const values = form.getValues()

    // Fetch related entities from stores
    const selectedContact = contactList.find((c) => c.id === values.contactID)
    if (!selectedContact) {
      form.setError('contactID', { message: 'Wajib dipilih' })
      return
    }

    // Create or update
    if (existingCart) {
      cartActions.updateCart(existingCart.slug, {
        contactID: values.contactID,
        // ... other fields
      })
    } else {
      cartActions.createCart({
        contactSnapshot: selectedContact,
        formData: values,
        outletName: outletName ?? 'DEFAULT',
      })
    }
    navigate('/carts')
  }

  return {
    submitCartForm,
    cancelCartForm,
  }
}
```

### Generic Template

```typescript
import type { UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { {feature}Actions } from '../../_root.{feature}._index/stores/{feature}.store'
import type { {Feature}DTO, Create{Feature}FormDTO } from '../../_root.{feature}._index/types/{feature}.types'

type Props = {
  form: UseFormReturn<Create{Feature}FormDTO>
  existing{Feature}?: {Feature}DTO
  outletName?: string
}

export const use{Feature}FormSubmit = ({ form, existing{Feature}, outletName }: Props) => {
  const navigate = useNavigate()

  const cancel{Feature}Form = () => {
    navigate('/{feature}')
  }

  const submit{Feature}Form = (): void => {
    const values = form.getValues()

    // Fetch related entities from stores (if needed)
    // Validate related entity selections before submit

    // Create or update
    if (existing{Feature}) {
      {feature}Actions.update{Feature}(existing{Feature}.slug, {
        field1: values.field1,
        field2: values.field2,
        // ... other fields
      })
    } else {
      {feature}Actions.create{Feature}({
        formData: values,
        outletName: outletName ?? 'DEFAULT',
      })
    }
    navigate('/{feature}')
  }

  return {
    submit{Feature}Form,
    cancel{Feature}Form,
  }
}
```

---

## Key Points

- Initialize form with `zodResolver` and schema
- Load existing data via `useMemo` with slug from URL
- Reset form when existing data changes
- Submission hook fetches related entities from stores
- Validate related entity selections before submit
- Navigate back to list after successful submit

---

[← Input Fields](./input-fields.md) | [Next: Hook Patterns →](./hook-patterns.md)
