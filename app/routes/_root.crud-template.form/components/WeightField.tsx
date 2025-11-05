import { Controller, type Control } from 'react-hook-form'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { allowNumbersWithDecimal, sanitizeDecimalInput } from '~/lib/utils/numberInputValidator'

type Props = {
  control: Control<any>
}

export function WeightField({ control }: Props) {
  return (
    <Controller
      name="weight"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="weight">
            Weight (kg) <span className="text-destructive">*</span>
          </Label>
          <Input
            id="weight"
            type="text"
            placeholder="0"
            value={value ?? ''}
            className={error ? 'border-red-500' : ''}
            onChange={(e) => {
              const sanitized = sanitizeDecimalInput(e.target.value)
              onChange(sanitized)
            }}
            onKeyDown={allowNumbersWithDecimal}
          />
          {error && <p className="text-red-600 text-sm">{error.message}</p>}
        </div>
      )}
    />
  )
}
