import { supabase } from './supabaseClient'

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export async function resetPassword(email: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email)
  return { data, error }
}

/**
 * Send OTP (One-Time Password) to user's email
 * @param email - The email address to send the OTP to
 * @returns The response from Supabase
 */
export async function sendOTP(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // You can customize the email template in Supabase dashboard
      // This option can be used to redirect after clicking the email link
      // emailRedirectTo: `${window.location.origin}/dashboard`,
    }
  })
  return { data, error }
}

/**
 * Verify OTP (One-Time Password) 
 * Note: Supabase OTP works via email magic link, not a numeric code
 * For numeric OTP verification, you would need to implement custom logic
 * This function is a placeholder for future custom OTP implementation
 * @param email - The email address
 * @param token - The OTP token (if using custom verification)
 * @returns The response from Supabase
 */
export async function verifyOTP(email: string, token: string) {
  // Supabase's signInWithOtp sends a magic link via email
  // For numeric OTP verification, you would typically:
  // 1. Store the OTP in your database with expiration
  // 2. Verify the token matches
  // 3. Then use signInWithOtp or create a session manually
  
  // For now, we'll use the magic link flow which is the built-in Supabase OTP
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email' // or 'recovery' for password reset
  })
  return { data, error }
}

