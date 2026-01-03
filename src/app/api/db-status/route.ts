export const dynamic = "force-dynamic"
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    // Простая проверка подключения к базе данных
    await prisma.$queryRaw`SELECT 1`
    
    const eventsCount = await prisma.event.count()
    const usersCount = await prisma.user.count()
    const messagesCount = await prisma.chatMessage.count()
    
    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      stats: {
        events: eventsCount,
        users: usersCount,
        messages: messagesCount
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
