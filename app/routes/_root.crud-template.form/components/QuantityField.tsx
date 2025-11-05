import { Controller, type Control } from 'react-hook-form'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { allowOnlyNumbers, sanitizeNumberInput } from '~/lib/utils/numberInputValidator'

type Props = {
  control: Control<any>
}

export function QuantityField({ control }: Props) {
  return (
    <Controller
      name="quantity"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="quantity">
            Quantity <span className="text-destructive">*</span>
          </Label>
          <Input
            id="quantity"
            type="text"
            className={error ? 'border-red-500' : ''}
            value={value ?? ''}
            onChange={(e) => {
              const sanitized = sanitizeNumberInput(e.target.value)
              onChange(sanitized ? String(parseInt(sanitized, 10)) : '')
            }}
            onKeyDown={allowOnlyNumbers}
          />
          {error && <p className="text-red-600 text-sm">{error.message}</p>}
        </div>
      )}
    />
  )
}
