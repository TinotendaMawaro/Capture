export function generateId(prefix: string): string {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 9)
  return `${prefix}_${timestamp}_${randomPart}`
}

export function generateRegionId(): string {
  return generateId('REG')
}

export function generateZoneId(): string {
  return generateId('ZON')
}

export function generatePastorId(): string {
  return generateId('PAS')
}

export function generateDeaconId(): string {
  return generateId('DEA')
}

