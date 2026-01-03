export const dynamic = "force-dynamic"
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getUserFromRequest } from '@/lib/auth/api-helpers'

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        user: true,
        dateOptions: true,
        votes: true,
        chatMessages: {
          take: 1,
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

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
      title, 
      description, 
      location, 
      category, 
      maxParticipants, 
      isPublic,
      dateOptions
    } = body

    if (!title || !dateOptions || dateOptions.length === 0) {
      return NextResponse.json(
        { error: 'Title and at least one date option are required' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        category,
        maxParticipants,
        isPublic,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        dateOptions: {
          create: dateOptions.map((date: string) => ({
            date: new Date(date)
          }))
        }
      },
      include: {
        dateOptions: true,
        user: true
      }
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
