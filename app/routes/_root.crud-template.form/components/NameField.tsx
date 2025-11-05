import { Controller, type Control } from 'react-hook-form'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

type Props = {
  control: Control<any>
}

export function NameField({ control }: Props) {
  return (
    <Controller
      name="name"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="name">
            Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter name"
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
