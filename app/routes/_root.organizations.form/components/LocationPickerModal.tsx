import type { LatLngExpression } from 'leaflet'
import { control, divIcon } from 'leaflet'
import { XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

import { useReverseGeocode } from '../hooks/useReverseGeocode'

import { Button } from '~/components/ui/button'

type Props = {
  isOpen: boolean
  latitude?: number
  longitude?: number
  onSelectLocation: (lat: number, lng: number) => void
  onClose: () => void
}

function MapClickHandler({ onUpdateLocation }: { onUpdateLocation: (lat: number, lng: number) => void }) {
  const map = useMap()

  useMapEvents({
    click(e) {
      const lat = e.latlng.lat
      const lng = e.latlng.lng
      map.flyTo([lat, lng], 15, { duration: 1 })
      onUpdateLocation(lat, lng)
    },
  })
  return null
}

function ZoomControl() {
  const map = useMap()

  useEffect(() => {
    const zoomCtrl = control.zoom({ position: 'topright' })
    map.addControl(zoomCtrl)

    return () => {
      map.removeControl(zoomCtrl)
    }
  }, [map])

  return null
}

function GeolocationControl({ onUpdateLocation }: { onUpdateLocation: (lat: number, lng: number) => void }) {
  const map = useMap()

  useEffect(() => {
    const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" x2="5" y1="12" y2="12"/><line x1="19" x2="22" y1="12" y2="12"/><line x1="12" x2="12" y1="2" y2="5"/><line x1="12" x2="12" y1="19" y2="22"/><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/></svg>`

    const container = document.createElement('div')
    container.className = 'leaflet-control leaflet-bar'

    const button = document.createElement('button')
    button.type = 'button'
    button.innerHTML = iconSvg
    button.className = 'leaflet-control-geolocation'
    button.style.cssText = `
      width: 36px;
      height: 36px;
      background-color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
      color: #333;
      padding: 0;
    `
    button.setAttribute('title', 'Use current location')

    button.addEventListener('mouseover', () => {
      button.style.backgroundColor = '#f5f5f5'
    })
    button.addEventListener('mouseout', () => {
      button.style.backgroundColor = 'white'
    })
    button.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            map.flyTo([latitude, longitude], 15, { duration: 1.5 })
            onUpdateLocation(latitude, longitude)
          },
          () => {
            alert('Cannot access your location. Please ensure location permissions are enabled.')
          }
        )
      } else {
        alert('Your device does not support geolocation')
      }
    })

    container.appendChild(button)
    container.style.position = 'absolute'
    container.style.bottom = '30px'
    container.style.right = '10px'
    container.style.zIndex = '1000'
    ;(map as unknown as { _controlContainer: HTMLElement })._controlContainer.appendChild(container)

    return () => {
      try {
        container.remove()
      } catch {
        // Ignore cleanup errors
      }
    }
  }, [map, onUpdateLocation])

  return null
}

// Material Design marker icon
const MAP_MARKER =
  'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z'

const defaultIcon = divIcon({
  className: 'custom-pin',
  html: `
    <svg width="48" height="60" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="${MAP_MARKER}" fill="#F44336"/>
    </svg>
  `,
  iconSize: [48, 60],
  iconAnchor: [24, 60],
  popupAnchor: [0, -60],
})

export function LocationPickerModal({ isOpen, latitude, longitude, onSelectLocation, onClose }: Props) {
  const [previewLat, setPreviewLat] = useState(latitude ?? -6.2088)
  const [previewLng, setPreviewLng] = useState(longitude ?? 106.8456)

  // Sync preview with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setPreviewLat(latitude ?? -6.2088)
      setPreviewLng(longitude ?? 106.8456)
    }
  }, [isOpen, latitude, longitude])

  const { street, village, district, city, province, postalCode, loading } = useReverseGeocode(previewLat, previewLng)

  if (!isOpen) return null

  // Check if coordinates are valid (not 0,0 and not both zero)
  const hasValidCoordinates = !(previewLat === 0 && previewLng === 0)
  const markerPosition: LatLngExpression = [previewLat, previewLng]
  const mapCenter: LatLngExpression = [previewLat, previewLng]

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end bg-black/50">
      <div className="rounded-t-lg overflow-y-auto bg-white w-full max-w-[428px] max-h-[90vh]">
        {/* Header */}
        <div className="border-b border-gray-200 flex items-start justify-between sticky top-0 bg-white px-4 py-2">
          <h2 className="text-lg font-semibold">Select Location</h2>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Close"
            className="h-auto w-auto p-1 -mr-2"
            onClick={onClose}
          >
            <XIcon className="w-5! h-5!" />
          </Button>
        </div>

        {/* Map */}
        <div className="overflow-hidden flex items-center justify-center bg-gray-100 h-64 w-full">
          {hasValidCoordinates ? (
            <MapContainer center={mapCenter} zoom={13} zoomControl={false} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&hl=en" />
              <Marker position={markerPosition} icon={defaultIcon} />
              <MapClickHandler
                onUpdateLocation={(lat, lng) => {
                  setPreviewLat(lat)
                  setPreviewLng(lng)
                }}
              />
              <ZoomControl />
              <GeolocationControl
                onUpdateLocation={(lat, lng) => {
                  setPreviewLat(lat)
                  setPreviewLng(lng)
                }}
              />
            </MapContainer>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 text-sm">Use geolocation to start</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="rounded bg-blue-50 text-sm text-blue-800 p-3 mb-4">
            <p>Click on the map to select location</p>
            {loading ? (
              <p className="text-xs text-blue-600 mt-1">Loading address...</p>
            ) : (
              <div className="space-y-1 text-xs text-blue-600 mt-1">
                {street && (
                  <p>
                    <span className="font-semibold">Street:</span> {street}
                  </p>
                )}
                {village && (
                  <p>
                    <span className="font-semibold">Village:</span> {village}
                  </p>
                )}
                {district && (
                  <p>
                    <span className="font-semibold">District:</span> {district}
                  </p>
                )}
                {(city ?? province) && (
                  <p>
                    <span className="font-semibold">City/Province:</span> {[city, province].filter(Boolean).join(', ')}
                  </p>
                )}
                {postalCode && (
                  <p>
                    <span className="font-semibold">Postal Code:</span> {postalCode}
                  </p>
                )}
              </div>
            )}
          </div>
          <Button
            className="w-full"
            onClick={() => {
              onSelectLocation(previewLat, previewLng)
            }}
          >
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  )
}
