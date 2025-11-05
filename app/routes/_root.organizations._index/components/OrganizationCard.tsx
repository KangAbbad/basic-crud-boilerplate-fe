import { Trash2Icon, SquarePenIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'

import { organizationActions } from '../stores/organizations.store'
import type { OrganizationDTO } from '../types/organization.types'
import { getOrganizationInitial } from '../utils/getOrganizationInitial'

import { DeleteAlertDialog } from '~/components/CustomAlertDialog/DeleteAlertDialog'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { getCityNameByID, getProvinceNameByID } from '~/constants/locations'

type Props = {
  organization: OrganizationDTO
}

export function OrganizationCard({ organization }: Props) {
  const navigate = useNavigate()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const provinceName = getProvinceNameByID(organization.province)
  const cityName = getCityNameByID(organization.city)
  const fullLocation = `${organization.address}, ${cityName}, ${provinceName} ${organization.postalCode}`

  const navigateToOrganizationEdit = useCallback(() => {
    navigate(`/organizations/form?slug=${organization.slug}`)
  }, [navigate, organization.slug])

  const deleteOrganization = useCallback(() => {
    organizationActions.deleteOrganization(organization.id)
    setShowDeleteConfirm(false)
  }, [organization.id])

  const showDeleteConfirmation = useCallback(() => {
    setShowDeleteConfirm(true)
  }, [])

  return (
    <>
      <Card className="rounded-none border-t-0 border-r-0 border-l-0 border-gray-200 py-4 shadow-none">
        <div className="flex gap-4">
          {organization.logo ? (
            <img
              src={organization.logo}
              alt={organization.name}
              className="rounded-full w-16 h-16 shrink-0 object-cover"
            />
          ) : (
            <div className="rounded-full flex items-center justify-center bg-gray-200 font-semibold text-lg w-16 h-16 shrink-0">
              {getOrganizationInitial(organization.name)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{organization.name}</h3>
                <p className="text-sm text-gray-600 truncate">{organization.phone}</p>
                <p className="text-sm text-gray-500 line-clamp-2">{fullLocation}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  type="button"
                  size="icon"
                  className="bg-warning hover:bg-[#FFC300] text-white h-auto w-auto p-1 shrink-0"
                  onClick={navigateToOrganizationEdit}
                >
                  <SquarePenIcon className="w-4! h-4!" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  className="bg-destructive hover:bg-[#D83A56] text-white h-auto w-auto p-1 shrink-0"
                  onClick={showDeleteConfirmation}
                >
                  <Trash2Icon className="w-4! h-4!" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <DeleteAlertDialog
        open={showDeleteConfirm}
        title="Delete Organization?"
        description={`Organization "${organization.name}" will be permanently deleted.\nThis action cannot be undone`}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={deleteOrganization}
      />
    </>
  )
}
