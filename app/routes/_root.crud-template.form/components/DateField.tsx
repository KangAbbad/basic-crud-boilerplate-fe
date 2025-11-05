import { Controller, type Control } from 'react-hook-form'

import { DatePicker } from '~/components/DatePicker'

type Props = {
  control: Control<any>
}

export function DateField({ control }: Props) {
  return (
    <Controller
      name="date"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <DatePicker label="Date" isRequired value={value} error={error?.message} onChange={onChange} />
      )}
    />
  )
}
