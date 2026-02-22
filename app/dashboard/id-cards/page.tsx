'use client'

/**
 * ID Card Management Page
 * Generate, view, and export QR code ID cards for pastors, deacons, and department heads
 * Supports PDF and PNG export formats
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

interface Person {
  id: string
  full_code: string
  name: string
  zone_id: string
  contact?: string
  email?: string
  is_active: boolean
  qr_code_url?: string
  zones?: { name: string; full_code: string; regions?: { name: string } }
}

interface Department {
  id: string
  full_code: string
  name: string
  description?: string
  zone_id: string
  hod_id?: string
  zones?: { name: string; full_code: string; regions?: { name: string } }
}

type CardType = 'pastor' | 'deacon' | 'department' | 'member'

export default function IDCardsPage() {
  const [pastors, setPastors] = useState<Person[]>([])
  const [deacons, setDeacons] = useState<Person[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [members, setMembers] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCard, setSelectedCard] = useState<{id: string; full_code: string; name: string; cardType: CardType; qr_code_url?: string; zones?: Person['zones']; contact?: string; email?: string} | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<CardType | 'all'>('all')
  const [generatingQR, setGeneratingQR] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [pastorsRes, deaconsRes, deptsRes, membersRes] = await Promise.all([
        fetch('/api/pastors'),
        fetch('/api/deacons'),
        fetch('/api/departments'),
        fetch('/api/members')
      ])

      const [pastorsData, deaconsData, deptsData, membersData] = await Promise.all([
        pastorsRes.json(),
        deaconsRes.json(),
        deptsRes.json(),
        membersRes.json()
      ])

      setPastors(pastorsData.data || [])
      setDeacons(deaconsData.data || [])
      setDepartments(deptsData.data || [])
      setMembers(membersData.data || [])
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const getAllCards = (): Array<{id: string; full_code: string; name: string; cardType: CardType; qr_code_url?: string; zones?: Person['zones']; contact?: string; email?: string}> => {
    const pastorCards = pastors.map(p => ({ ...p, cardType: 'pastor' as CardType }))
    const deaconCards = deacons.map(d => ({ ...d, cardType: 'deacon' as CardType }))
    const deptCards = departments.filter(d => d.hod_id).map(d => ({ 
      ...d, 
      name: `${d.name} - HOD`, 
      cardType: 'department' as CardType 
    }))
    const memberCards = members.map(m => ({ ...m, cardType: 'member' as CardType }))
    return [...pastorCards, ...deaconCards, ...deptCards, ...memberCards]
  }

  const filteredCards = getAllCards().filter(card => {
    const matchesSearch = 
      card.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.full_code?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === 'all' || card.cardType === typeFilter
    return matchesSearch && matchesType
  })

  const generateProfileUrl = (fullCode: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://ministry.org'
    return `${baseUrl}/verify/${fullCode}`
  }

  const getCardTitle = (type: CardType): string => {
    switch (type) {
      case 'pastor': return 'PASTOR'
      case 'deacon': return 'DEACON'
      case 'department': return 'DEPARTMENT HEAD'
      case 'member': return 'MEMBER'
      default: return 'MEMBER'
    }
  }

  const getEntityTypeLabel = (type: CardType): string => {
    switch (type) {
      case 'pastor': return 'Pastor'
      case 'deacon': return 'Deacon'
      case 'department': return 'HOD'
      case 'member': return 'Member'
      default: return 'Member'
    }
  }

  // Generate QR code as data URL
  const generateQRCode = async (fullCode: string): Promise<string> => {
    try {
      const url = generateProfileUrl(fullCode)
      return await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#1e3a8a',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      })
    } catch (err) {
      console.error('Error generating QR:', err)
      return ''
    }
  }

  // Download as PNG
  const handleDownloadPNG = async () => {
    if (!cardRef.current) return
    
    try {
      setGeneratingQR(true)
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      })
      
      const link = document.createElement('a')
      link.download = `${selectedCard?.full_code}_id_card.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Error downloading PNG:', err)
      alert('Failed to download PNG')
    } finally {
      setGeneratingQR(false)
    }
  }

  // Download as PDF
  const handleDownloadPDF = async () => {
    if (!cardRef.current) return
    
    try {
      setGeneratingQR(true)
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [85.6, 53.98] // ID card size
      })
      
      pdf.addImage(imgData, 'PNG', 0, 0, 85.6, 53.98)
      pdf.save(`${selectedCard?.full_code}_id_card.pdf`)
    } catch (err) {
      console.error('Error downloading PDF:', err)
      alert('Failed to download PDF')
    } finally {
      setGeneratingQR(false)
    }
  }

  // Print card
  const handlePrint = () => {
    if (!cardRef.current) return
    
    const printContent = cardRef.current.innerHTML
    const printWindow = window.open('', '', 'width=800,height=600')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print ID Card - ${selectedCard?.full_code}</title>
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                .id-card { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // ID Card Component
  const IDCard = ({ data, isPreview = false }: { data: {full_code?: string; name?: string; cardType?: CardType; zones?: Person['zones']; contact?: string; qr_code_url?: string}; isPreview?: boolean }) => {
    const [qrUrl, setQrUrl] = useState(data.qr_code_url || '')
    
    useEffect(() => {
      if (!qrUrl && data.full_code) {
        generateQRCode(data.full_code).then(setQrUrl)
      }
    }, [data.full_code, qrUrl])

    const entityType = data.cardType || 'member'
    const zoneName = data.zones?.name || 'N/A'
    const regionName = data.zones?.regions?.name || 'N/A'

    return (
      <div 
        ref={isPreview ? cardRef : undefined}
        className="id-card"
        style={{
          width: '320px',
          height: '200px',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #3b82f6 100%)',
          borderRadius: '12px',
          padding: '16px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          fontFamily: 'Arial, sans-serif'
        }}
      >
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          pointerEvents: 'none'
        }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', opacity: 0.8, letterSpacing: '1px' }}>MINISTRY ID</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '1px' }}>H.I.M</div>
          </div>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px'
          }}>
            ✝
          </div>
        </div>

        {/* Photo placeholder & Info */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '60px',
            height: '70px',
            background: 'rgba(255,255,255,0.9)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e3a8a',
            fontSize: '24px'
          }}>
            {data.name?.charAt(0) || '?'}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '4px', lineHeight: 1.2 }}>
              {data.name}
            </div>
            <div style={{ fontSize: '10px', opacity: 0.9, marginBottom: '2px' }}>
              {getCardTitle(entityType)}
            </div>
            <div style={{ 
              fontSize: '12px', 
              fontWeight: 'bold', 
              background: 'rgba(255,255,255,0.2)',
              padding: '2px 6px',
              borderRadius: '4px',
              display: 'inline-block'
            }}>
              {data.full_code}
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div style={{ 
          position: 'absolute', 
          right: '12px', 
          bottom: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {qrUrl ? (
            <div style={{ width: '60px', height: '60px', borderRadius: '4px', background: 'white' }}>
              <Image 
                src={qrUrl} 
                alt="QR Code" 
                width={60}
                height={60}
                style={{ borderRadius: '4px', width: 'auto', height: 'auto' }}
              />
            </div>
          ) : (
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: 'white', 
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8px',
              color: '#666'
            }}>
              Loading...
            </div>
          )}
        </div>

        {/* Footer info */}
        <div style={{ 
          position: 'absolute', 
          left: '16px', 
          bottom: '12px',
          fontSize: '8px',
          opacity: 0.8
        }}>
          <div>Zone: {zoneName}</div>
          <div>Region: {regionName}</div>
          {data.contact && <div>Contact: {data.contact}</div>}
        </div>

        {/* Ministry tagline */}
        <div style={{
          position: 'absolute',
          bottom: '4px',
          right: '80px',
          fontSize: '6px',
          opacity: 0.6,
          fontStyle: 'italic'
        }}>
          Heartfelt International Ministries
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading ID cards...</div>
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>🪪 ID Card Management</h1>
        <div className="page-header-actions">
          <button 
            className="btn btn-outline"
            onClick={() => {
              // Bulk export all as PDF
              alert('Bulk export feature coming soon!')
            }}
          >
            🖨️ Bulk Print
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
          onChange={(e) => setTypeFilter(e.target.value as CardType | 'all')}
        >
          <option value="all">All Types</option>
          <option value="pastor">Pastors</option>
          <option value="deacon">Deacons</option>
          <option value="department">Department HODs</option>
          <option value="member">Members</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--spacing-lg)' }}>
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
                  <th>QR</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCards.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No cards found
                    </td>
                  </tr>
                ) : (
                  filteredCards.map((card) => (
                    <tr 
                      key={card.id}
                      onClick={() => setSelectedCard(card)}
                      style={{ 
                        cursor: 'pointer', 
                        background: selectedCard?.id === card.id ? 'var(--color-gray-50)' : 'transparent' 
                      }}
                    >
                      <td><strong>{card.full_code}</strong></td>
                      <td>{card.name}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs ${
                          card.cardType === 'pastor' ? 'bg-purple-100 text-purple-700' :
                          card.cardType === 'deacon' ? 'bg-orange-100 text-orange-700' :
                          card.cardType === 'department' ? 'bg-pink-100 text-pink-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {getEntityTypeLabel(card.cardType)}
                        </span>
                      </td>
                      <td>{card.zones?.name || 'N/A'}</td>
                      <td>
                        {card.qr_code_url ? '✅' : '❌'}
                      </td>
                      <td className="actions">
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCard(card)
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
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
              <div className="flex flex-col items-center">
                {/* ID Card */}
                <IDCard data={selectedCard} isPreview={true} />

                {/* Profile URL */}
                <div className="mt-4 p-3 bg-gray-100 rounded text-center w-full">
                  <p className="text-xs text-gray-600 mb-1">Profile URL</p>
                  <p className="text-xs font-mono text-blue-600 break-all">
                    {generateProfileUrl(selectedCard.full_code)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 w-full space-y-2">
                  <button
                    onClick={handleDownloadPNG}
                    disabled={generatingQR}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    📥 Download PNG
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    disabled={generatingQR}
                    className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    📄 Download PDF
                  </button>
                  <button
                    onClick={handlePrint}
                    className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 flex items-center justify-center gap-2"
                  >
                    🖨️ Print Card
                  </button>
                </div>

                {/* Card Details */}
                <div className="mt-4 w-full text-sm">
                  <h4 className="font-semibold mb-2">Card Details</h4>
                  <div className="space-y-1 text-gray-600">
                    <p><strong>Full Code:</strong> {selectedCard.full_code}</p>
                    <p><strong>Name:</strong> {selectedCard.name}</p>
                    <p><strong>Type:</strong> {getEntityTypeLabel(selectedCard.cardType)}</p>
                    <p><strong>Zone:</strong> {selectedCard.zones?.name || 'N/A'}</p>
                    <p><strong>Region:</strong> {selectedCard.zones?.regions?.name || 'N/A'}</p>
                    {selectedCard.contact && <p><strong>Contact:</strong> {selectedCard.contact}</p>}
                    {selectedCard.email && <p><strong>Email:</strong> {selectedCard.email}</p>}
                  </div>
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
