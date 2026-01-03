export const dynamic = "force-dynamic"
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function GET() {
  try {
    // Пользователи онлайн за последние 5 минут
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    
    const onlineUsers = await prisma.onlineUser.findMany({
      where: {
        lastSeen: {
          gte: fiveMinutesAgo
        }
      },
      orderBy: {
        lastSeen: 'desc'
      },
      include: {
        user: true
      }
    })
    
    return NextResponse.json(onlineUsers)
  } catch (error) {
    console.error('Error fetching online users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch online users' },
      { status: 500 }
    )
  }
}
