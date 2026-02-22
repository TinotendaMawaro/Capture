'use client'

/**
 * Login Page
 * Authenticates users against Supabase
 * Redirects to dashboard on successful login
 * Glassmorphism UI Design
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (!email || !password) {
        throw new Error('Please enter email and password')
      }

      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) {
        throw new Error(signInError.message || 'Login failed')
      }

      if (!data.session) {
        throw new Error('No session created')
      }

      // Login successful, redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute w-96 h-96 rounded-full opacity-30"
          style={{
            background: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
            top: '-10%',
            left: '-5%',
            animation: 'orb 15s ease-in-out infinite',
          }}
        />
        <div 
          className="absolute w-80 h-80 rounded-full opacity-20"
          style={{
            background: 'linear-gradient(135deg, #d69e2e 0%, #ecc94b 100%)',
            bottom: '-10%',
            right: '-5%',
            animation: 'orb 18s ease-in-out infinite reverse',
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full opacity-15"
          style={{
            background: 'linear-gradient(135deg, #38a169 0%, #68d391 100%)',
            top: '40%',
            right: '20%',
            animation: 'orb 12s ease-in-out infinite',
          }}
        />
      </div>

      {/* Glass Card */}
      <div 
        className="relative z-10 w-full max-w-md"
        style={{
          animation: 'scaleIn 0.5s ease-out',
        }}
      >
        <div 
          className="glass-solid p-8"
          style={{
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
              style={{
                background: 'linear-gradient(135deg, #d69e2e 0%, #ecc94b 100%)',
                boxShadow: '0 8px 24px rgba(214, 158, 46, 0.4)',
                animation: 'float 3s ease-in-out infinite',
              }}
            >
              <span className="text-4xl">🙏</span>
            </div>
            <h1 
              className="text-3xl font-bold"
              style={{ color: '#1a365d' }}
            >
              Heartfelt Ministry
            </h1>
            <p 
              className="mt-2"
              style={{ color: '#718096' }}
            >
              Registration & Management System
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div 
              className="mb-6 p-4 rounded-lg"
              style={{
                background: 'rgba(229, 62, 62, 0.1)',
                border: '1px solid rgba(229, 62, 62, 0.2)',
                animation: 'shake 0.5s ease-in-out',
              }}
            >
              <p 
                className="text-sm font-semibold"
                style={{ color: '#e53e3e' }}
              >
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-semibold mb-2"
                style={{ color: '#2d3748' }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@heartfelt.zw"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#d69e2e'
                  e.target.style.boxShadow = '0 0 0 3px rgba(214, 158, 46, 0.2)'
                  e.target.style.background = '#ffffff'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.boxShadow = 'none'
                  e.target.style.background = 'rgba(255, 255, 255, 0.7)'
                }}
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold mb-2"
                style={{ color: '#2d3748' }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                disabled={loading}
                className="w-full px-4 py-3 rounded-xl transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#d69e2e'
                  e.target.style.boxShadow = '0 0 0 3px rgba(214, 158, 46, 0.2)'
                  e.target.style.background = '#ffffff'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0'
                  e.target.style.boxShadow = 'none'
                  e.target.style.background = 'rgba(255, 255, 255, 0.7)'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold py-3 px-4 rounded-xl transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #d69e2e 0%, #ecc94b 100%)',
                color: '#1a202c',
                boxShadow: '0 4px 15px rgba(214, 158, 46, 0.3)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(214, 158, 46, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(214, 158, 46, 0.3)'
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg 
                    className="animate-spin h-5 w-5" 
                    viewBox="0 0 24 24"
                    style={{ fill: 'none' }}
                  >
                    <circle 
                      className="opacity-25" 
                      cx="12" cy="12" r="10" 
                      stroke="currentColor" 
                      strokeWidth="4"
                    />
                    <path 
                      className="opacity-75" 
                      fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Logging in...
                </span>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>

          {/* Help Text */}
          <div 
            className="mt-6 p-4 rounded-lg"
            style={{
              background: 'rgba(49, 130, 206, 0.1)',
              border: '1px solid rgba(49, 130, 206, 0.2)',
            }}
          >
            <p 
              className="font-semibold mb-2 text-sm"
              style={{ color: '#2c5282' }}
            >
              🔐 Login Instructions:
            </p>
            <ol 
              className="list-decimal list-inside space-y-1 text-xs"
              style={{ color: '#4a5568' }}
            >
              <li>Make sure you created a user in Supabase Dashboard</li>
              <li>Go to Authentication - Users - Add user</li>
              <li>Enter email and password to create the user</li>
              <li>Use those credentials to login here</li>
            </ol>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="text-center mt-8">
          <p 
            className="text-sm"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            © 2026 Heartfelt International Ministries
          </p>
          <p 
            className="text-xs mt-1"
            style={{ color: 'rgba(255, 255, 255, 0.4)' }}
          >
            All rights reserved
          </p>
        </div>
      </div>
    </div>
  )
}
