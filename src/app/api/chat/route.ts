import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔍 GET /api/chat - Fetching messages')
    
    // Отримати повідомлення через raw query
    const messages = await prisma.$queryRaw`
      SELECT 
        text, 
        user_name, 
        created_at
      FROM messages 
      ORDER BY created_at DESC 
      LIMIT 50
    `

    console.log(`✅ Found ${Array.isArray(messages) ? messages.length : 0} messages`)
    
    return NextResponse.json({
      success: true,
      messages: Array.isArray(messages) ? messages.reverse() : []
    })

  } catch (error: any) {
    console.error('❌ GET /api/chat error:', error.message)
    console.error('Full error:', error)
    
    return NextResponse.json(
      { 
        error: 'Помилка при отриманні повідомлень',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📨 POST /api/chat - Sending message')
    
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      console.log('❌ No session found')
      return NextResponse.json(
        { error: 'Необхідно увійти в систему' },
        { status: 401 }
      )
    }

    console.log('👤 User:', session.user.email)
    
    const body = await request.json()
    const { text } = body
    
    console.log('📝 Message text:', text)
    
    if (!text?.trim()) {
      return NextResponse.json(
        { error: 'Повідомлення не може бути порожнім' },
        { status: 400 }
      )
    }

    // Знайти користувача
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    console.log('🔍 Found user:', user ? 'yes' : 'no')
    
    if (!user) {
      return NextResponse.json(
        { error: 'Користувача не знайдено' },
        { status: 404 }
      )
    }

    // Зберегти повідомлення через raw query
    await prisma.$executeRaw`
      INSERT INTO messages (text, user_id, user_name, created_at)
      VALUES (${text.trim()}, ${user.id}, ${user.name || user.email || 'Anonymous'}, NOW())
    `

    console.log('✅ Message saved successfully')
    
    return NextResponse.json({
      success: true,
      message: 'Повідомлення відправлено'
    })

  } catch (error: any) {
    console.error('❌ POST /api/chat error:', error.message)
    console.error('Full error:', error)
    
    return NextResponse.json(
      { 
        error: 'Помилка при відправці повідомлення',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
