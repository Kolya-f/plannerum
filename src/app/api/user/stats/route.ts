import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Необхідно увійти в систему' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId') || session.user.id

    // Отримати статистику користувача
    const [totalEvents, totalVotes, upcomingEvents] = await Promise.all([
      // Загальна кількість створених подій
      prisma.event.count({
        where: { userId: userId }
      }),
      
      // Загальна кількість голосів
      prisma.vote.count({
        where: { userId: userId }
      }),
      
      // Кількість майбутніх подій
      prisma.event.count({
        where: {
          userId: userId,
          dateOptions: {
            some: {
              date: {
                gt: new Date()
              }
            }
          }
        }
      })
    ])

    return NextResponse.json({
      totalEvents,
      totalVotes,
      upcomingEvents
    })

  } catch (error: any) {
    console.error('Get user stats error:', error)
    return NextResponse.json(
      { error: 'Помилка при отриманні статистики' },
      { status: 500 }
    )
  }
}
