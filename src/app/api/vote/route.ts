import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Необхідно увійти в систему' },
        { status: 401 }
      )
    }

    const { dateOptionId, voteType } = await request.json()
    
    if (!dateOptionId || !voteType) {
      return NextResponse.json(
        { error: 'Відсутні обов\'язкові поля' },
        { status: 400 }
      )
    }

    // Знайти користувача
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Користувача не знайдено' },
        { status: 404 }
      )
    }

    // Перевірити чи існує dateOption
    const dateOption = await prisma.dateOption.findUnique({
      where: { id: dateOptionId }
    })

    if (!dateOption) {
      return NextResponse.json(
        { error: 'Дата для голосування не знайдена' },
        { status: 404 }
      )
    }

    // Оновити або створити голос
    const vote = await prisma.vote.upsert({
      where: {
        userId_dateOptionId: {
          userId: user.id,
          dateOptionId: dateOptionId
        }
      },
      update: {
        voteType: voteType
      },
      create: {
        userId: user.id,
        dateOptionId: dateOptionId,
        voteType: voteType
      }
    })

    // Отримати статистику голосів для цієї дати
    const voteStats = await prisma.vote.groupBy({
      by: ['voteType'],
      where: { dateOptionId: dateOptionId },
      _count: true
    })

    // Перетворити на об'єкт
    const stats = {
      yes: voteStats.find(v => v.voteType === 'yes')?._count || 0,
      no: voteStats.find(v => v.voteType === 'no')?._count || 0,
      maybe: voteStats.find(v => v.voteType === 'maybe')?._count || 0
    }

    return NextResponse.json({
      success: true,
      vote: vote,
      stats: stats,
      totalVotes: stats.yes + stats.no + stats.maybe
    })

  } catch (error: any) {
    console.error('Vote error:', error)
    return NextResponse.json(
      { error: 'Помилка при голосуванні', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Необхідно увійти в систему' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json(
        { error: 'Відсутній eventId' },
        { status: 400 }
      )
    }

    // Знайти користувача
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Користувача не знайдено' },
        { status: 404 }
      )
    }

    // Отримати всі дати для цієї події
    const dateOptions = await prisma.dateOption.findMany({
      where: { eventId: eventId },
      select: {
        id: true,
        date: true,
        votes: {
          where: { userId: user.id },
          select: { voteType: true }
        }
      }
    })

    // Отримати голоси користувача
    const userVotes = dateOptions.map(option => ({
      dateOptionId: option.id,
      userVote: option.votes[0]?.voteType || null
    }))

    // Отримати статистику голосів для всіх дат події
    const allVotes = await prisma.vote.groupBy({
      by: ['dateOptionId', 'voteType'],
      where: {
        dateOption: {
          eventId: eventId
        }
      },
      _count: true
    })

    // Структурувати статистику
    const voteStats: Record<string, { yes: number, no: number, maybe: number }> = {}
    
    allVotes.forEach(vote => {
      if (!voteStats[vote.dateOptionId]) {
        voteStats[vote.dateOptionId] = { yes: 0, no: 0, maybe: 0 }
      }
      voteStats[vote.dateOptionId][vote.voteType as keyof typeof voteStats[string]] = vote._count
    })

    return NextResponse.json({
      success: true,
      userVotes: userVotes,
      stats: voteStats
    })

  } catch (error: any) {
    console.error('Get votes error:', error)
    return NextResponse.json(
      { error: 'Помилка при отриманні голосів', details: error.message },
      { status: 500 }
    )
  }
}
