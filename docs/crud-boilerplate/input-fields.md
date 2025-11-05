# Special Input Field Examples

[← Route Layer](./route-layer.md) | [Next: Form Patterns →](./form-patterns.md)

---

All examples from actual production implementations.

---

## 1. Phone Number Field

**Use Case**: WhatsApp numbers, contact phones

**Implementation** (Example: {Feature} Form):
```typescript
import { Controller, type Control } from 'react-hook-form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { filterPhoneInput } from '~/lib/utils/numberInputValidator'

type Props = {
  control: Control<FormDTO>
}

export function PhoneNumberField({ control }: Props) {
  return (
    <Controller
      name="phoneNumber"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">
            Nomor WhatsApp <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="Nomor WhatsApp"
            className={error ? 'border-red-500' : ''}
            value={value}
            onChange={(e) => {
              onChange(filterPhoneInput(e.target.value))
            }}
          />
          {error && <p className="text-red-600 text-sm">{error.message}</p>}
        </div>
      )}
    />
  )
}
```

**Utility**: `filterPhoneInput(value: string)` - Keeps digits, +, -, spaces, parentheses

---

## 2. Integer Field (Number-Only)

**Use Case**: Item quantity, count fields

**Implementation** (Example: QuantityField):
```typescript
import { Controller, type Control } from 'react-hook-form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { allowOnlyNumbers, sanitizeNumberInput } from '~/lib/utils/numberInputValidator'

type Props = {
  control: Control<FormDTO>
}

export function QuantityField({ control }: Props) {
  return (
    <Controller
      name="itemQuantity"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="itemQuantity">
            Jumlah <span className="text-destructive">*</span>
          </Label>
          <Input
            id="itemQuantity"
            type="text"
            className={error ? 'border-red-500' : ''}
            value={value ?? ''}
            onChange={(e) => {
              const sanitized = sanitizeNumberInput(e.target.value)
              onChange(sanitized ? parseInt(sanitized, 10) : undefined)
            }}
            onKeyDown={allowOnlyNumbers}
          />
          {error && <p className="text-red-600 text-sm">{error.message}</p>}
        </div>
      )}
    />
  )
}
```

**Utilities**:
- `allowOnlyNumbers(e)` - Prevents non-numeric keys
- `sanitizeNumberInput(value)` - Strips non-digits

---

## 3. Decimal Number Field

**Use Case**: Weight (kg), measurements with decimals

**Implementation** (Example: WeightField):
```typescript
import { Controller, type Control } from 'react-hook-form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { allowNumbersWithDecimal, sanitizeDecimalInput } from '~/lib/utils/numberInputValidator'

type Props = {
  control: Control<FormDTO>
}

export function WeightField({ control }: Props) {
  return (
    <Controller
      name="weightQuantity"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="weightQuantity">
            Berat (kg) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="weightQuantity"
            type="text"
            className={error ? 'border-red-500' : ''}
            value={value ?? ''}
            onChange={(e) => {
              const sanitized = sanitizeDecimalInput(e.target.value)
              onChange(sanitized ? parseFloat(sanitized) : undefined)
            }}
            onKeyDown={allowNumbersWithDecimal}
          />
          {error && <p className="text-red-600 text-sm">{error.message}</p>}
        </div>
      )}
    />
  )
}
```

**Utilities**:
- `allowNumbersWithDecimal(e)` - Allows digits and `.`
- `sanitizeDecimalInput(value)` - Strips non-numeric except `.`

---

## 4. Currency Field (IDR)

**Use Case**: Price input, monetary values

**Implementation**:
```typescript
import { Controller, type Control } from 'react-hook-form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { formatCurrency, parseCurrencyInput } from '~/lib/utils/currencyFormatter'

type Props = {
  control: Control<FormDTO>
}

export function PriceField({ control }: Props) {
  return (
    <Controller
      name="price"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="price">
            Harga <span className="text-destructive">*</span>
          </Label>
          <Input
            id="price"
            type="text"
            placeholder="Rp 0"
            className={error ? 'border-red-500' : ''}
            value={value ? formatCurrency(String(value)) : ''}
            onChange={(e) => {
              const numericValue = parseCurrencyInput(e.target.value)
              onChange(numericValue)
            }}
          />
          {error && <p className="text-red-600 text-sm">{error.message}</p>}
        </div>
      )}
    />
  )
}
```

