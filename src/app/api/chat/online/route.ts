import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, userName, userEmail } = body

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 })
    }

    // Обновляем или добавляем запись онлайн пользователя
    await prisma.onlineUser.upsert({
      where: {
        userId: userId
      },
      update: {
        lastSeen: new Date(),
        userName: userName || '',
        userEmail: userEmail || ''
      },
      create: {
        userId: userId,
        userName: userName || '',
        userEmail: userEmail || '',
        lastSeen: new Date()
      }
    })

    // Удаляем старые записи (более 10 минут)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000)
    await prisma.onlineUser.deleteMany({
      where: {
        lastSeen: {
          lt: tenMinutesAgo
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating online status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
