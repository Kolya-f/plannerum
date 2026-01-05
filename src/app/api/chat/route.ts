import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const messages = await prisma.chatMessage.findMany({
      take: 50,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    return NextResponse.json({ messages: messages.reverse() })
  } catch (error) {
    console.error('Chat get error:', error)
    return NextResponse.json({ messages: [] })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, userId, userName, userEmail } = body
    
    if (!content || !userId) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    
    const message = await prisma.chatMessage.create({
      data: {
        content,
        userId,
        userName: userName || 'User',
        userEmail: userEmail || 'user@example.com',
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
    
    console.log('💬 Повідомлення збережено в базі:', content)
    
    return NextResponse.json({ message })
  } catch (error) {
    console.error('Chat post error:', error)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}
