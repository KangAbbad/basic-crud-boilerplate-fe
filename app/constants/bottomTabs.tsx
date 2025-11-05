import { AlignVerticalJustifyEndIcon, BookUserIcon, HomeIcon, ListOrderedIcon, WashingMachineIcon } from 'lucide-react'

import type { BottomTabOption } from '~/components/BottomTabs'

export const BOTTOM_TABS: BottomTabOption[] = [
  {
    icon: <HomeIcon className="h-6! w-6!" />,
    label: 'Home',
    href: '/',
  },
  {
    icon: <AlignVerticalJustifyEndIcon className="h-6! w-6!" />,
    label: 'Menu 1',
    href: '/menu-1',
  },
  {
    icon: <ListOrderedIcon className="h-6! w-6!" />,
    label: 'Menu 2',
    href: '/menu-2',
  },
  {
    icon: <WashingMachineIcon className="h-6! w-6!" />,
    label: 'Menu 3',
    href: '/menu-3',
  },
  {
    icon: <BookUserIcon className="h-6! w-6!" />,
    label: 'Crud',
    href: '/crud-template',
  },
]
