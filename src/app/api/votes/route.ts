import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// Отримати голоси для події
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    
    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Отримуємо голоси для події
    const votes = await prisma.vote.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        dateOption: {
          select: {
            id: true,
            date: true
          }
        }
      }
    })

    // Рахуємо статистику
    const voteStats = {
      total: votes.length,
      byOption: votes.reduce((acc, vote) => {
        acc[vote.voteType] = (acc[vote.voteType] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      byDateOption: votes.reduce((acc, vote) => {
        if (vote.dateOptionId) {
          acc[vote.dateOptionId] = (acc[vote.dateOptionId] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>)
    }

    return NextResponse.json({
      votes,
      stats: voteStats
    })
  } catch (error: any) {
    console.error('Error fetching votes:', error.message)
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    )
  }
}

// Додати/оновити голос
export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Не авторизовано' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { eventId, dateOptionId, voteType } = body

    if (!eventId || !voteType || !dateOptionId) {
      return NextResponse.json(
        { error: 'Всі поля обов\'язкові' },
        { status: 400 }
      )
    }

    // Знаходимо або створюємо користувача
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name || session.user.email.split('@')[0],
      },
    })

    // Перевіряємо чи існує подія та варіант дати
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Подія не знайдена' },
        { status: 404 }
      )
    }

    const dateOption = await prisma.dateOption.findUnique({
      where: { id: dateOptionId }
    })

    if (!dateOption) {
      return NextResponse.json(
        { error: 'Варіант дати не знайдений' },
        { status: 404 }
      )
    }

    // Створюємо або оновлюємо голос
    const vote = await prisma.vote.upsert({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId: eventId
        }
      },
      update: {
        voteType,
        dateOptionId,
        userName: user.name,
        userEmail: user.email
      },
      create: {
        voteType,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        eventId,
        dateOptionId
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        dateOption: {
          select: {
            id: true,
            date: true
          }
        }
      }
    })

    console.log('🗳️ Голос додано/оновлено:', { eventId, voteType, user: user.email })

    return NextResponse.json(vote)
  } catch (error: any) {
    console.error('Error voting:', error.message)
    return NextResponse.json(
      { error: 'Не вдалося проголосувати' },
      { status: 500 }
    )
  }
}
