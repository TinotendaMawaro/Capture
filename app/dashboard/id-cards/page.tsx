'use client'

import { useState } from 'react'

// Mock ID card data
const cards = [
  { id: 1, code: 'R01001P01', name: 'Pastor John Moyo', type: 'Pastor', zone: 'Harare Central', issuedDate: '2024-01-15', status: 'active', qrGenerated: true },
  { id: 2, code: 'R01002P01', name: 'Pastor Mary Ncube', type: 'Pastor', zone: 'Harare East', issuedDate: '2024-01-10', status: 'active', qrGenerated: true },
  { id: 3, code: 'R01001D01', name: 'Deacon Paul Mhandu', type: 'Deacon', zone: 'Harare Central', issuedDate: '2023-12-20', status: 'active', qrGenerated: true },
  { id: 4, code: 'R02001P01', name: 'Pastor Samuel Ndlovu', type: 'Pastor', zone: 'Bulawayo Central', issuedDate: '2023-11-05', status: 'expired', qrGenerated: true },
]

export default function IDCardsPage() {
  const [selectedCard, setSelectedCard] = useState<typeof cards[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || card.type.toLowerCase() === typeFilter
    return matchesSearch && matchesType
  })

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>🪪 ID Card Management</h1>
        <div className="page-header-actions">
          <button className="btn btn-outline">
            🖨️ Bulk Print
          </button>
          <button className="btn btn-primary">
            ➕ Generate New Card
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Search by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          className="form-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="pastor">Pastors</option>
          <option value="deacon">Deacons</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 'var(--spacing-lg)' }}>
        {/* Cards List */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Card Registry</h3>
            <span style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
              {filteredCards.length} cards
            </span>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Zone</th>
                  <th>Issued</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.map((card) => (
                  <tr 
                    key={card.id} 
                    onClick={() => setSelectedCard(card)}
                    style={{ cursor: 'pointer', background: selectedCard?.id === card.id ? 'var(--color-gray-50)' : 'transparent' }}
                  >
                    <td><strong>{card.code}</strong></td>
                    <td>{card.name}</td>
                    <td>{card.type}</td>
                    <td>{card.zone}</td>
                    <td>{card.issuedDate}</td>
                    <td>
                      <span className={`status-badge ${card.status}`}>
                        {card.status === 'active' ? '🟢 Active' : '🔴 Expired'}
                      </span>
                    </td>
                    <td className="actions">
                      <button className="btn btn-sm btn-outline">🖨️ Print</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Preview Panel */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Card Preview</h3>
          </div>
          <div className="card-body">
            {selectedCard ? (
              <div>
                {/* Front of Card */}
                <div style={{ 
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--spacing-lg)',
                  color: 'white',
                  marginBottom: 'var(--spacing-md)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>MINISTRY ID</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '700' }}>H.I.M</div>
                    </div>
                    <div style={{ 
                      width: '60px', 
                      height: '60px', 
                      background: 'white', 
                      borderRadius: 'var(--radius)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: 'var(--color-primary)',
                      fontSize: '1.5rem'
                    }}>
                      ✝
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                    <div style={{ 
                      width: '70px', 
                      height: '70px', 
                      background: 'rgba(255,255,255,0.2)', 
                      borderRadius: 'var(--radius)',
                      border: '2px solid white'
                    }}>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>{selectedCard.name}</div>
                      <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{selectedCard.type}</div>
                      <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '4px' }}>ID: {selectedCard.code}</div>
                    </div>
                  </div>
                </div>

                {/* Back of Card */}
                <div style={{ 
                  background: 'var(--color-gray-100)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--spacing-md)',
                  border: '1px solid var(--color-gray-200)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)' }}>Zone</div>
                      <div style={{ fontWeight: '500' }}>{selectedCard.zone}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)' }}>Issued</div>
                      <div style={{ fontWeight: '500' }}>{selectedCard.issuedDate}</div>
                    </div>
                  </div>
                  
                  {/* QR Code Placeholder */}
                  <div style={{ 
                    background: 'white', 
                    padding: 'var(--spacing-md)', 
                    borderRadius: 'var(--radius)',
                    textAlign: 'center'
                  }}>
                    <div style={{ 
                      width: '100px', 
                      height: '100px', 
                      background: 'var(--color-gray-200)',
                      margin: '0 auto var(--spacing-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      color: 'var(--color-gray-500)'
                    }}>
                      QR Code
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--color-gray-500)' }}>
                      Scan to verify
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ marginTop: 'var(--spacing-lg)', display: 'flex', gap: 'var(--spacing-sm)' }}>
                  <button className="btn btn-primary" style={{ flex: 1 }}>
                    🖨️ Print Card
                  </button>
                  <button className="btn btn-outline">
                    ↻ Reissue
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: 'var(--spacing-xl)', 
                color: 'var(--color-gray-500)' 
              }}>
                <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-md)' }}>🪪</div>
                <p>Select a card to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
