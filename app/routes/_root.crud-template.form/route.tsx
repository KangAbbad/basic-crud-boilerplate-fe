import { FormProvider } from 'react-hook-form'

import { DateField } from './components/DateField'
import { FormFooter } from './components/FormFooter'
import { FormHeader } from './components/FormHeader'
import { NameField } from './components/NameField'
import { NotesField } from './components/NotesField'
import { PhoneField } from './components/PhoneField'
import { PriceField } from './components/PriceField'
import { QuantityField } from './components/QuantityField'
import { WeightField } from './components/WeightField'
import { useDataFormData } from './hooks/useDataFormData'
import { useDataFormSubmit } from './hooks/useDataFormSubmit'

export function meta() {
  return [{ title: 'Data Form' }]
}

export default function DataFormPage() {
  const { form, existingData, selectedOrganization } = useDataFormData()
  const { control, handleSubmit } = form
  const { submitDataForm, cancelDataForm } = useDataFormSubmit({
    form,
    existingData,
    organizationName: selectedOrganization?.name,
  })

  const isEditMode = Boolean(existingData)

  return (
    <div className="flex flex-col min-h-screen">
      <FormHeader isEditMode={isEditMode} onCancel={cancelDataForm} />
      <FormProvider {...form}>
        <div className="flex-1 overflow-y-auto space-y-5 p-4">
          <NameField control={control} />
          <PhoneField control={control} />
          <PriceField control={control} />
          <QuantityField control={control} />
          <WeightField control={control} />
          <DateField control={control} />
          <NotesField control={control} />
        </div>
      </FormProvider>
      <FormFooter onSubmit={handleSubmit(submitDataForm)} />
    </div>
  )
}
