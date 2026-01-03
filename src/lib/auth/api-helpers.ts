import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db/prisma'

// Функция для получения пользователя из заголовков запроса
export async function getUserFromRequest(request: NextRequest) {
  try {
    // В демо-режиме используем заголовок с ID пользователя
    const userId = request.headers.get('x-user-id') || 'demo-user'
    
    // Ищем пользователя в базе
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }

    // Если пользователя нет, создаем демо-пользователя
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@example.com' },
      update: {},
      create: {
        id: 'demo-user',
        name: 'Демо Користувач',
        email: 'demo@example.com'
      }
    })

    return {
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email
    }
  } catch (error) {
    console.error('Error getting user from request:', error)
    return null
  }
}
