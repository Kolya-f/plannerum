import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Необхідно увійти в систему' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      title,
      description,
      dateOptions,
    } = body

    console.log('Creating event with session user:', session.user)

    // Знайти або створити користувача
    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    // Якщо користувача немає - створити
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || session.user.email.split('@')[0]
        }
      })
      console.log('Created new user:', user.id)
    }

    console.log('Using user ID:', user.id)

    // Створити подію (без location)
    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        isPublic: true,
        userId: user.id,
        dateOptions: {
          create: dateOptions.map((dateString: string) => ({
            date: new Date(dateString)
          }))
        }
      },
      include: {
        dateOptions: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    console.log('Event created successfully:', event.id)

    return NextResponse.json({
      success: true,
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        userId: event.userId,
        creatorName: event.user?.name || event.user?.email
      }
    })

  } catch (error: any) {
    console.error('Create event error:', error)
    console.error('Full error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    })
    
    return NextResponse.json(
      { 
        error: 'Помилка при створенні події',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
