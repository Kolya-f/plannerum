import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'

// Для Next.js 15+
interface RouteContext {
  params: Promise<{ publicId: string }>;
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { publicId } = await context.params;
    const session = await getServerSession(authOptions);
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

    // Перевірка доступу
    // 1. Публічні події доступні всім
    // 2. Приватні події - тільки власнику
    if (!event.isPublic) {
      if (!session?.user?.id) {
        console.log('❌ Unauthorized access to private event (no session)')
        return NextResponse.json(
          { error: 'Unauthorized - This is a private event' },
          { status: 403 }
        )
      }
      
      if (event.creator.id !== session.user.id) {
        console.log('❌ Unauthorized access to private event (wrong user)')
        return NextResponse.json(
          { error: 'Unauthorized - This is a private event' },
          { status: 403 }
        )
      }
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
