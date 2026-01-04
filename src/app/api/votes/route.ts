export const dynamic = "force-dynamic"
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getUserFromRequest } from '@/lib/auth/api-helpers'

export async function POST(request: Request) {
  try {
    console.log('🗳️ Отримано запит на голосування')
    
    // Отримуємо користувача
    const user = await getUserFromRequest(request as any)
    
    if (!user) {
      console.log('❌ Користувач не автентифікований')
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    console.log('✅ Користувач автентифікований:', user.email)
    
    const body = await request.json()
    const { 
      eventId,
      dateOptionId,
      voteType
    } = body

    console.log('📊 Дані голосування:', { eventId, dateOptionId, voteType })

    if (!eventId || !dateOptionId || !voteType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Проверяем, что voteType допустимый
    const validVoteTypes = ['yes', 'no', 'maybe']
    if (!validVoteTypes.includes(voteType)) {
      return NextResponse.json(
        { error: 'Invalid vote type. Must be: yes, no, or maybe' },
        { status: 400 }
      )
    }

    // Проверяем, существует ли событие
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Проверяем, существует ли вариант даты
    const dateOption = await prisma.dateOption.findUnique({
      where: { id: dateOptionId }
    })

    if (!dateOption) {
      return NextResponse.json(
        { error: 'Date option not found' },
        { status: 404 }
      )
    }

    console.log('💾 Зберігаємо голос для користувача:', user.email)

    // Создаем или обновляем голос
    const vote = await prisma.vote.upsert({
      where: {
        userId_eventId: {
          userId: user.id,
          eventId
        }
      },
      update: {
        dateOptionId,
        voteType,
        userName: user.name,
        userEmail: user.email
      },
      create: {
        eventId,
        dateOptionId,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        voteType
      },
      include: {
        dateOption: true
      }
    })

    console.log('✅ Голос збережено:', vote.id)

    // Отримуємо оновлену статистику голосів для цієї дати
    const voteStats = await prisma.vote.groupBy({
      by: ['voteType'],
      where: { dateOptionId },
      _count: {
        _all: true
      }
    })

    const stats = {
      yes: voteStats.find(v => v.voteType === 'yes')?._count._all || 0,
      no: voteStats.find(v => v.voteType === 'no')?._count._all || 0,
      maybe: voteStats.find(v => v.voteType === 'maybe')?._count._all || 0,
      total: voteStats.reduce((sum, v) => sum + v._count._all, 0)
    }

    console.log('📈 Оновлена статистика:', stats)

    return NextResponse.json({
      success: true,
      message: 'Vote recorded successfully',
      vote,
      stats
    }, { status: 201 })
    
  } catch (error) {
    console.error('❌ Error creating vote:', error)
    
    // Детальна інформація про помилку
    if (error instanceof Error) {
      console.error('Error details:', error.message)
      console.error('Error stack:', error.stack)
      
      // Перевірка на унікальне обмеження
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Ви вже проголосували за цю подію' },
          { status: 400 }
        )
      }
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create vote',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// GET голосів для події
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

    const votes = await prisma.vote.findMany({
      where: { eventId },
      include: {
        dateOption: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({ votes })
    
  } catch (error) {
    console.error('Error fetching votes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch votes' },
      { status: 500 }
    )
  }
}
