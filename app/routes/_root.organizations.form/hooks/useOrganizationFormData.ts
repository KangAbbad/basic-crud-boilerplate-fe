import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router'

import { organizationActions, useIsInitialized } from '../../_root.organizations._index/stores/organizations.store'
import {
  OrganizationFormDTOSchema,
  type OrganizationFormDTO,
  type OrganizationDTO,
} from '../../_root.organizations._index/types/organization.types'

const getInitialFormData = (existingOrganization?: OrganizationDTO): OrganizationFormDTO => {
  return {
    logo: existingOrganization?.logo,
    name: existingOrganization?.name ?? '',
    phone: existingOrganization?.phone ?? '',
    province: existingOrganization?.province ?? '',
    city: existingOrganization?.city ?? '',
    address: existingOrganization?.address ?? '',
    postalCode: existingOrganization?.postalCode ?? '',
    latitude: existingOrganization?.latitude,
    longitude: existingOrganization?.longitude,
  }
}

export const useOrganizationFormData = () => {
  const [searchParams] = useSearchParams()
  const isStoreInitialized = useIsInitialized()

  const organizationSlug = searchParams.get('slug')
  const existingOrganization = useMemo(
    () =>
      isStoreInitialized && organizationSlug ? organizationActions.getOrganizationBySlug(organizationSlug) : undefined,
    [isStoreInitialized, organizationSlug]
  )

  const form = useForm<OrganizationFormDTO>({
    resolver: zodResolver(OrganizationFormDTOSchema),
    defaultValues: getInitialFormData(existingOrganization),
    mode: 'onSubmit',
  })

  useEffect(() => {
    form.reset(getInitialFormData(existingOrganization))
  }, [existingOrganization, form])

  return {
    form,
    existingOrganization,
  }
}
