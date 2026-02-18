'use client'

interface MapProps {
  markers?: { lat: number; lng: number; label: string }[]
}

export default function MapComponent({ markers = [] }: MapProps) {
  return (
    <div className="map-container">
      <div className="map-placeholder">
        <p>Map Component</p>
        {markers.map((marker, index) => (
          <div key={index}>
            {marker.label} ({marker.lat}, {marker.lng})
          </div>
        ))}
      </div>
    </div>
  )
}

