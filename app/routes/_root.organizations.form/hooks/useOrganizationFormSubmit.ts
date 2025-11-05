import type { UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { organizationActions } from '../../_root.organizations._index/stores/organizations.store'
import type { OrganizationDTO, OrganizationFormDTO } from '../../_root.organizations._index/types/organization.types'

type Props = {
  form: UseFormReturn<OrganizationFormDTO>
  existingOrganization?: OrganizationDTO
}

export const useOrganizationFormSubmit = ({ form, existingOrganization }: Props) => {
  const navigate = useNavigate()

  const cancelOrganizationForm = () => {
    navigate('/organizations')
  }

  const submitOrganizationForm = (): void => {
    const values = form.getValues()

    if (existingOrganization) {
      organizationActions.updateOrganization(existingOrganization.id, values)
    } else {
      organizationActions.createOrganization(values)
    }
    navigate('/organizations')
  }

  return {
    submitOrganizationForm,
    cancelOrganizationForm,
  }
}
