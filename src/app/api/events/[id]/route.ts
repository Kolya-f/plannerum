import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params)
    
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        dateOptions: {
          select: {
            id: true,
            date: true
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

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}
