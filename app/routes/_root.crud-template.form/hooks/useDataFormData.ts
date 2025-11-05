import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router'

import { dataActions, useIsInitialized } from '../../_root.crud-template._index/stores/crud-template.store'
import {
  CreateDataFormDTOSchema,
  type DataDTO,
  type CreateDataFormDTO,
} from '../../_root.crud-template._index/types/crud-template.types'
import {
  useIsInitialized as useIsOrganizationsInitialized,
  useSelectedOrganization,
} from '../../_root.organizations._index/stores/organizations.store'

const getInitialFormData = (
  selectedData?: DataDTO,
  selectedOrganizationId?: string,
  isOrganizationsInitialized?: boolean
): CreateDataFormDTO => {
  if (isOrganizationsInitialized && !selectedOrganizationId && !selectedData) {
    throw new Error('Please select an organization first')
  }

  return {
    organizationId: selectedData?.organizationId ?? selectedOrganizationId ?? '',
    name: selectedData?.name ?? '',
    phone: selectedData?.phone ?? '',
    price: selectedData?.price ?? '',
    quantity: selectedData?.quantity ?? '',
    weight: selectedData?.weight ?? '',
    date: selectedData?.date ?? new Date().toISOString(),
    notes: selectedData?.notes ?? '',
  }
}

export const useDataFormData = () => {
  const [searchParams] = useSearchParams()
  const isDataInitialized = useIsInitialized()
  const isOrganizationsInitialized = useIsOrganizationsInitialized()
  const selectedOrganization = useSelectedOrganization()

  const dataSlug = searchParams.get('slug')
  const existingData = useMemo(
    () => (isDataInitialized && dataSlug ? dataActions.getDataBySlug(dataSlug) : undefined),
    [isDataInitialized, dataSlug]
  )

  const form = useForm<CreateDataFormDTO>({
    resolver: zodResolver(CreateDataFormDTOSchema),
    defaultValues: getInitialFormData(existingData, selectedOrganization?.id, isOrganizationsInitialized),
    mode: 'onSubmit',
  })

  useEffect(() => {
    form.reset(getInitialFormData(existingData, selectedOrganization?.id, isOrganizationsInitialized))
  }, [existingData, selectedOrganization?.id, isOrganizationsInitialized, form])

  return {
    form,
    existingData,
    selectedOrganization,
  }
}
