'use client'

import { useState } from 'react'

// Mock report data
const reportTypes = [
  { id: 'pastors', name: 'Active Pastors Report', description: 'List of all active pastors with their zones', icon: '👤' },
  { id: 'zones', name: 'Zone Distribution Report', description: 'Distribution of zones across regions', icon: '⛪' },
  { id: 'growth', name: 'Growth Report', description: 'Monthly and yearly growth statistics', icon: '📈' },
  { id: 'transfers', name: 'Transfer Report', description: 'All transfer records and trends', icon: '🔄' },
  { id: 'departments', name: 'Department Report', description: 'Department overview and member counts', icon: '🏢' },
  { id: 'members', name: 'Membership Report', description: 'Detailed membership statistics', icon: '👥' },
]

const mockReportData = {
  pastors: [
    { region: 'Harare', active: 52, transferred: 3, retired: 2 },
    { region: 'Bulawayo', active: 38, transferred: 2, retired: 1 },
    { region: 'Mutare', active: 22, transferred: 1, retired: 0 },
    { region: 'Gweru', active: 16, transferred: 0, retired: 1 },
    { region: 'Masvingo', active: 12, transferred: 1, retired: 1 },
  ],
  zones: [
    { region: 'Harare', zones: 45, activeZones: 42, pendingZones: 3 },
    { region: 'Bulawayo', zones: 32, activeZones: 30, pendingZones: 2 },
    { region: 'Mutare', zones: 18, activeZones: 17, pendingZones: 1 },
    { region: 'Gweru', zones: 15, activeZones: 15, pendingZones: 0 },
    { region: 'Masvingo', zones: 14, activeZones: 12, pendingZones: 2 },
  ],
  transfers: [
    { month: 'Jan', count: 5 },
    { month: 'Feb', count: 8 },
    { month: 'Mar', count: 3 },
    { month: 'Apr', count: 12 },
    { month: 'May', count: 7 },
    { month: 'Jun', count: 4 },
  ]
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [regionFilter, setRegionFilter] = useState('all')
  const [dateRange, setDateRange] = useState('last6months')
  const [exportFormat, setExportFormat] = useState('pdf')

  const handleGenerateReport = () => {
    // In a real app, this would generate the report
    console.log('Generating report:', selectedReport, { regionFilter, dateRange })
  }

  const handleExport = () => {
    // In a real app, this would trigger export
    console.log('Exporting as:', exportFormat)
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>📊 Reports & Analytics</h1>
      </div>

      {/* Report Type Selection */}
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Select Report Type</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: 'var(--spacing-md)' 
        }}>
          {reportTypes.map((report) => (
            <div
              key={report.id}
              onClick={() => setSelectedReport(report.id)}
              className="card"
              style={{ 
                cursor: 'pointer',
                border: selectedReport === report.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                transition: 'all var(--transition-fast)'
              }}
            >
              <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <div style={{ 
                  fontSize: '2rem',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--color-gray-100)',
                  borderRadius: 'var(--radius)'
                }}>
                  {report.icon}
                </div>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{report.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>{report.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      {selectedReport && (
        <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div className="card-header">
            <h3 className="card-title">Report Options</h3>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap', alignItems: 'end' }}>
              <div className="form-group" style={{ marginBottom: 0, minWidth: '200px' }}>
                <label className="form-label">Region</label>
                <select 
                  className="form-select"
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                >
                  <option value="all">All Regions</option>
                  <option value="R01">Harare Region</option>
                  <option value="R02">Bulawayo Region</option>
                  <option value="R03">Mutare Region</option>
                  <option value="R04">Gweru Region</option>
                  <option value="R05">Masvingo Region</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0, minWidth: '200px' }}>
                <label className="form-label">Date Range</label>
                <select 
                  className="form-select"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option value="last6months">Last 6 Months</option>
                  <option value="lastyear">Last Year</option>
                  <option value="allyear">All Time</option>
                  <option value="custom">Custom Range</option>
                </select>
              </div>

              <button className="btn btn-primary" onClick={handleGenerateReport}>
                📊 Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Preview */}
      {selectedReport && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              {reportTypes.find(r => r.id === selectedReport)?.name}
            </h3>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              <select 
                className="form-select"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                style={{ width: 'auto' }}
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
              <button className="btn btn-accent" onClick={handleExport}>
                ⬇️ Export
              </button>
            </div>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {/* Report Table */}
            <table className="data-table">
              <thead>
                <tr>
                  {selectedReport === 'pastors' && (
                    <>
                      <th>Region</th>
                      <th>Active</th>
                      <th>Transferred</th>
                      <th>Retired</th>
                      <th>Total</th>
                    </>
                  )}
                  {selectedReport === 'zones' && (
                    <>
                      <th>Region</th>
                      <th>Total Zones</th>
                      <th>Active</th>
                      <th>Pending</th>
                    </>
                  )}
                  {selectedReport === 'transfers' && (
                    <>
                      <th>Month</th>
                      <th>Transfer Count</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {selectedReport === 'pastors' && mockReportData.pastors.map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.region}</strong></td>
                    <td><span className="status-badge active">{row.active}</span></td>
                    <td>{row.transferred}</td>
                    <td>{row.retired}</td>
                    <td><strong>{row.active + row.transferred + row.retired}</strong></td>
                  </tr>
                ))}
                {selectedReport === 'zones' && mockReportData.zones.map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.region}</strong></td>
                    <td>{row.zones}</td>
                    <td><span className="status-badge active">{row.activeZones}</span></td>
                    <td><span className="status-badge pending">{row.pendingZones}</span></td>
                  </tr>
                ))}
                {selectedReport === 'transfers' && mockReportData.transfers.map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.month}</strong></td>
                    <td>{row.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ marginTop: 'var(--spacing-xl)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Quick Statistics</h3>
        <div className="kpi-grid">
          <div className="kpi-card regions">
            <div className="kpi-icon">👤</div>
            <div className="kpi-content">
              <div className="kpi-label">Total Pastors</div>
              <div className="kpi-value">140</div>
            </div>
          </div>
          <div className="kpi-card zones">
            <div className="kpi-icon">⛪</div>
            <div className="kpi-content">
              <div className="kpi-label">Total Zones</div>
              <div className="kpi-value">124</div>
            </div>
          </div>
          <div className="kpi-card deacons">
            <div className="kpi-icon">🤝</div>
            <div className="kpi-content">
              <div className="kpi-label">Total Deacons</div>
              <div className="kpi-value">560</div>
            </div>
          </div>
          <div className="kpi-card transfers">
            <div className="kpi-icon">🔄</div>
            <div className="kpi-content">
              <div className="kpi-label">Transfers (6mo)</div>
              <div className="kpi-value">39</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
