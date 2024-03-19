import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey, 
  {
    auth: {
    autoRefreshToken: true,
    persistSession: false,
    detectSessionInUrl: false,
  },
})

export default supabase