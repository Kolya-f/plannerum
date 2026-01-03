import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = params.id

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        dateOptions: {
          orderBy: { date: 'asc' }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    // Форматування даних
    const formattedEvent = {
      id: event.id,
      title: event.title,
      description: event.description,
      creatorName: event.creatorName,
      location: event.location,
      category: event.category,
      maxParticipants: event.maxParticipants,
      isPublic: event.isPublic,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      dateOptions: event.dateOptions.map(option => ({
        id: option.id,
        date: option.date?.toISOString() || null,
        createdAt: option.createdAt.toISOString()
      }))
    }

    return NextResponse.json(formattedEvent)

  } catch (error: any) {
    console.error('Get event error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get event' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
