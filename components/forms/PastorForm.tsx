'use client'

import { useState } from 'react'

interface PastorFormProps {
  onSubmit: (data: any) => void
}

export default function PastorForm({ onSubmit }: PastorFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [zoneId, setZoneId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, email, phone, zoneId })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="zoneId">Zone</label>
        <select
          id="zoneId"
          value={zoneId}
          onChange={(e) => setZoneId(e.target.value)}
          required
        >
          <option value="">Select Zone</option>
        </select>
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

