'use client'

import { useState } from 'react'

interface ZoneFormProps {
  onSubmit: (data: any) => void
}

export default function ZoneForm({ onSubmit }: ZoneFormProps) {
  const [name, setName] = useState('')
  const [regionId, setRegionId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, regionId })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Zone Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="regionId">Region</label>
        <select
          id="regionId"
          value={regionId}
          onChange={(e) => setRegionId(e.target.value)}
          required
        >
          <option value="">Select Region</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

