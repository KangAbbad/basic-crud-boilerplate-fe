import { useVirtualizer } from '@tanstack/react-virtual'
import { memo, useCallback, useRef, useState } from 'react'

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'
import { INDONESIAN_PROVINCES } from '~/constants/locations'
import { cn } from '~/lib/utils/cn'

type Props = {
  value: string
  error?: string
  onChange: (value: string) => void
}

const PROVINCE_OPTION_HEIGHT = 35
const PROVINCE_LIST_HEIGHT = 300

export const SelectProvince = memo(({ value, error, onChange }: Props) => {
  const [open, setOpen] = useState(false)
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: INDONESIAN_PROVINCES.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => PROVINCE_OPTION_HEIGHT, []),
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

  const selectedProvince = INDONESIAN_PROVINCES.find((p) => String(p.id) === value)

  return (
    <Select value={value} onValueChange={selectOption} open={open} onOpenChange={setOpen}>
      <SelectTrigger id="province" className={cn(error && 'border-red-500')}>
        <SelectValue placeholder="Pilih provinsi">{selectedProvince?.name}</SelectValue>
      </SelectTrigger>

      <SelectContent>
        <div
          ref={parentRef}
          style={{
            height: PROVINCE_LIST_HEIGHT,
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
              const province = INDONESIAN_PROVINCES[row.index]
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
                    value={String(province.id)}
                    className={cn('h-full flex items-center', value === String(province.id) && 'font-semibold')}
                  >
                    {province.name}
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
