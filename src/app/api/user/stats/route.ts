import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// Отключаем статическую генерацию для этого маршрута
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || 'demo-user'

    const eventsCount = await prisma.event.count({
      where: { userId }
    })

    const votesCount = await prisma.vote.count({
      where: { userId }
    })

    const messagesCount = await prisma.chatMessage.count({
      where: { userId }
    })

    return NextResponse.json({
      events: eventsCount,
      votes: votesCount,
      messages: messagesCount
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user stats' },
      { status: 500 }
    )
  }
}
