import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Перевірка Neon (Prisma)
    let neonStatus = 'unknown'
    let neonEventCount = 0
    let neonUserCount = 0
    
    try {
      const events = await prisma.event.findMany({ take: 1 })
      const users = await prisma.user.findMany({ take: 1 })
      neonStatus = 'connected'
      neonEventCount = await prisma.event.count()
      neonUserCount = await prisma.user.count()
    } catch (neonError: any) {
      neonStatus = `error: ${neonError.message}`
    }
    
    // Перевірка Supabase
    let supabaseStatus = 'unknown'
    let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'not-set'
    
    if (supabaseUrl !== 'not-set') {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        // Простий тест запиту
        const { error } = await supabase.from('chat_messages').select('*', { count: 'exact', head: true })
        supabaseStatus = error ? `query error: ${error.message}` : 'connected'
      } catch (supabaseError: any) {
        supabaseStatus = `connection error: ${supabaseError.message}`
      }
    } else {
      supabaseStatus = 'env-not-set'
    }
    
    return NextResponse.json({
      status: 'ok',
      databases: {
        neon: {
          status: neonStatus,
          events: neonEventCount,
          users: neonUserCount,
          usedFor: 'Events, Votes, Users'
        },
        supabase: {
          status: supabaseStatus,
          usedFor: 'Chat only'
        }
      },
      env: {
        databaseUrlSet: !!process.env.DATABASE_URL,
        supabaseUrlSet: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKeySet: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message
    }, { status: 500 })
  }
}
