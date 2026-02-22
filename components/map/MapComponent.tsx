'use client'

/**
 * Live Map Component - Displays zones on interactive map
 * Uses Leaflet for map rendering and Supabase data for zone locations
 */

import React, { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
)

const Circle = dynamic(
  () => import('react-leaflet').then(mod => mod.Circle),
  { ssr: false }
)

export interface MapZone {
  id: string
  name: string
  latitude: number
  longitude: number
  full_code: string
  region?: string
  pastor_count?: number
  member_count?: number
}

interface MapComponentProps {
  zones?: MapZone[]
  selectedRegion?: string
  onZoneClick?: (zone: MapZone) => void
  showClusters?: boolean
}

interface ZoneApiResponse {
  id: string
  name: string
  latitude: string | number
  longitude: string | number
  full_code: string
  regions?: { name: string }
}

const REGION_COLORS: Record<string, string> = {
  'Harare': '#FF6B6B',
  'Bulawayo': '#4ECDC4',
  'Manicaland': '#45B7D1',
  'Mashonaland Central': '#FFA07A',
  'Mashonaland East': '#98D8C8',
  'Mashonaland West': '#F7DC6F',
  'Matabeleland North': '#BB8FCE',
  'Matabeleland South': '#85C1E2',
  'Midlands': '#F8B88B',
  'Zambezi': '#80C3F5'
}

export const MapComponent = React.forwardRef<
  HTMLDivElement,
  MapComponentProps
>(({ zones = [], selectedRegion, onZoneClick, showClusters = true }, ref) => {
  const [filteredZones, setFilteredZones] = useState<MapZone[]>(zones)
  const [loading, setLoading] = useState(false)

  // Default center (Zimbabwe)
  const defaultCenter: [number, number] = [-19.0154, 29.1549]
  const defaultZoom = 6

  useEffect(() => {
    setFilteredZones(
      selectedRegion
        ? zones.filter(z => z.region === selectedRegion)
        : zones
    )
  }, [zones, selectedRegion])

  const loadZones = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/zones?limit=1000')
      const result = await response.json()

      if (result.success && result.data) {
        const mappedZones: MapZone[] = result.data
          .filter((z: ZoneApiResponse) => z.latitude && z.longitude)
          .map((z: ZoneApiResponse) => ({
            id: z.id,
            name: z.name,
            latitude: parseFloat(String(z.latitude)),
            longitude: parseFloat(String(z.longitude)),
            full_code: z.full_code,
            region: z.regions?.name || 'Unknown'
          }))

        setFilteredZones(mappedZones)
      }
    } catch (error) {
      console.error('Error loading zones:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Load zones from API if not provided
    if (!zones || zones.length === 0) {
      loadZones()
    }
  }, [zones, loadZones])

  const getMarkerColor = (region?: string): string => {
    return REGION_COLORS[region || 'Unknown'] || '#3388FF'
  }

  // Client-side only rendering
  if (typeof window === 'undefined') {
    return <div>Loading map...</div>
  }

  return (
    <div ref={ref} className="relative w-full h-full rounded-lg overflow-hidden border border-gray-300">
      {loading && (
        <div className="absolute top-4 left-4 z-10 bg-white px-4 py-2 rounded shadow">
          <span className="text-sm text-gray-600">Loading zones...</span>
        </div>
      )}

      {filteredZones.length === 0 ? (
        <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded">
          <div className="text-center">
            <p className="text-gray-500 mb-2">No zones to display on map</p>
            <button
              onClick={loadZones}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
            >
              Try loading zones
            </button>
          </div>
        </div>
      ) : (
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          className="w-full h-96"
          style={{ height: '600px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {filteredZones.map(zone => (
            <React.Fragment key={zone.id}>
              <Marker
                position={[zone.latitude, zone.longitude]}
                title={zone.name}
                eventHandlers={{
                  click: () => onZoneClick?.(zone)
                }}
              >
                <Popup closeButton={true}>
                  <div className="text-sm">
                    <h3 className="font-bold text-gray-900">{zone.name}</h3>
                    <p className="text-gray-600">{zone.full_code}</p>
                    {zone.region && (
                      <p className="text-gray-500 text-xs">{zone.region}</p>
                    )}
                    {zone.pastor_count !== undefined && (
                      <p className="text-gray-600 mt-1">
                        Pastors: {zone.pastor_count}
                      </p>
                    )}
                    {zone.member_count !== undefined && (
                      <p className="text-gray-600">
                        Members: {zone.member_count}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>

              {showClusters && (
                <Circle
                  center={[zone.latitude, zone.longitude]}
                  radius={5000}
                  pathOptions={{
                    color: getMarkerColor(zone.region),
                    fillColor: getMarkerColor(zone.region),
                    fillOpacity: 0.1,
                    weight: 2
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </MapContainer>
      )}

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 z-10 bg-white rounded-lg shadow-lg p-3 max-w-xs">
        <h4 className="font-semibold text-sm text-gray-700 mb-2">Regions</h4>
        <div className="space-y-1 text-xs">
          {Object.entries(REGION_COLORS).map(([region, color]) => (
            <div key={region} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>{region}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

MapComponent.displayName = 'MapComponent'

export default MapComponent
