import { useAuth } from '@clerk/react-router'
import { MenuIcon, CheckIcon, BuildingIcon, LogOutIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '~/components/ui/sheet'
import { cn } from '~/lib/utils/cn'
import {
  organizationActions,
  useOrganizationList,
  useSelectedOrganization,
} from '~/routes/_root.organizations._index/stores/organizations.store'

export function HeaderSection() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const organizationList = useOrganizationList()
  const selectedOrganization = useSelectedOrganization()

  return (
    <div className="flex items-start justify-between p-4">
      <div>
        <h1 className="text-xl font-bold">Boilerplate</h1>
        <p className="text-sm">starter boilerplate app</p>
      </div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="w-auto h-auto p-1.5!">
            <MenuIcon strokeWidth={3} className="w-6! h-6!" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="right-0 gap-0 md:right-[calc(50vw-214px)]!">
          <SheetHeader className="p-3">
            <SheetTitle>Organization</SheetTitle>
            <SheetDescription>Choose your organization</SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min">
            {organizationList.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No organization found</p>
            ) : (
              <>
                {organizationList.map((organization) => {
                  const isSelected = selectedOrganization?.id === organization.id
                  return (
                    <Button
                      key={organization.id}
                      variant="ghost"
                      className={cn(
                        'rounded-none justify-start space-x-3 w-full h-auto p-3 pr-4',
                        isSelected && 'bg-info/30'
                      )}
                      onClick={() => {
                        organizationActions.selectOrganization(organization)
                      }}
                    >
                      <Avatar>
                        {organization.logo && <AvatarImage src={organization.logo} alt={organization.name} />}
                        <AvatarFallback>{organization.name[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{organization.name}</span>
                      <div
                        className={cn(
                          'flex items-center justify-center rounded-full border-2 w-5 h-5 ml-auto',
                          isSelected ? 'border-info bg-info' : 'border-gray-300'
                        )}
                      >
                        {isSelected && <CheckIcon strokeWidth={4} className="text-white w-3! h-3!" />}
                      </div>
                    </Button>
                  )
                })}
              </>
            )}
          </div>
          <SheetFooter className="border-t border-gray-200 divide-y divide-gray-200 gap-0 p-0">
            <Button
              variant="ghost"
              className="rounded-none justify-start w-full"
              onClick={() => navigate('/organizations')}
            >
              <BuildingIcon />
              List of Organization
            </Button>
            <Button
              variant="ghost"
              className="rounded-none justify-start text-destructive hover:text-destructive/80 w-full"
              onClick={() => signOut()}
            >
              <LogOutIcon strokeWidth={3} />
              Log Out
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
