import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import { Calendar } from '~/components/ui/calendar'
import { Label } from '~/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'

type DatePickerProps = {
  label?: string
  value?: string
  error?: string
  isRequired?: boolean
  placeholder?: string
  onChange: (date: string) => void
}

export function DatePicker({
  value,
  error,
  label,
  isRequired,
  placeholder = 'Pilih tanggal',
  onChange,
}: DatePickerProps) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const selectedDate = value ? format(new Date(value), 'EEEE, dd MMMM yyyy', { locale: id }) : placeholder

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </Label>
      )}
      <Popover open={isDatePickerVisible} onOpenChange={setDatePickerVisibility}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="justify-between font-normal w-full h-10">
            {selectedDate}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="overflow-hidden w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            captionLayout="dropdown"
            onSelect={(date) => {
              onChange(date?.toISOString() ?? '')
              setDatePickerVisibility(false)
            }}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  )
}
