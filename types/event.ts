/**
 * Event Types for Church Management System
 */

export interface ChurchEvent {
  id: string
  him_id: string
  title: string
  description: string
  event_type: EventType
  location: string
  start_date: string
  end_date: string
  zone_id?: string
  region_id?: string
  country_id?: string
  organizer_id: string
  organizer_name: string
  expected_attendees: number
  actual_attendees?: number
  status: EventStatus
  is_recurring: boolean
  recurring_pattern?: string
  registration_required: boolean
  max_capacity?: number
  is_public: boolean
  tags: string[]
  created_at: string
  updated_at: string
}

export type EventType = 
  | 'sunday_service'
  | 'wednesday_service'
  | 'friday_service'
  | 'special_service'
  | 'conference'
  | 'seminar'
  | 'workshop'
  | 'youth_service'
  | 'children_service'
  | 'womens_ministry'
  | 'mens_ministry'
  | 'outreach'
  | 'fellowship'
  | 'celebration'
  | 'training'
  | 'other'

export type EventStatus = 
  | 'draft'
  | 'published'
  | 'cancelled'
  | 'completed'
  | 'postponed'

export interface EventRegistration {
  id: string
  event_id: string
  person_id: string
  person_him_id: string
  person_name: string
  person_email?: string
  person_phone?: string
  registered_at: string
  attended: boolean
  checked_in_at?: string
  notes?: string
}

export interface EventFormData {
  title: string
  description: string
  event_type: EventType
  location: string
  start_date: string
  end_date: string
  zone_id?: string
  region_id?: string
  expected_attendees: number
  is_recurring: boolean
  recurring_pattern?: string
  registration_required: boolean
  max_capacity?: number
  is_public: boolean
  tags: string[]
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  sunday_service: 'Sunday Service',
  wednesday_service: 'Wednesday Service',
  friday_service: 'Friday Service',
  special_service: 'Special Service',
  conference: 'Conference',
  seminar: 'Seminar',
  workshop: 'Workshop',
  youth_service: 'Youth Service',
  children_service: 'Children Service',
  womens_ministry: "Women's Ministry",
  mens_ministry: "Men's Ministry",
  outreach: 'Outreach',
  fellowship: 'Fellowship',
  celebration: 'Celebration',
  training: 'Training',
  other: 'Other'
}

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  draft: 'Draft',
  published: 'Published',
  cancelled: 'Cancelled',
  completed: 'Completed',
  postponed: 'Postponed'
}
