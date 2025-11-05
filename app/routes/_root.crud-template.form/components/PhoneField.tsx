import { Controller, type Control } from 'react-hook-form'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { filterPhoneInput } from '~/lib/utils/numberInputValidator'

type Props = {
  control: Control<any>
}

export function PhoneField({ control }: Props) {
  return (
    <Controller
      name="phone"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Phone number"
            className={error ? 'border-red-500' : ''}
            value={value ?? ''}
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
