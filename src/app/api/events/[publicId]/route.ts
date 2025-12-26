import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteContext {
  params: Promise<{ publicId: string }>;
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { publicId } = await context.params;
    console.log('🔵 GET /api/events/[publicId] - Fetching event:', publicId)

    const event = await prisma.event.findUnique({
      where: { id: publicId },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        dateOptions: {
          include: {
            votes: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            },
            _count: {
              select: {
                votes: true
              }
            }
          }
        }
      }
    })

    if (!event) {
      console.log('❌ Event not found:', publicId)
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    console.log('✅ Event found:', event.title)
    return NextResponse.json(event)

  } catch (error) {
    console.error('❌ Error fetching event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}
