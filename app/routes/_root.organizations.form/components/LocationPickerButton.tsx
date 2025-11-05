import type { LatLngExpression } from 'leaflet'
import { divIcon } from 'leaflet'
import { MapPinIcon } from 'lucide-react'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { Button } from '~/components/ui/button'

type Props = {
  latitude?: number
  longitude?: number
  onShowModal: () => void
}

// Material Design marker icon
const MAP_MARKER =
  'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'

const markerIcon = divIcon({
  className: 'custom-pin',
  html: `
    <svg width="40" height="50" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="${MAP_MARKER}" fill="#F44336"/>
    </svg>
  `,
  iconSize: [40, 50],
  iconAnchor: [14, 50],
  popupAnchor: [0, -50],
})

export function LocationPickerButton({ latitude, longitude, onShowModal }: Props) {
  const hasLocation = latitude !== undefined && longitude !== undefined
  const markerPosition: LatLngExpression = hasLocation ? [latitude, longitude] : [-6.2088, 106.8456]

  return (
    <div className="space-y-2">
      <div
        className="rounded-lg border border-gray-300 hover:border-primary relative z-0 overflow-hidden w-full h-40 cursor-pointer transition-colors"
        onClick={onShowModal}
      >
        <MapContainer
          key={`${latitude}-${longitude}`}
          center={markerPosition}
          zoom={14}
          dragging={false}
          zoomControl={false}
          scrollWheelZoom={false}
          touchZoom={false}
          doubleClickZoom={false}
          style={{ height: '100%', width: '100%' }}
          className="pointer-events-none"
        >
          <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en" />
          <Marker position={markerPosition} icon={markerIcon} />
        </MapContainer>
      </div>
      <Button type="button" variant="outline" className="gap-2 w-full" onClick={onShowModal}>
        <MapPinIcon className="w-4 h-4" />
        {hasLocation ? 'Change Location' : 'Select Location from Map'}
      </Button>
    </div>
  )
}
