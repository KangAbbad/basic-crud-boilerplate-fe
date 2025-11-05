import { useObservable } from '@legendapp/state/react'

export const useLocationPicker = (initialLat?: number, initialLng?: number) => {
  const isOpen$ = useObservable(false)
  const latitude$ = useObservable(initialLat ?? -6.2088)
  const longitude$ = useObservable(initialLng ?? 106.8456)

  const showModal = (): void => {
    isOpen$.set(true)
  }

  const hideModal = (): void => {
    isOpen$.set(false)
  }

  const selectLocation = (lat: number, lng: number): void => {
    latitude$.set(lat)
    longitude$.set(lng)
    hideModal()
  }

  const updateLocation = (lat: number, lng: number): void => {
    latitude$.set(lat)
    longitude$.set(lng)
  }

  return {
    isOpen$,
    latitude$,
    longitude$,
    showModal,
    hideModal,
    selectLocation,
    updateLocation,
  }
}
