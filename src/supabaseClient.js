import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    // Warn but don't crash immediately to allow UI testing without backend
    console.warn('Supabase URL or Key is missing. Check .env file.')
}

export const isMockMode = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('placeholder');

export const supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key'
)
