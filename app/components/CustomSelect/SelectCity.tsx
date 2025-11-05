import { useVirtualizer } from '@tanstack/react-virtual'
import { memo, useCallback, useRef, useState } from 'react'

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'
import { getCitiesByProvinceID } from '~/constants/locations'
import { cn } from '~/lib/utils/cn'

type Props = {
  value: string
  disabled: boolean
  provinceID: string
  error?: string
  onChange: (value: string) => void
}

const CITY_OPTION_HEIGHT = 35
const CITY_LIST_HEIGHT = 300

export const SelectCity = memo(({ value, disabled, provinceID, error, onChange }: Props) => {
  const [open, setOpen] = useState(false)
  const parentRef = useRef<HTMLDivElement>(null)
  const cityList = getCitiesByProvinceID(provinceID ? Number(provinceID) : undefined)

  const virtualizer = useVirtualizer({
    count: cityList.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => CITY_OPTION_HEIGHT, []),
    overscan: 5,
  })

  const virtualRows = virtualizer.getVirtualItems()

  const selectOption = useCallback(
    (val: string) => {
      onChange(val)
      setOpen(false)
    },
    [onChange]
  )

  const selectedCity = cityList.find((c) => String(c.id) === value)

  return (
    <Select disabled={disabled} value={value} onValueChange={selectOption} open={open} onOpenChange={setOpen}>
      <SelectTrigger id="city" className={cn(error && 'border-red-500')}>
        <SelectValue placeholder="Pilih kota">{selectedCity?.name}</SelectValue>
      </SelectTrigger>

      <SelectContent>
        <div
          ref={parentRef}
          style={{
            height: CITY_LIST_HEIGHT,
            overflow: 'auto',
            position: 'relative',
            width: '100%',
          }}
        >
          <div
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {virtualRows.map((row) => {
              const city = cityList[row.index]
              return (
                <div
                  key={row.key}
                  data-index={row.index}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${row.size}px`,
                    transform: `translateY(${row.start}px)`,
                  }}
                >
                  <SelectItem
                    value={String(city.id)}
                    className={cn('h-full flex items-center', value === String(city.id) && 'font-semibold')}
                  >
                    {city.name}
                  </SelectItem>
                </div>
              )
            })}
          </div>
        </div>
      </SelectContent>
    </Select>
  )
})
