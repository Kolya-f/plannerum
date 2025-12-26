import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// GET - отримання подій користувача
export async function GET() {
  try {
    console.log('🔵 GET /api/events - Starting...')
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Отримуємо всі події користувача (і публічні, і приватні)
    const events = await prisma.event.findMany({
      where: {
        creatorId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        dateOptions: {
          include: {
            _count: {
              select: {
                votes: true
              }
            }
          }
        },
        _count: {
          select: {
            dateOptions: true
          }
        }
      }
    })

    console.log(`✅ GET /api/events - Found ${events.length} events`)
    return NextResponse.json(events)

  } catch (error) {
    console.error('❌ GET /api/events - Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// POST - створення нової події
export async function POST(request: Request) {
  try {
    console.log('🟢 POST /api/events - Creating new event...')
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('📝 Event data:', body)

    const { title, description, isPublic = true, dateOptions } = body

    // Валідація
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!dateOptions || !Array.isArray(dateOptions) || dateOptions.length === 0) {
      return NextResponse.json(
        { error: 'At least one date option is required' },
        { status: 400 }
      )
    }

    // Створення події
    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        isPublic: isPublic ?? true,
        creatorId: session.user.id
      }
    })

    // Створення дат
    const createdDateOptions = []
    for (const dateOpt of dateOptions) {
      const dateOption = await prisma.dateOption.create({
        data: {
          eventId: event.id,
          date: new Date(dateOpt.date)
        }
      })
      createdDateOptions.push(dateOption)
    }

    console.log('✅ POST /api/events - Event created:', event.id)
    return NextResponse.json({
      message: 'Event created successfully',
      event: {
        ...event,
        dateOptions: createdDateOptions
      }
    }, { status: 201 })

  } catch (error) {
    console.error('❌ POST /api/events - Error:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
