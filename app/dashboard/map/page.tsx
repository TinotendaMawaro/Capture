'use client'

import { useState } from 'react'

// Mock zone data for map
const zoneData = [
  { code: 'R01001', name: 'Harare Central', pastor: 'Pastor John Moyo', departments: 5, members: 250, status: 'active', x: 50, y: 35 },
  { code: 'R01002', name: 'Harare East', pastor: 'Pastor Mary Ncube', departments: 3, members: 180, status: 'active', x: 65, y: 30 },
  { code: 'R01003', name: 'Harare West', pastor: 'Pastor Peter Dube', departments: 2, members: 165, status: 'active', x: 35, y: 40 },
  { code: 'R02001', name: 'Bulawayo Central', pastor: 'Pastor Samuel Ndlovu', departments: 4, members: 220, status: 'active', x: 30, y: 60 },
  { code: 'R02002', name: 'Bulawayo North', pastor: 'Pastor David Moyo', departments: 2, members: 145, status: 'pending', x: 40, y: 50 },
  { code: 'R03001', name: 'Mutare Central', pastor: 'Pastor Joseph Magaya', departments: 3, members: 120, status: 'active', x: 80, y: 70 },
  { code: 'R04001', name: 'Gweru Central', pastor: 'Pastor Brighton Chiromo', departments: 2, members: 95, status: 'active', x: 45, y: 55 },
  { code: 'R05001', name: 'Masvingo Central', pastor: 'Pastor Michael Zhou', departments: 1, members: 88, status: 'inactive', x: 60, y: 80 },
]

export default function MapPage() {
  const [selectedZone, setSelectedZone] = useState<typeof zoneData[0] | null>(null)
  const [viewMode, setViewMode] = useState<'pins' | 'heatmap'>('pins')
  const [regionFilter, setRegionFilter] = useState('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#38a169'
      case 'pending': return '#d69e2e'
      case 'inactive': return '#e53e3e'
      default: return '#a0aec0'
    }
  }

  const filteredZones = regionFilter === 'all' 
    ? zoneData 
    : zoneData.filter(z => z.code.startsWith(regionFilter))

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>🗺 Live Map - Zimbabwe</h1>
        <div className="page-header-actions">
          <select 
            className="form-select"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            style={{ width: 'auto' }}
          >
            <option value="all">All Regions</option>
            <option value="R01">Harare Region</option>
            <option value="R02">Bulawayo Region</option>
            <option value="R03">Mutare Region</option>
            <option value="R04">Gweru Region</option>
            <option value="R05">Masvingo Region</option>
          </select>
          <button 
            className={`btn ${viewMode === 'pins' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setViewMode('pins')}
          >
            📍 Pins
          </button>
          <button 
            className={`btn ${viewMode === 'heatmap' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setViewMode('heatmap')}
          >
            🔥 Heatmap
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 'var(--spacing-lg)' }}>
        {/* Map Area */}
        <div className="card">
          <div className="card-body" style={{ padding: 0, position: 'relative', height: '500px', overflow: 'hidden' }}>
            {/* Zimbabwe Map SVG Background */}
            <svg 
              viewBox="0 0 100 100" 
              style={{ 
                width: '100%', 
                height: '100%', 
                background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)'
              }}
            >
              {/* Simplified Zimbabwe outline */}
              <path
                d="M25,20 L35,15 L50,12 L65,15 L75,25 L78,40 L75,55 L70,65 L55,75 L40,80 L30,75 L22,60 L20,45 L22,30 Z"
                fill="#e2e8f0"
                stroke="#cbd5e0"
                strokeWidth="0.5"
              />
              
              {/* Grid lines */}
              {[20, 40, 60, 80].map(x => (
                <line key={`v${x}`} x1={x} y1={10} x2={x} y2={90} stroke="#cbd5e0" strokeWidth="0.2" strokeDasharray="1,1" />
              ))}
              {[20, 40, 60, 80].map(y => (
                <line key={`h${y}`} x1={10} y1={y} x2={90} y2={y} stroke="#cbd5e0" strokeWidth="0.2" strokeDasharray="1,1" />
              ))}

              {/* Zone Pins */}
              {filteredZones.map((zone) => (
                <g 
                  key={zone.code}
                  onClick={() => setSelectedZone(zone)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={zone.x}
                    cy={zone.y}
                    r={viewMode === 'heatmap' ? 8 + (zone.members / 50) : 3}
                    fill={viewMode === 'heatmap' ? getStatusColor(zone.status) : getStatusColor(zone.status)}
                    fillOpacity={viewMode === 'heatmap' ? 0.6 : 1}
                    stroke="white"
                    strokeWidth={selectedZone?.code === zone.code ? 1 : 0.5}
                  />
                  {viewMode === 'pins' && (
                    <text
                      x={zone.x}
                      y={zone.y + 5}
                      fontSize="2.5"
                      textAnchor="middle"
                      fill="#1a365d"
                      fontWeight="600"
                    >
                      {zone.code.replace('R0', '')}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            {/* Map Legend */}
            <div style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              background: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '8px', color: 'var(--color-gray-600)' }}>
                LEGEND
              </div>
              <div style={{ display: 'flex', gap: '16px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#38a169' }}></span>
                  Active
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#d69e2e' }}></span>
                  Needs Update
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e53e3e' }}></span>
                  Inactive
                </div>
              </div>
            </div>

            {/* Stats overlay */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'white',
              padding: '12px 16px',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Map Statistics</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '4px' }}>
                {filteredZones.length} Zones • {filteredZones.reduce((sum, z) => sum + z.members, 0)} Members
              </div>
            </div>
          </div>
        </div>

        {/* Zone Details Panel */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              {selectedZone ? `📍 ${selectedZone.name}` : 'Select a Zone'}
            </h3>
          </div>
          <div className="card-body">
            {selectedZone ? (
              <div>
                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginBottom: '4px' }}>Zone Code</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '600' }}>{selectedZone.code}</div>
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginBottom: '4px' }}>Status</div>
                  <span className={`status-badge ${selectedZone.status}`}>
                    {selectedZone.status === 'active' ? '🟢 Active' : 
                     selectedZone.status === 'pending' ? '🟡 Needs Update' : '🔴 Inactive'}
                  </span>
                </div>

                <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginBottom: '4px' }}>Zone Pastor</div>
                  <div style={{ fontWeight: '500' }}>{selectedZone.pastor}</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                  <div style={{ 
                    padding: 'var(--spacing-md)', 
                    background: 'var(--color-gray-50)', 
                    borderRadius: 'var(--radius)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>
                      {selectedZone.departments}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Departments</div>
                  </div>
                  <div style={{ 
                    padding: 'var(--spacing-md)', 
                    background: 'var(--color-gray-50)', 
                    borderRadius: 'var(--radius)',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-accent-dark)' }}>
                      {selectedZone.members}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Members</div>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <button className="btn btn-primary" style={{ flex: 1 }}>
                    View Profile
                  </button>
                  <button className="btn btn-outline">
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: 'var(--spacing-xl)', 
                color: 'var(--color-gray-500)' 
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🗺</div>
                <p>Click on a zone pin to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
