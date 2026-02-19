'use client'

import { useState } from 'react'

// Mock data for transfers
const initialTransfers = [
  { id: 1, personCode: 'R01001P02', personName: 'Pastor Ruth Mutendi', fromZone: 'Harare Central', toZone: 'Harare West', date: '2024-01-15', reason: 'Promotion to Zone Head', approver: 'Regional Pastor', status: 'approved' },
  { id: 2, personCode: 'R02002D05', personName: 'Deacon Thomas Ncube', fromZone: 'Bulawayo North', toZone: 'Bulawayo Central', date: '2024-01-10', reason: 'Closer to home', approver: 'Zone Pastor', status: 'approved' },
  { id: 3, personCode: 'R01003D12', personName: 'Deacon Mary Jera', fromZone: 'Harare West', toZone: 'Mutare Central', date: '2024-01-20', reason: 'Family relocation', approver: 'Regional Pastor', status: 'pending' },
  { id: 4, personCode: 'R03001P01', personName: 'Pastor Joseph Magaya', fromZone: 'Mutare Central', toZone: 'Gweru Central', date: '2023-12-05', reason: 'Leadership restructure', approver: 'Super Admin', status: 'approved' },
]

// Mock people for selection
const people = [
  { code: 'R01001P01', name: 'Pastor John Moyo', type: 'pastor', currentZone: 'Harare Central' },
  { code: 'R01002P01', name: 'Pastor Mary Ncube', type: 'pastor', currentZone: 'Harare East' },
  { code: 'R01003P01', name: 'Pastor Peter Dube', type: 'pastor', currentZone: 'Harare West' },
  { code: 'R01001D01', name: 'Deacon Paul Mhandu', type: 'deacon', currentZone: 'Harare Central' },
  { code: 'R01002D02', name: 'Deacon Sarah Mpofu', type: 'deacon', currentZone: 'Harare East' },
]

const zones = ['Harare Central', 'Harare East', 'Harare West', 'Bulawayo Central', 'Bulawayo North', 'Mutare Central', 'Gweru Central', 'Masvingo Central']

export default function TransfersPage() {
  const [transfers, setTransfers] = useState(initialTransfers)
  const [showForm, setShowForm] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<typeof people[0] | null>(null)
  const [transferForm, setTransferForm] = useState({
    toZone: '',
    date: new Date().toISOString().split('T')[0],
    reason: '',
    approver: ''
  })

  const handleSubmitTransfer = () => {
    if (selectedPerson && transferForm.toZone && transferForm.reason && transferForm.approver) {
      const newId = Math.max(...transfers.map(t => t.id)) + 1
      setTransfers([{
        id: newId,
        personCode: selectedPerson.code,
        personName: selectedPerson.name,
        fromZone: selectedPerson.currentZone,
        toZone: transferForm.toZone,
        date: transferForm.date,
        reason: transferForm.reason,
        approver: transferForm.approver,
        status: 'pending'
      }, ...transfers])
      setShowForm(false)
      setSelectedPerson(null)
      setTransferForm({ toZone: '', date: new Date().toISOString().split('T')[0], reason: '', approver: '' })
    }
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>🔁 Transfers</h1>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            ➕ New Transfer
          </button>
        </div>
      </div>

      {/* Transfer Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div className="card-header">
            <h3 className="card-title">Create New Transfer</h3>
            <button 
              className="btn btn-icon btn-outline"
              onClick={() => setShowForm(false)}
            >
              ✕
            </button>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-lg)' }}>
              <div className="form-group">
                <label className="form-label">Select Person</label>
                <select
                  className="form-select"
                  value={selectedPerson?.code || ''}
                  onChange={(e) => {
                    const person = people.find(p => p.code === e.target.value)
                    setSelectedPerson(person || null)
                  }}
                >
                  <option value="">Select Pastor or Deacon</option>
                  {people.map(p => (
                    <option key={p.code} value={p.code}>
                      {p.name} ({p.type}) - {p.currentZone}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">From Zone (Auto)</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedPerson?.currentZone || ''}
                  disabled
                  style={{ backgroundColor: 'var(--color-gray-100)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">To Zone</label>
                <select
                  className="form-select"
                  value={transferForm.toZone}
                  onChange={(e) => setTransferForm({ ...transferForm, toZone: e.target.value })}
                >
                  <option value="">Select Destination Zone</option>
                  {zones.map(z => (
                    <option key={z} value={z} disabled={z === selectedPerson?.currentZone}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Transfer Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={transferForm.date}
                  onChange={(e) => setTransferForm({ ...transferForm, date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Approver</label>
                <select
                  className="form-select"
                  value={transferForm.approver}
                  onChange={(e) => setTransferForm({ ...transferForm, approver: e.target.value })}
                >
                  <option value="">Select Approver</option>
                  <option value="Zone Pastor">Zone Pastor</option>
                  <option value="Regional Pastor">Regional Pastor</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reason</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Promotion, Family relocation..."
                  value={transferForm.reason}
                  onChange={(e) => setTransferForm({ ...transferForm, reason: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button className="btn btn-outline" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmitTransfer}>
              Submit Transfer
            </button>
          </div>
        </div>
      )}

      {/* Transfer History */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">📋 Transfer History</h3>
          <span style={{ color: 'var(--color-gray-500)', fontSize: '0.875rem' }}>
            {transfers.length} records
          </span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Person</th>
                <th>From Zone</th>
                <th>To Zone</th>
                <th>Date</th>
                <th>Reason</th>
                <th>Approver</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((transfer) => (
                <tr key={transfer.id}>
                  <td>
                    <div>
                      <strong>{transfer.personName}</strong>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                        {transfer.personCode}
                      </div>
                    </div>
                  </td>
                  <td>{transfer.fromZone}</td>
                  <td>{transfer.toZone}</td>
                  <td>{transfer.date}</td>
                  <td style={{ maxWidth: '200px' }}>{transfer.reason}</td>
                  <td>{transfer.approver}</td>
                  <td>
                    <span className={`status-badge ${transfer.status === 'approved' ? 'active' : 'pending'}`}>
                      {transfer.status === 'approved' ? '✅ Approved' : '⏳ Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 'var(--spacing-lg)', padding: 'var(--spacing-md)', background: 'rgba(214, 158, 46, 0.1)', borderRadius: 'var(--radius)', border: '1px solid var(--color-accent)' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-700)', margin: 0 }}>
          <strong>⚠️ Note:</strong> Transfer records cannot be deleted. All transfers are logged in the audit trail for compliance.
        </p>
      </div>
    </div>
  )
}
