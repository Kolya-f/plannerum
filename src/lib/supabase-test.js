import { createClient } from '@supabase/supabase-js'

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Key length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testConnection() {
  try {
    const { data, error } = await supabase.from('messages').select('*').limit(1)
    console.log('Connection test:', error ? 'FAILED' : 'SUCCESS', error)
  } catch (err) {
    console.error('Test error:', err)
  }
}

testConnection()
