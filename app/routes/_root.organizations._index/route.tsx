import type { Route } from './+types/route'
import { ContentSection } from './components/ContentSection'
import { FooterSection } from './components/FooterSection'
import { HeaderSection } from './components/HeaderSection'

export function meta(_metaArgs: Route.MetaArgs) {
  return [{ title: 'Organizations' }]
}

export default function OrganizationsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderSection />
      <ContentSection />
      <FooterSection />
    </div>
  )
}
