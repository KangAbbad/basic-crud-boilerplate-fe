import { type MetaFunction } from 'react-router'

import { HeaderSection } from './components/HeaderSection'

import { BottomTabs } from '~/components/BottomTabs'

export const meta: MetaFunction = () => [{ title: 'Boilerplate App' }]

export default function Homepage() {
  return (
    <div className="flex flex-col h-screen">
      <HeaderSection />
      <div className="flex-1" />
      <div className="sticky bottom-0 z-20">
        <BottomTabs />
      </div>
    </div>
  )
}
