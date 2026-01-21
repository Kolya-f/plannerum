import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET всіх івентів
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true
          }
        },
        dateOptions: {
          select: {
            id: true,
            date: true
          }
        },
        votes: {
          select: {
            id: true,
            voteType: true
          }
        },
        chatMessages: {
          select: {
            id: true
          }
        }
      }
    })

    const eventsWithCounts = events.map(event => ({
      ...event,
      _count: {
        votes: event.votes.length,
        chatMessages: event.chatMessages.length
      }
    }))

    return NextResponse.json({ 
      events: eventsWithCounts,
      total: events.length 
    })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ 
      events: [],
      total: 0,
      error: 'Failed to fetch events'
    })
  }
}

// POST створення нового івенту
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      title, 
      description, 
      location, 
      category, 
      maxParticipants, 
      isPublic,
      dateOptions,
      userId,
      userName,
      userEmail
    } = body

    // Валідація обов'язкових полів
    if (!title || !userId) {
      return NextResponse.json(
        { error: 'Title and userId are required' },
        { status: 400 }
      )
    }

    // Створення івенту
    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        location: location || null,
        category: category || 'other',
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        isPublic: isPublic !== undefined ? isPublic : true,
        userId,
        userName: userName || 'User',
        userEmail: userEmail || 'user@example.com',
        dateOptions: {
          create: dateOptions?.map((date: string) => ({
            date: new Date(date)
          })) || []
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        dateOptions: true
      }
    })

    console.log('✅ Подія створена:', event.id)

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating event:', error)
    
    // Більш детальна інформація про помилку
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to create event',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
