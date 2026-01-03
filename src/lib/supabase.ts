import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton клієнт для клієнтського боку
let supabaseClient: any = null

export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    // Серверний рендеринг - повертаємо null або створюємо новий
    return null
  }
  
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient(supabaseUrl, supabaseAnonKey)
  }
  
  return supabaseClient
}

// Для серверних компонентів
export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
