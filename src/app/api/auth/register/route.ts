import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, password } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('👤 Реєстрація користувача:', email)

    // Перевіряємо чи існує користувач
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('✅ Користувач вже існує:', existingUser.email)
      return NextResponse.json({
        success: true,
        user: existingUser,
        message: 'Користувач вже існує'
      })
    }

    // Створюємо нового користувача
    const user = await prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        // У реальному додатку тут було б хешування пароля
      }
    })

    console.log('✅ Користувача створено:', user.email)

    return NextResponse.json({
      success: true,
      user,
      message: 'Користувача створено успішно'
    })

  } catch (error) {
    console.error('❌ Помилка реєстрації:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create user',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
