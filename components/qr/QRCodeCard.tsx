'use client'

/**
 * QR Code Card Component
 * Displays QR code with ministry branding and download options
 */

import React, { useState } from 'react'
import Image from 'next/image'

interface QRCodeCardProps {
  fullCode: string
  name: string
  zone: string
  region: string
  contact?: string
  qrCodeUrl: string
  entityType: string
  onDownloadClick?: () => void
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({
  fullCode,
  name,
  zone,
  region,
  contact,
  qrCodeUrl,
  entityType,
  onDownloadClick
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownloadPNG = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fullCode}_qr.png`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      onDownloadClick?.()
    } catch (err) {
      setError('Failed to download QR code')
      console.error('Error downloading QR code:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600')
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print QR Card - ${fullCode}</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: Arial, sans-serif;
                background: white;
              }
              .card {
                width: 400px;
                padding: 30px;
                border: 2px solid #1e40af;
                border-radius: 8px;
                text-align: center;
                background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .ministry-header {
                color: #1e40af;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 20px;
              }
              .info-section {
                margin: 15px 0;
                text-align: left;
              }
              .info-label {
                font-weight: bold;
                color: #374151;
                font-size: 12px;
                margin-bottom: 4px;
              }
              .info-value {
                color: #1f2937;
                font-size: 14px;
              }
              .qr-container {
                margin: 20px 0;
                padding: 15px;
                background: white;
                border-radius: 4px;
              }
              .qr-container img {
                width: 200px;
                height: 200px;
              }
              .full-code {
                font-size: 18px;
                font-weight: bold;
                color: #1e40af;
                margin-top: 10px;
                letter-spacing: 2px;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="ministry-header">
                🙏 HEARTFELT INTERNATIONAL MINISTRIES 🙏
              </div>
              <div class="info-section">
                <div class="info-label">NAME</div>
                <div class="info-value">${name}</div>
              </div>
              <div class="info-section">
                <div class="info-label">POSITION</div>
                <div class="info-value">${entityType.toUpperCase()}</div>
              </div>
              <div class="info-section">
                <div class="info-label">ZONE</div>
                <div class="info-value">${zone}</div>
              </div>
              <div class="info-section">
                <div class="info-label">REGION</div>
                <div class="info-value">${region}</div>
              </div>
              ${contact ? `
              <div class="info-section">
                <div class="info-label">CONTACT</div>
                <div class="info-value">${contact}</div>
              </div>
              ` : ''}
              <div class="qr-container">
                <img src="${qrCodeUrl}" alt="QR Code" />
                <div class="full-code">${fullCode}</div>
              </div>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-gray-100 to-white rounded-lg border-2 border-blue-700 shadow-lg">
      {/* Ministry Header */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-blue-700">
          🙏 HEARTFELT INTERNATIONAL MINISTRIES 🙏
        </h2>
      </div>

      {/* Information Section */}
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-xs font-bold text-gray-600 mb-1">NAME</p>
          <p className="text-sm text-gray-900">{name}</p>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-600 mb-1">POSITION</p>
          <p className="text-sm text-gray-900 uppercase">{entityType}</p>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-600 mb-1">ZONE</p>
          <p className="text-sm text-gray-900">{zone}</p>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-600 mb-1">REGION</p>
          <p className="text-sm text-gray-900">{region}</p>
        </div>

        {contact && (
          <div>
            <p className="text-xs font-bold text-gray-600 mb-1">CONTACT</p>
            <p className="text-sm text-gray-900">{contact}</p>
          </div>
        )}
      </div>

      {/* QR Code Section */}
      <div className="flex flex-col items-center p-4 bg-white rounded-lg mb-6 border border-gray-200">
        {qrCodeUrl ? (
          <>
            <div className="w-48 h-48 mb-3 relative">
              <Image
                src={qrCodeUrl}
                alt={`QR Code for ${fullCode}`}
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p className="text-lg font-bold text-blue-700 tracking-wider">
              {fullCode}
            </p>
          </>
        ) : (
          <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded">
            <span className="text-gray-400">No QR Code</span>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDownloadPNG}
          disabled={isLoading || !qrCodeUrl}
          className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? 'Downloading...' : '📥 Download PNG'}
        </button>

        <button
          onClick={handlePrint}
          disabled={!qrCodeUrl}
          className="flex-1 py-2 px-4 bg-green-600 text-white text-sm font-semibold rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          🖨️ Print
        </button>
      </div>
    </div>
  )
}

export default QRCodeCard
