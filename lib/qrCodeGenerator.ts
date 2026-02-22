/**
 * QR Code Generation Utilities
 * Generates QR codes for entities with ministry branding
 */

import QRCode from 'qrcode'
import { supabase } from './supabaseClient'

export interface QRCodeData {
  entityType: string
  entityId: string
  fullCode: string
  name: string
  zone: string
  region: string
  contact?: string
  timestamp: string
}

/**
 * Generate QR code as data URL
 * @param data - QR code data to encode
 * @param size - Size of the QR code (default: 300)
 */
export async function generateQRCodeDataURL(
  data: QRCodeData,
  size: number = 300
): Promise<string> {
  const qrData = JSON.stringify(data)

  try {
    const dataUrl = await QRCode.toDataURL(qrData, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })
    return dataUrl
  } catch (err) {
    console.error('Error generating QR code:', err)
    throw new Error('Failed to generate QR code')
  }
}

/**
 * Upload QR code to Supabase Storage
 * @param qrDataUrl - QR code data URL
 * @param entityType - Type of entity (pastor, deacon, member, etc)
 * @param fullCode - Full code of the entity
 */
export async function uploadQRCodeToStorage(
  qrDataUrl: string,
  entityType: string,
  fullCode: string
): Promise<string> {
  try {
    // Convert data URL to blob
    const response = await fetch(qrDataUrl)
    const blob = await response.blob()

    // Generate file name
    const filename = `${entityType}/${fullCode}.png`
    const { error } = await supabase.storage
      .from('qr_codes')
      .upload(filename, blob, {
        upsert: true,
        contentType: 'image/png'
      })

    if (error) throw error

    // Get public URL
    const { data: publicData } = supabase.storage
      .from('qr_codes')
      .getPublicUrl(filename)

    return publicData?.publicUrl || ''
  } catch (err) {
    console.error('Error uploading QR code:', err)
    throw new Error('Failed to upload QR code')
  }
}

/**
 * Generate and store QR code for an entity
 */
export async function generateAndStoreQRCode(
  qrData: QRCodeData
): Promise<string> {
  try {
    // Generate QR code
    const qrDataUrl = await generateQRCodeDataURL(qrData)

    // Upload to storage
    const publicUrl = await uploadQRCodeToStorage(
      qrDataUrl,
      qrData.entityType,
      qrData.fullCode
    )

    // Store metadata in database
    const { error } = await supabase
      .from('qr_codes')
      .upsert(
        {
          entity_type: qrData.entityType,
          entity_id: qrData.entityId,
          full_code: qrData.fullCode,
          qr_code_url: publicUrl,
          qr_data: qrData
        },
        { onConflict: 'entity_type,entity_id' }
      )

    if (error) throw error

    return publicUrl
  } catch (err) {
    console.error('Error generating and storing QR code:', err)
    throw new Error('Failed to generate and store QR code')
  }
}

/**
 * Get QR code URL for an entity
 */
export async function getQRCodeForEntity(
  entityType: string,
  entityId: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('qr_codes')
      .select('qr_code_url')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data?.qr_code_url || null
  } catch (err) {
    console.error('Error getting QR code:', err)
    return null
  }
}

/**
 * Generate profile URL from QR code data
 */
export function generateProfileUrl(fullCode: string, entityType: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/profile/${entityType}/${fullCode}`
}

/**
 * Create QR code data object for an entity
 */
export function createQRCodeData(
  entityType: string,
  entityId: string,
  fullCode: string,
  name: string,
  zone: string,
  region: string,
  contact?: string
): QRCodeData {
  return {
    entityType,
    entityId,
    fullCode,
    name,
    zone,
    region,
    contact,
    timestamp: new Date().toISOString()
  }
}
