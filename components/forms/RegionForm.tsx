'use client'

import { useState } from 'react'

interface RegionFormProps {
  onSubmit: (data: any) => void
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

