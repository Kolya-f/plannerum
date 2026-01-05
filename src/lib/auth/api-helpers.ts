import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from './options'

// Функція для отримання користувача з сесії NextAuth
export async function getUserFromRequest(request: NextRequest) {
  try {
    // Отримуємо сесію через getServerSession
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      console.log('❌ Користувач не автентифікований в сесії')
      return null
    }

    const userEmail = session.user.email
    console.log('🔍 Шукаємо користувача за email:', userEmail)

    // Шукаємо користувача в базі
    let user = await prisma.user.findUnique({
      where: { email: userEmail }
    })

    if (user) {
      console.log('✅ Користувач знайдений:', user.email)
      return {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }

    // Якщо користувача немає, створюємо нового
    console.log('👤 Користувача не знайдено, створюємо нового з email:', userEmail)
    
    user = await prisma.user.create({
      data: {
        email: userEmail,
        name: session.user.name || userEmail.split('@')[0] || 'Користувач'
      }
    })

    console.log('✅ Користувача створено:', user.email)

    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  } catch (error) {
    console.error('❌ Помилка отримання користувача:', error)
    return null
  }
}
