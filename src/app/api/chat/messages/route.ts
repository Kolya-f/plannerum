import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const messages = await prisma.chatMessage.findMany({
      where: eventId ? { eventId } : {},
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        event: true
      }
    })
    
    return NextResponse.json(messages.reverse()) // Переворачиваем чтобы новые были внизу
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
    const body = await request.json()
    const { content, userId, userName, userEmail, eventId } = body

    if (!content || !userId) {
      return NextResponse.json(
        { error: 'Content and userId are required' },
        { status: 400 }
      )
    }

    const message = await prisma.chatMessage.create({
      data: {
        content,
        userId,
        userName: userName || 'Анонім',
        userEmail: userEmail || 'anonymous@example.com',
        eventId
      },
      include: {
        user: true,
        event: true
      }
    })

    // Обновляем статус онлайн
    await prisma.onlineUser.upsert({
      where: { userId },
      update: { 
        lastSeen: new Date(),
        userName: userName || 'Анонім',
        userEmail: userEmail || 'anonymous@example.com'
      },
      create: {
        userId,
        userName: userName || 'Анонім',
        userEmail: userEmail || 'anonymous@example.com',
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
