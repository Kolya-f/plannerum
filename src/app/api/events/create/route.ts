export const dynamic = "force-dynamic"
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

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
        userId: userId || 'demo-user',
        userName: userName || 'Демо Користувач',
        userEmail: userEmail || 'demo@example.com',
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
