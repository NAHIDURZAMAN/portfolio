import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Storage bucket name
export const BUCKET = 'portfolio-images'

// Upload image to Supabase Storage
export async function uploadImage(file, folder = 'general') {
  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}.${ext}`
  const { data, error } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(fileName, file, { upsert: true })
  if (error) throw error
  const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName)
  return urlData.publicUrl
}

// Delete image from Supabase Storage
export async function deleteImage(url) {
  if (!url) return
  const path = url.split(`${BUCKET}/`)[1]
  if (!path) return
  await supabaseAdmin.storage.from(BUCKET).remove([path])
}
