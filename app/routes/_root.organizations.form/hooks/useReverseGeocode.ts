import { useEffect, useState } from 'react'

export type AddressDetails = {
  street?: string
  village?: string
  district?: string
  city?: string
  province?: string
  postalCode?: string
  loading: boolean
}

export const useReverseGeocode = (latitude: number, longitude: number): AddressDetails => {
  const [addressDetails, setAddressDetails] = useState<AddressDetails>({
    loading: false,
  })

  useEffect(() => {
    const fetchAddress = async () => {
      setAddressDetails((prev) => ({ ...prev, loading: true }))
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=id`,
          {
            headers: {
              'Accept-Language': 'id',
            },
          }
        )
        const data = await response.json()
        const addr = data.address ?? {}

        // Log for debugging
        // if (import.meta.env.DEV) {
        //   console.log('Full address data:', addr)
        // }

        setAddressDetails({
          street: addr.road ?? addr.house_number ?? addr.neighbourhood ?? addr.suburb ?? addr.residential ?? undefined,
          village: addr.village ?? addr.hamlet ?? undefined,
          district: addr.town ?? addr.district ?? undefined,
          city: addr.county ?? addr.city ?? undefined,
          province: addr.state ?? addr.province ?? undefined,
          postalCode: addr.postcode ?? undefined,
          loading: false,
        })
      } catch (error) {
        console.error('Geocoding error:', error)
        setAddressDetails({
          loading: false,
        })
      }
    }

    fetchAddress()
  }, [latitude, longitude])

  return addressDetails
}
