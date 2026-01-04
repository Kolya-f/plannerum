import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// Функція для получения пользователя из заголовков запроса
export async function getUserFromRequest(request: NextRequest) {
  try {
    // Отримуємо ID користувача з заголовка
    const userId = request.headers.get('x-user-id')
    
    console.log('🔍 Шукаємо користувача за ID:', userId)
    
    if (!userId) {
      console.log('⚠️ x-user-id заголовок відсутній')
      return null
    }

    // Шукаємо користувача в базі
    let user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (user) {
      console.log('✅ Користувач знайдений:', user.email)
      return {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }

    // Якщо користувача немає, створюємо нового з цим ID
    console.log('👤 Користувача не знайдено, створюємо нового з ID:', userId)
    
    // Генеруємо унікальний email на основі ID
    const userEmail = `${userId.replace(/[^a-zA-Z0-9]/g, '-')}@plannerum.com`
    
    user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        name: 'Користувач ' + userId.slice(0, 6),
        email: userEmail
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
