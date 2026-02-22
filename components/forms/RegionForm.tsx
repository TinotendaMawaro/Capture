'use client'

import { useState } from 'react'

// Define proper interface for form data
interface RegionFormData {
  name: string
}

interface RegionFormProps {
  onSubmit: (data: RegionFormData) => void
}

export default function RegionForm({ onSubmit }: RegionFormProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Region Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}
