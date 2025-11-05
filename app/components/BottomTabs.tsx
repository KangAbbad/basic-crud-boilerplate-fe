import type { ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '~/components/ui/button'
import { BOTTOM_TABS } from '~/constants/bottomTabs'
import { cn } from '~/lib/utils/cn'

export type BottomTabOption = {
  icon: ReactNode
  label: string
  href: string
}

export function BottomTabs() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="bg-white">
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${BOTTOM_TABS.length}, 1fr)` }}>
        {BOTTOM_TABS.map((tabOption) => {
          const isActive = location.pathname === tabOption.href || location.pathname.startsWith(tabOption.href + '/')
          return (
            <Button
              key={tabOption.href}
              variant="ghost"
              className={cn(
                'rounded-none flex-1 flex-col gap-1 h-auto w-auto py-3 px-2',
                isActive ? 'bg-primary/10 border-t-2 border-primary' : 'border-t border-gray-200'
              )}
              onClick={() => navigate(tabOption.href)}
            >
              {tabOption.icon}
              <p className="text-xs text-center">{tabOption.label}</p>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
