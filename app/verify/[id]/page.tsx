'use client'

import { useParams } from 'next/navigation'

export default function VerifyPage() {
  const params = useParams()
  const id = params.id

  return (
    <div>
      <h1>Verify</h1>
      <p>Verification ID: {id}</p>
    </div>
  )
}

