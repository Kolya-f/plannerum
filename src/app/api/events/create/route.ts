import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Не авторизовано' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, location, category, maxParticipants, dateOptions } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Назва обов\'язкова' },
        { status: 400 }
      )
    }

    console.log('📝 Створення події:', { title, user: session.user.email, dateOptions })

    // Знаходимо або створюємо користувача
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name || session.user.email.split('@')[0],
      },
    })

    // Створюємо подію
    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        location: location || null,
        category: category || 'other',
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
      }
    })

    console.log('✅ Подія створена:', event.id)

    // Додаємо варіанти дат, якщо є
    if (dateOptions && dateOptions.length > 0) {
      const validDates = dateOptions.filter((date: string) => date.trim() !== '')
      
      if (validDates.length > 0) {
        const dateOptionsData = validDates.map((dateStr: string) => ({
          eventId: event.id,
          date: new Date(dateStr)
        }))

        await prisma.dateOption.createMany({
          data: dateOptionsData
        })

        console.log(`✅ Додано ${validDates.length} варіантів дат`)
      }
    }

    // Отримуємо повну інформацію про подію
    const fullEvent = await prisma.event.findUnique({
      where: { id: event.id },
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

    return NextResponse.json(fullEvent, { status: 201 })
  } catch (error: any) {
    console.error('❌ Помилка створення події:', error.message)
    return NextResponse.json(
      { error: 'Не вдалося створити подію' },
      { status: 500 }
    )
  }
}
