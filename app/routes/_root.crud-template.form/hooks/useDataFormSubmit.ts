import type { UseFormReturn } from 'react-hook-form'
import { useNavigate } from 'react-router'

import { dataActions } from '../../_root.crud-template._index/stores/crud-template.store'
import type { DataDTO, CreateDataFormDTO } from '../../_root.crud-template._index/types/crud-template.types'

type Props = {
  form: UseFormReturn<CreateDataFormDTO>
  existingData?: DataDTO
  organizationName?: string
}

export const useDataFormSubmit = ({ form, existingData, organizationName }: Props) => {
  const navigate = useNavigate()

  const cancelDataForm = () => {
    navigate('/crud-template')
  }

  const submitDataForm = (): void => {
    const values = form.getValues()

    // Create or update
    if (existingData) {
      dataActions.updateData(existingData.slug, {
        organizationId: values.organizationId,
        name: values.name,
        phone: values.phone,
        price: values.price,
        quantity: values.quantity,
        weight: values.weight,
        date: values.date,
        notes: values.notes,
      })
    } else {
      dataActions.createData({
        formData: values,
        organizationName: organizationName ?? 'DEFAULT',
      })
    }
    navigate('/crud-template')
  }

  return {
    submitDataForm,
    cancelDataForm,
  }
}
