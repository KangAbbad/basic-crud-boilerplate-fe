import { memo, useCallback, useState } from 'react'
import { type Control, useWatch } from 'react-hook-form'

import { LocationPickerButton } from './LocationPickerButton'
import { LocationPickerModal } from './LocationPickerModal'
import type { OrganizationFormDTO } from '../../_root.organizations._index/types/organization.types'

import { Label } from '~/components/ui/label'

type Props = {
  control: Control<OrganizationFormDTO>
  setValue: (name: 'latitude' | 'longitude', value: number) => void
}

export const LocationField = memo(function LocationField({ control, setValue }: Props) {
  const [isMapOpen, setIsMapOpen] = useState(false)
  const selectedLatitude = useWatch({ control, name: 'latitude' })
  const selectedLongitude = useWatch({ control, name: 'longitude' })

  const showModal = useCallback(() => {
    setIsMapOpen(true)
  }, [])

  const hideModal = useCallback(() => {
    setIsMapOpen(false)
  }, [])

  const onSelectLocation = useCallback(
    (lat: number, lng: number) => {
      setValue('latitude', lat)
      setValue('longitude', lng)
      hideModal()
    },
    [hideModal, setValue]
  )

  return (
    <>
      <div className="space-y-2">
        <Label>Location on Map</Label>
        <LocationPickerButton latitude={selectedLatitude} longitude={selectedLongitude} onShowModal={showModal} />
      </div>
      <LocationPickerModal
        isOpen={isMapOpen}
        latitude={selectedLatitude}
        longitude={selectedLongitude}
        onClose={hideModal}
        onSelectLocation={onSelectLocation}
      />
    </>
  )
})
