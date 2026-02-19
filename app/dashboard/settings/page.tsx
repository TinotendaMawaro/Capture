'use client'

import { useState } from 'react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    // ID Format
    regionCodeLength: '2',
    zoneCodeLength: '3',
    personCodeLength: '2',
    
    // Notifications
    emailNotifications: true,
    transferAlerts: true,
    newRegistrationAlerts: true,
    weeklyReports: true,
    
    // System
    mapApiKey: '••••••••••••••••',
    backupEnabled: true,
    autoBackupTime: '02:00',
  })

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings)
    alert('Settings saved successfully!')
  }

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'ids', label: 'ID Format', icon: '🪪' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'system', label: 'System', icon: '💻' },
    { id: 'backup', label: 'Backup & Logs', icon: '💾' },
  ]

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>⚙️ System Settings</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 'var(--spacing-lg)' }}>
        {/* Settings Navigation */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-body" style={{ padding: 'var(--spacing-sm)' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-md)',
                  border: 'none',
                  background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--color-gray-700)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.9rem',
                  marginBottom: '4px',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              {tabs.find(t => t.id === activeTab)?.label} Settings
            </h3>
          </div>
          <div className="card-body">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Organization Name</label>
                  <input
                    type="text"
                    className="form-input"
                    defaultValue="Heartfelt International Ministries"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">System Name</label>
                  <input
                    type="text"
                    className="form-input"
                    defaultValue="H.I.M National Registration System"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Default Region</label>
                  <select className="form-select">
                    <option>Harare Region</option>
                    <option>Bulawayo Region</option>
                    <option>Mutare Region</option>
                  </select>
                </div>
              </div>
            )}

            {/* ID Format Settings */}
            {activeTab === 'ids' && (
              <div>
                <div style={{ 
                  padding: 'var(--spacing-md)', 
                  background: 'rgba(214, 158, 46, 0.1)', 
                  borderRadius: 'var(--radius)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-gray-700)' }}>
                    <strong>📋 ID Format Guide:</strong> IDs are auto-generated in the format: R + Region Code + Zone Code + P/D + Sequential Number<br/>
                    Example: <strong>R01001P01</strong> = Region 01, Zone 001, Pastor 01
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Region Code Length</label>
                  <select 
                    className="form-select"
                    value={settings.regionCodeLength}
                    onChange={(e) => setSettings({ ...settings, regionCodeLength: e.target.value })}
                  >
                    <option value="1">1 digit (R1)</option>
                    <option value="2">2 digits (R01)</option>
                    <option value="3">3 digits (R001)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Zone Code Length</label>
                  <select 
                    className="form-select"
                    value={settings.zoneCodeLength}
                    onChange={(e) => setSettings({ ...settings, zoneCodeLength: e.target.value })}
                  >
                    <option value="2">2 digits (01)</option>
                    <option value="3">3 digits (001)</option>
                    <option value="4">4 digits (0001)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Person Code Length</label>
                  <select 
                    className="form-select"
                    value={settings.personCodeLength}
                    onChange={(e) => setSettings({ ...settings, personCodeLength: e.target.value })}
                  >
                    <option value="1">1 digit (1)</option>
                    <option value="2">2 digits (01)</option>
                    <option value="3">3 digits (001)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>Email Notifications</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Receive system notifications via email</div>
                    </div>
                  </label>
                </div>
                <hr style={{ margin: 'var(--spacing-lg) 0', border: 'none', borderTop: '1px solid var(--color-gray-200)' }} />
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={settings.transferAlerts}
                      onChange={(e) => setSettings({ ...settings, transferAlerts: e.target.checked })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>Transfer Alerts</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Get notified when transfers are initiated</div>
                    </div>
                  </label>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={settings.newRegistrationAlerts}
                      onChange={(e) => setSettings({ ...settings, newRegistrationAlerts: e.target.checked })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>New Registration Alerts</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Get notified when new pastors/deacons are registered</div>
                    </div>
                  </label>
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={settings.weeklyReports}
                      onChange={(e) => setSettings({ ...settings, weeklyReports: e.target.checked })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>Weekly Reports</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Receive weekly summary reports</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
              <div>
                <div className="form-group">
                  <label className="form-label">Map API Key</label>
                  <input
                    type="password"
                    className="form-input"
                    value={settings.mapApiKey}
                    onChange={(e) => setSettings({ ...settings, mapApiKey: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue="30"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Maximum Login Attempts</label>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue="5"
                  />
                </div>
              </div>
            )}

            {/* Backup Settings */}
            {activeTab === 'backup' && (
              <div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={settings.backupEnabled}
                      onChange={(e) => setSettings({ ...settings, backupEnabled: e.target.checked })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '500' }}>Enable Auto Backup</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Automatically backup database daily</div>
                    </div>
                  </label>
                </div>
                <div className="form-group">
                  <label className="form-label">Backup Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={settings.autoBackupTime}
                    onChange={(e) => setSettings({ ...settings, autoBackupTime: e.target.value })}
                  />
                </div>
                
                <div style={{ marginTop: 'var(--spacing-xl)' }}>
                  <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Manual Actions</h4>
                  <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                    <button className="btn btn-outline">
                      💾 Backup Now
                    </button>
                    <button className="btn btn-outline">
                      📥 Export Logs
                    </button>
                    <button className="btn btn-outline" style={{ color: 'var(--color-danger)' }}>
                      🗑️ Clear Cache
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div style={{ marginTop: 'var(--spacing-xl)', paddingTop: 'var(--spacing-lg)', borderTop: '1px solid var(--color-gray-200)', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn btn-primary" onClick={handleSave}>
                💾 Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
