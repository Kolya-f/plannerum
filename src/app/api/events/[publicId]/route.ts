import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    // Важливо: params це Promise в Next.js 15+
    const { publicId } = await params

    console.log('🔵 GET /api/events/[publicId] - Fetching event:', publicId)

    const event = await prisma.event.findUnique({
      where: { id: publicId },  // Використовуємо id, бо publicId не існує в схемі
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        dateOptions: {
          select: {
            id: true,
            date: true,
            votes: {
              select: {
                id: true,
                type: true,
                user: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            },
            _count: {
              select: { votes: true }
            }
          },
          orderBy: {
            date: 'asc'
          }
        }
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    console.log('✅ Event found:', event.title)
    
    return NextResponse.json(event)

  } catch (error: any) {
    console.error('🔴 GET /api/events/[publicId] - Error:', error.message)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch event',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}
