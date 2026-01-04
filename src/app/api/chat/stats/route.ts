import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Получаем общее количество сообщений
    const messagesResult = await sql`
      SELECT COUNT(*) as count FROM chat_messages
    `
    
    // Получаем общее количество пользователей
    const usersResult = await sql`
      SELECT COUNT(*) as count FROM users
    `
    
    // Получаем количество активных пользователей сегодня
    const activeResult = await sql`
      SELECT COUNT(DISTINCT "userId") as count FROM chat_messages 
      WHERE DATE("createdAt") = CURRENT_DATE
    `
    
    // Получаем количество онлайн пользователей (последние 5 минут)
    const onlineResult = await sql`
      SELECT COUNT(*) as count FROM online_users 
      WHERE "lastSeen" > NOW() - INTERVAL '5 minutes'
    `

    return NextResponse.json({
      totalMessages: parseInt(messagesResult.rows[0]?.count || '0'),
      totalUsers: parseInt(usersResult.rows[0]?.count || '0'),
      activeToday: parseInt(activeResult.rows[0]?.count || '0'),
      onlineUsers: parseInt(onlineResult.rows[0]?.count || '0'),
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching chat stats:', error)
    // Демо данные для разработки
    return NextResponse.json({
      totalMessages: 42,
      totalUsers: 15,
      activeToday: 8,
      onlineUsers: 5,
      lastUpdated: new Date().toISOString()
    })
  }
}
