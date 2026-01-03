import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getUserFromRequest } from '@/lib/auth/api-helpers'

export async function POST(request: Request) {
  try {
    const user = await getUserFromRequest(request as any)
    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      eventId,
      dateOptionId,
      voteType
    } = body

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

    // Проверяем, существует ли событие и вариант даты
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    const dateOption = await prisma.dateOption.findUnique({
      where: { id: dateOptionId }
    })

    if (!dateOption) {
      return NextResponse.json(
        { error: 'Date option not found' },
        { status: 404 }
      )
    }

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
        user: true,
        dateOption: true,
        event: true
      }
    })

    return NextResponse.json(vote, { status: 201 })
  } catch (error) {
    console.error('Error creating vote:', error)
    return NextResponse.json(
      { error: 'Failed to create vote' },
      { status: 500 }
    )
  }
}
