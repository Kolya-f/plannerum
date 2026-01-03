import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getUserFromRequest } from '@/lib/auth/api-helpers'

export async function GET() {
  try {
    const messages = await prisma.chatMessage.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        event: true
      }
    })
    
    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
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
    const { content, eventId } = body

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    const message = await prisma.chatMessage.create({
      data: {
        content,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        eventId
      },
      include: {
        user: true,
        event: true
      }
    })

    // Обновляем статус онлайн
    await prisma.onlineUser.upsert({
      where: { userId: user.id },
      update: { 
        lastSeen: new Date(),
        userName: user.name,
        userEmail: user.email
      },
      create: {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        lastSeen: new Date()
      }
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