**Utilities** (`lib/utils/currencyFormatter.ts`):
```typescript
export function formatCurrency(value: string): string {
  const numericValue = value.replace(/\D/g, '')
  if (!numericValue) return ''

  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(parseInt(numericValue, 10))
}

export function parseCurrencyInput(value: string): number {
  const numericValue = value.replace(/\D/g, '')
  return numericValue ? parseInt(numericValue, 10) : 0
}
```

---

## 5. Date Picker Field

**Use Case**: Date selection

**Implementation** (Example: DateField):
```typescript
import { Controller, type Control } from 'react-hook-form'
import { DatePicker } from '~/components/DatePicker'

type Props = {
  control: Control<FormDTO>
}

export function DateField({ control }: Props) {
  return (
    <Controller
      name="orderDate"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <DatePicker
          label="Tanggal Pesanan"
          isRequired
          value={value}
          error={error?.message}
          onChange={onChange}
        />
      )}
    />
  )
}
```

**Component**: Uses existing `~/components/DatePicker`

---

## 6. Select/Dropdown Field

**Use Case**: Entity selection (contact, service, etc.)

**Implementation** (Example: ContactField):
```typescript
import { memo } from 'react'
import { Controller, type Control } from 'react-hook-form'
import { Label } from '~/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useContactList } from '~/routes/_root.contacts._index/stores/contacts.store'

type Props = {
  control: Control<FormDTO>
}

export const ContactField = memo(function ContactField({ control }: Props) {
  const contactList = useContactList()

  return (
    <Controller
      name="contactID"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="contactID">
            Pelanggan <span className="text-destructive">*</span>
          </Label>
          <Select value={value ?? ''} onValueChange={onChange}>
            <SelectTrigger id="contactID" className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder="Pilih pelanggan" />
            </SelectTrigger>
            <SelectContent>
              {contactList.map((contact) => (
                <SelectItem key={contact.id} value={contact.id}>
                  {contact.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-red-600 text-sm">{error.message}</p>}
        </div>
      )}
    />
  )
})
```

**Key Points**:
- Use `memo()` for performance
- Pull data from store hooks
- Use shadcn/ui Select components

---

## 7. Textarea Field

**Use Case**: Long text (notes, descriptions)

**Implementation** (Example: NotesField):
```typescript
import { Controller, type Control } from 'react-hook-form'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'

type Props = {
  control: Control<FormDTO>
}

export function NotesField({ control }: Props) {
  return (
    <Controller
      name="notes"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="notes">Catatan</Label>
          <Textarea
            id="notes"
            placeholder="Catatan tambahan"
            className={error ? 'border-red-500' : ''}
            value={value ?? ''}
            onChange={onChange}
          />
          {error && <p className="text-red-600 text-sm">{error.message}</p>}
        </div>
      )}
    />
  )
}
```

---

## Number Input Utilities

**Location**: `/app/lib/utils/numberInputValidator.ts`

```typescript
export function allowOnlyNumbers(e: React.KeyboardEvent<HTMLInputElement>): void {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
  const isNumberKey = /^\d$/.test(e.key)
  if (!isNumberKey && !allowedKeys.includes(e.key)) {
    e.preventDefault()
  }
}

export function allowNumbersWithDecimal(e: React.KeyboardEvent<HTMLInputElement>): void {
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab']
  const isNumberKey = /^\d$/.test(e.key)
  const isDecimalPoint = e.key === '.'
  if (!isNumberKey && !isDecimalPoint && !allowedKeys.includes(e.key)) {
    e.preventDefault()
  }
}

export function sanitizeNumberInput(value: string): string {
  return value.replace(/\D/g, '')
}

export function sanitizeDecimalInput(value: string): string {
  return value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1')
}

export function filterPhoneInput(value: string): string {
  return value.replace(/[^\d+\-\s()]/g, '')
}
```

---

[← Route Layer](./route-layer.md) | [Next: Form Patterns →](./form-patterns.md)
