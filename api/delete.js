// api/upload.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
const BUCKET = 'portfolio-images'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { fileName, base64Data } = req.body
    const buffer = Buffer.from(base64Data, 'base64')

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(fileName, buffer, { contentType: 'image/*', upsert: true })

    if (error) throw error

    const { data: urlData } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(fileName)
    return res.status(200).json({ publicUrl: urlData.publicUrl })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}