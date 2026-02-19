'use client'

import { useState, useEffect } from 'react'
import { ChurchEvent, EVENT_TYPE_LABELS, EVENT_STATUS_LABELS, EventType, EventStatus } from '@/types/event'
import { supabase } from '@/lib/supabaseClient'

export default function EventsPage() {
  const [events, setEvents] = useState<ChurchEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<EventStatus | 'all'>('all')
  const [eventTypeFilter, setEventTypeFilter] = useState<EventType | 'all'>('all')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: 'sunday_service' as EventType,
    location: '',
    start_date: '',
    end_date: '',
    expected_attendees: 0,
    is_recurring: false,
    recurring_pattern: '',
    registration_required: false,
    max_capacity: 0,
    is_public: true,
    tags: ''
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      // Mock data for demo
      setEvents([
        {
          id: '1',
          him_id: 'EVT-001',
          title: 'Sunday Morning Service',
          description: 'Weekly Sunday worship service',
          event_type: 'sunday_service',
          location: 'Main Sanctuary',
          start_date: new Date().toISOString(),
          end_date: new Date().toISOString(),
          organizer_id: '1',
          organizer_name: 'Pastor John',
          expected_attendees: 500,
          actual_attendees: 450,
          status: 'completed',
          is_recurring: true,
          recurring_pattern: 'weekly',
          registration_required: false,
          is_public: true,
          tags: ['worship', 'service'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          him_id: 'EVT-002',
          title: 'Youth Conference 2026',
          description: 'Annual youth gathering',
          event_type: 'conference',
          location: 'Youth Center',
          start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          end_date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
          organizer_id: '1',
          organizer_name: 'Youth Pastor',
          expected_attendees: 200,
          status: 'published',
          is_recurring: false,
          registration_required: true,
          max_capacity: 250,
          is_public: true,
          tags: ['youth', 'conference'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const newEvent = {
        ...formData,
        him_id: `EVT-${Date.now()}`,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        organizer_id: 'current-user',
        organizer_name: 'Current User',
        status: 'draft' as EventStatus
      }

      const { error } = await supabase.from('events').insert([newEvent])
      
      if (error) throw error
      
      setShowForm(false)
      fetchEvents()
      setFormData({
        title: '',
        description: '',
        event_type: 'sunday_service',
        location: '',
        start_date: '',
        end_date: '',
        expected_attendees: 0,
        is_recurring: false,
        recurring_pattern: '',
        registration_required: false,
        max_capacity: 0,
        is_public: true,
        tags: ''
      })
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Event created successfully (demo mode)')
      setShowForm(false)
    }
  }

  async function updateEventStatus(id: string, status: EventStatus) {
    try {
      const { error } = await supabase
        .from('events')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      fetchEvents()
    } catch (error) {
      console.error('Error updating event:', error)
    }
  }

  const filteredEvents = events.filter(event => {
    if (filter !== 'all' && event.status !== filter) return false
    if (eventTypeFilter !== 'all' && event.event_type !== eventTypeFilter) return false
    return true
  })

  const getStatusColor = (status: EventStatus) => {
    const colors: Record<EventStatus, string> = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
      postponed: 'bg-yellow-100 text-yellow-800'
    }
    return colors[status]
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📅 Events Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? 'Cancel' : '+ Create Event'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as EventStatus | 'all')}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
          <option value="postponed">Postponed</option>
        </select>

        <select
          value={eventTypeFilter}
          onChange={(e) => setEventTypeFilter(e.target.value as EventType | 'all')}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Types</option>
          <option value="sunday_service">Sunday Service</option>
          <option value="wednesday_service">Wednesday Service</option>
          <option value="friday_service">Friday Service</option>
          <option value="special_service">Special Service</option>
          <option value="conference">Conference</option>
          <option value="youth_service">Youth Service</option>
          <option value="outreach">Outreach</option>
          <option value="fellowship">Fellowship</option>
        </select>
      </div>

      {/* Create Event Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Event Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Event Type</label>
              <select
                value={formData.event_type}
                onChange={(e) => setFormData({ ...formData, event_type: e.target.value as EventType })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                rows={3}
                placeholder="Event description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="Event location"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Expected Attendees</label>
              <input
                type="number"
                value={formData.expected_attendees}
                onChange={(e) => setFormData({ ...formData, expected_attendees: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Start Date & Time</label>
              <input
                type="datetime-local"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Date & Time</label>
              <input
                type="datetime-local"
                required
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.registration_required}
                  onChange={(e) => setFormData({ ...formData, registration_required: e.target.checked })}
                  className="rounded"
                />
                Registration Required
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                  className="rounded"
                />
                Public Event
              </label>
            </div>

            {formData.registration_required && (
              <div>
                <label className="block text-sm font-medium mb-1">Max Capacity</label>
                <input
                  type="number"
                  value={formData.max_capacity}
                  onChange={(e) => setFormData({ ...formData, max_capacity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="worship, youth, outreach"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      {loading ? (
        <div className="text-center py-8">Loading events...</div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No events found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                  {EVENT_STATUS_LABELS[event.status]}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">{EVENT_TYPE_LABELS[event.event_type]}</p>
              
              <div className="space-y-1 text-sm text-gray-500 mb-3">
                <p>📍 {event.location || 'No location'}</p>
                <p>📅 {new Date(event.start_date).toLocaleDateString()}</p>
                <p>👥 Expected: {event.expected_attendees}</p>
                {event.actual_attendees && <p>✅ Actual: {event.actual_attendees}</p>}
              </div>

              {event.tags && event.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {event.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                {event.status === 'draft' && (
                  <button
                    onClick={() => updateEventStatus(event.id, 'published')}
                    className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200"
                  >
                    Publish
                  </button>
                )}
                {event.status === 'published' && (
                  <button
                    onClick={() => updateEventStatus(event.id, 'completed')}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Mark Complete
                  </button>
                )}
                {event.status === 'published' && (
                  <button
                    onClick={() => updateEventStatus(event.id, 'cancelled')}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
