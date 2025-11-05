import { Controller, type Control } from 'react-hook-form'

import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'

type Props = {
  control: Control<any>
}

export function NotesField({ control }: Props) {
  return (
    <Controller
      name="notes"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <div className="space-y-2">
          <Label htmlFor="notes">
            Notes <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="notes"
            placeholder="Additional notes"
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
