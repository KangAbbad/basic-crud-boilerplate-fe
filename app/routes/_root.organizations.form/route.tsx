import { FormProvider } from 'react-hook-form'

import type { Route } from './+types/route'
import { AddressField } from './components/AddressField'
import { CityField } from './components/CityField'
import { FormFooter } from './components/FormFooter'
import { FormHeader } from './components/FormHeader'
import { LocationField } from './components/LocationField'
import { LogoField } from './components/LogoField'
import { NameField } from './components/NameField'
import { PhoneField } from './components/PhoneField'
import { PostalCodeField } from './components/PostalCodeField'
import { ProvinceField } from './components/ProvinceField'
import { useOrganizationFormData } from './hooks/useOrganizationFormData'
import { useOrganizationFormSubmit } from './hooks/useOrganizationFormSubmit'

export function meta(_metaArgs: Route.MetaArgs) {
  return [{ title: 'Organization Form' }]
}

export default function OrganizationFormPage() {
  const { form, existingOrganization } = useOrganizationFormData()
  const { control, handleSubmit, setValue } = form
  const { submitOrganizationForm, cancelOrganizationForm } = useOrganizationFormSubmit({ form, existingOrganization })

  const isEditMode = Boolean(existingOrganization)

  return (
    <div className="flex flex-col min-h-screen">
      <FormHeader isEditMode={isEditMode} onCancel={cancelOrganizationForm} />
      <FormProvider {...form}>
        <div className="flex-1 overflow-y-auto space-y-5 p-4">
          <LogoField control={control} />
          <NameField control={control} />
          <PhoneField control={control} />
          <ProvinceField control={control} />
          <CityField control={control} />
          <AddressField control={control} />
          <PostalCodeField control={control} />
          <LocationField control={control} setValue={setValue} />
        </div>
      </FormProvider>
      <FormFooter onSubmit={handleSubmit(submitOrganizationForm)} />
    </div>
  )
}
