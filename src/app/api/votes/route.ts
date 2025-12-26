import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

// POST: Проголосувати
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { eventId, dateOptionId, status } = body

    if (!eventId || !dateOptionId || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['YES', 'NO', 'MAYBE'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid vote status' },
        { status: 400 }
      )
    }

    // Перевіряємо чи існує подія та дата
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

    // Перевіряємо чи користувач вже голосував за цю дату
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_dateOptionId: {
          userId: user.id,
          dateOptionId
        }
      }
    })

    let vote
    if (existingVote) {
      // Оновлюємо існуючий голос
      vote = await prisma.vote.update({
        where: { id: existingVote.id },
        data: { status }
      })
    } else {
      // Створюємо новий голос
      vote = await prisma.vote.create({
        data: {
          userId: user.id,
          dateOptionId,
          eventId,
          status
        }
      })
    }

    return NextResponse.json({ 
      message: 'Vote recorded successfully',
      vote
    }, { status: existingVote ? 200 : 201 })

  } catch (error) {
    console.error('Error recording vote:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET: Отримати результати голосування
export async function GET(request: NextRequest) {
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
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        dateOption: true
      }
    })

    // Групуємо голоси по датам
    const results = votes.reduce((acc, vote) => {
      const dateOptionId = vote.dateOptionId
      if (!acc[dateOptionId]) {
        acc[dateOptionId] = {
          dateOption: vote.dateOption,
          votes: {
            YES: 0,
            NO: 0,
            MAYBE: 0
          },
          users: []
        }
      }
      
      acc[dateOptionId].votes[vote.status]++
      acc[dateOptionId].users.push({
        id: vote.user.id,
        name: vote.user.name,
        email: vote.user.email,
        status: vote.status
      })
      
      return acc
    }, {} as any)

    return NextResponse.json({ results: Object.values(results) })

  } catch (error) {
    console.error('Error fetching votes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
