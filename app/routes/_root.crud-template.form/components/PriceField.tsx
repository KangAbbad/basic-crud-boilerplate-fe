import { Controller, type Control } from 'react-hook-form'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { formatCurrency, parseCurrencyInput } from '~/lib/utils/currencyFormatter'

type Props = {
  control: Control<any>
}

export function PriceField({ control }: Props) {
  return (
    <Controller
      name="price"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="price">
            Price <span className="text-destructive">*</span>
          </Label>
          <Input
            id="price"
            type="text"
            placeholder="Rp 0"
            className={error ? 'border-red-500' : ''}
            value={value ? formatCurrency(String(value)) : ''}
            onChange={(e) => {
              const numericValue = parseCurrencyInput(e.target.value)
              onChange(String(numericValue))
            }}
          />
          {error && <p className="text-red-600 text-sm">{error.message}</p>}
        </div>
      )}
    />
  )
}
