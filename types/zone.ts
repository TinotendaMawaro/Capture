export interface Zone {
  id: string
  name: string
  region_id: string
  created_at: string
  updated_at: string
}

export interface ZoneInput {
  name: string
  region_id: string
}

