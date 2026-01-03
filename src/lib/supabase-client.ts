// Singleton Supabase клієнт для уникнення декількох екземплярів

let supabaseInstance: any = null

export const getSupabase = () => {
  if (typeof window === 'undefined') {
    // На сервері повертаємо null або створюємо новий
    return null
  }
  
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    // Динамічний імпорт тільки на клієнті
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
    }).catch(console.error)
  }
  
  return supabaseInstance
}
