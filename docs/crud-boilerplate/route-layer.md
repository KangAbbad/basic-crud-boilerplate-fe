# Route Layer

[← Persistence Layer](./persistence-layer.md) | [Next: Input Fields →](./input-fields.md)

---

## List Page

**File**: `_root.{feature}._index/route.tsx`

### Example from Carts Feature

```typescript
import type { MetaFunction } from 'react-router'

import { ContentSection } from './components/ContentSection'
import { FooterSection } from './components/FooterSection'
import { HeaderSection } from './components/HeaderSection'

export const meta: MetaFunction = () => [{ title: 'Keranjang Cucian' }]

export default function CartListPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderSection />
      <ContentSection />
      <FooterSection />
    </div>
  )
}
```

### Generic Template

```typescript
import type { MetaFunction } from 'react-router'

import { ContentSection } from './components/ContentSection'
import { FooterSection } from './components/FooterSection'
import { HeaderSection } from './components/HeaderSection'

export const meta: MetaFunction = () => [{ title: '{Feature} List Title' }]

export default function {Feature}ListPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderSection />
      <ContentSection />
      <FooterSection />
    </div>
  )
}
```

### Key Points
- Route is just layout/composition
- HeaderSection: search, filters, sort controls
- ContentSection: empty state, list rendering, filtered empty state
- FooterSection: "Add New" button

---

## Form Page

**File**: `_root.{feature}.form/route.tsx`

### Example from Carts Feature

```typescript
import { FormProvider } from 'react-hook-form'
import type { MetaFunction } from 'react-router'

import { ContactField } from './components/ContactField'
import { DateFields } from './components/DateFields'
import { FormFooter } from './components/FormFooter'
import { FormHeader } from './components/FormHeader'
import { NotesField } from './components/NotesField'
import { QuantityFields } from './components/QuantityFields'
import { useCartFormData } from './hooks/useCartFormData'
import { useCartFormSubmit } from './hooks/useCartFormSubmit'
import { useCartPricing } from './hooks/useCartPricing'

export const meta: MetaFunction = () => [{ title: 'Form Cucian' }]

export default function CartFormPage() {
  const { form, existingCart, selectedOutlet } = useCartFormData()
  const { control, handleSubmit } = form
  const { estimatedTotal } = useCartPricing(control)
  const { submitCartForm, cancelCartForm } = useCartFormSubmit({
    form,
    existingCart,
    outletName: selectedOutlet?.name,
  })

  const isEditMode = Boolean(existingCart)
  const totalPrice = estimatedTotal?.totalPrice ?? null

  return (
    <div className="flex flex-col min-h-screen">
      <FormHeader isEditMode={isEditMode} onCancel={cancelCartForm} />
      <FormProvider {...form}>
        <div className="flex-1 overflow-y-auto space-y-5 p-4 mx-auto">
          <ContactField control={control} />
          <DateFields control={control} />
          <QuantityFields control={control} />
          <NotesField control={control} />
        </div>
      </FormProvider>
      <FormFooter estimatedTotal={totalPrice} onSubmit={handleSubmit(submitCartForm)} />
    </div>
  )
}
```

### Generic Template

```typescript
import { FormProvider } from 'react-hook-form'
import type { MetaFunction } from 'react-router'

import { Field1Component } from './components/Field1Component'
import { Field2Component } from './components/Field2Component'
import { FormFooter } from './components/FormFooter'
import { FormHeader } from './components/FormHeader'
import { use{Feature}FormData } from './hooks/use{Feature}FormData'
import { use{Feature}FormSubmit } from './hooks/use{Feature}FormSubmit'

export const meta: MetaFunction = () => [{ title: '{Feature} Form Title' }]

export default function {Feature}FormPage() {
  const { form, existing{Feature}, selectedOutlet } = use{Feature}FormData()
  const { control, handleSubmit } = form
  const { submit{Feature}Form, cancel{Feature}Form } = use{Feature}FormSubmit({
    form,
    existing{Feature},
    outletName: selectedOutlet?.name,
  })

  const isEditMode = Boolean(existing{Feature})

  return (
    <div className="flex flex-col min-h-screen">
      <FormHeader isEditMode={isEditMode} onCancel={cancel{Feature}Form} />
      <FormProvider {...form}>
        <div className="flex-1 overflow-y-auto space-y-5 p-4 mx-auto">
          <Field1Component control={control} />
          <Field2Component control={control} />
          {/* Add your form fields here */}
        </div>
      </FormProvider>
      <FormFooter onSubmit={handleSubmit(submit{Feature}Form)} />
    </div>
  )
}
```

### Key Points
- Each field is its own component
- Form logic in hooks (FormData, FormSubmit, optional calculations)
- FormProvider wraps fields for Controller access
- Footer receives calculated values to display

---

[← Persistence Layer](./persistence-layer.md) | [Next: Input Fields →](./input-fields.md)
