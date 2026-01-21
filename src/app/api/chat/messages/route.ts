import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

// GET: Получить сообщения
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
    
    // Переворачиваем чтобы новые были внизу
    return NextResponse.json(messages.reverse())
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}

// POST: Отправить сообщение
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, userId, userName, userEmail, eventId } = body

    console.log('Получено сообщение:', { content, userId, userName })

    if (!content || !userId) {
      return NextResponse.json(
        { error: 'Content and userId are required' },
        { status: 400 }
      )
    }

    // Валидация длины сообщения
    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      )
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Message is too long (max 1000 characters)' },
        { status: 400 }
      )
    }

    const message = await prisma.chatMessage.create({
      data: {
        content: content.trim(),
        userId,
        userName: userName || 'Анонім',
        userEmail: userEmail || 'anonymous@example.com',
        eventId: eventId || null
      },
      include: {
        user: true,
        event: true
      }
    })

    console.log('Сообщение создано:', message.id)

    // Обновляем статус онлайн
    try {
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
      console.log('Статус онлайн обновлен для пользователя:', userId)
    } catch (onlineError) {
      console.error('Error updating online status:', onlineError)
      // Продолжаем даже если ошибка обновления онлайн статуса
    }

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'Failed to send message', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
