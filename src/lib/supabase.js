import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

// Safe client for public database operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// Never crash the app if service role key is missing in frontend env.
// In production, admin writes should go through server-side APIs.
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase

// Storage bucket name
export const BUCKET = 'portfolio-images'

// Refactored Upload: Calls our secure Vercel backend function
export async function uploadImage(file, folder = 'general') {
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}.${ext}`

  // Convert file to base64 format string to send over HTTP
  const base64Data = await new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result.split(',')[1])
    reader.readAsDataURL(file)
  })

  const response = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileName, base64Data }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error || 'Upload failed')
  }

  const data = await response.json()
  return data.publicUrl
}

// Refactored Delete: Calls our secure Vercel backend function
export async function deleteImage(url) {
  if (!url) return
  const response = await fetch('/api/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })
  
  if (!response.ok) {
    const err = await response.json()
    console.error('Delete failed:', err.error)
  }
}