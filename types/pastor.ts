export interface Pastor {
  id: string
  name: string
  email: string
  phone: string
  zone_id: string
  created_at: string
  updated_at: string
}

export interface PastorInput {
  name: string
  email: string
  phone: string
  zone_id: string
}

