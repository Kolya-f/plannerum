import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET - отримання подій користувача
export async function GET() {
  try {
    console.log('🔵 GET /api/events - Starting...')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      console.log('❌ GET /api/events - No session')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('🔵 GET /api/events - User:', session.user.email)

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      console.log('❌ GET /api/events - User not found')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('🔵 GET /api/events - Fetching events for user:', user.id)
    
    // Отримуємо події без votes (бо їх немає в Event)
    const events = await prisma.event.findMany({
      where: {
        creatorId: user.id
      },
      select: {
        id: true,
        title: true,
        description: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        dateOptions: {
          select: {
            id: true,
            date: true,
            _count: {
              select: { votes: true }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Додаємо загальну кількість голосів до кожної події
    const eventsWithVoteCount = await Promise.all(
      events.map(async (event) => {
        const totalVotes = await prisma.vote.count({
          where: {
            dateOption: {
              eventId: event.id
            }
          }
        })
        
        return {
          ...event,
          _count: {
            dateOptions: event.dateOptions.length,
            votes: totalVotes
          }
        }
      })
    )

    console.log('✅ GET /api/events - Found', eventsWithVoteCount.length, 'events')
    
    return NextResponse.json(eventsWithVoteCount)

  } catch (error: any) {
    console.error('🔴 GET /api/events - Error:', error.message)
    console.error('Full error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch events',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}

// POST - створення нової події
export async function POST(request: Request) {
  try {
    console.log('🟢 POST /api/events - Creating new event...')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      console.log('❌ POST /api/events - No session')
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      console.log('❌ POST /api/events - User not found')
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const { title, description, dates, isPublic } = await request.json()
    
    console.log('📝 Event data:', { title, description, datesCount: dates?.length })
    
    if (!title || !dates || !Array.isArray(dates) || dates.length < 2) {
      return NextResponse.json(
        { error: 'Title and at least 2 dates are required' },
        { status: 400 }
      )
    }

    // Створюємо подію
    const event = await prisma.event.create({
      data: {
        title,
        description,
        isPublic: isPublic !== false,
        creatorId: user.id,
        dateOptions: {
          create: dates.map((date: string) => ({
            date: new Date(date)
          }))
        }
      },
      include: {
        dateOptions: true
      }
    })

    console.log('✅ POST /api/events - Event created:', event.id)
    
    return NextResponse.json({
      success: true,
      event: {
        ...event,
        publicId: event.id
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('🔴 POST /api/events - Error:', error.message)
    console.error('Full error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to create event',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}
