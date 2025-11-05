import type { MetaFunction } from 'react-router'

import { ContentSection } from './components/ContentSection'
import { FooterSection } from './components/FooterSection'
import { HeaderSection } from './components/HeaderSection'

export const meta: MetaFunction = () => [{ title: 'Crud Template' }]

export default function CrudTemplatePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderSection />
      <ContentSection />
      <FooterSection />
    </div>
  )
}
