import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, userName, userEmail } = body

    if (!userId) {
      return NextResponse.json({ error: 'UserId is required' }, { status: 400 })
    }

    // Обновляем или добавляем запись онлайн пользователя
    await sql`
      INSERT INTO online_users ("userId", "userName", "userEmail", "lastSeen")
      VALUES (${userId}, ${userName || ''}, ${userEmail || ''}, NOW())
      ON CONFLICT ("userId") 
      DO UPDATE SET 
        "lastSeen" = NOW(),
        "userName" = EXCLUDED."userName",
        "userEmail" = EXCLUDED."userEmail"
    `

    // Удаляем старые записи (более 10 минут)
    await sql`
      DELETE FROM online_users 
      WHERE "lastSeen" < NOW() - INTERVAL '10 minutes'
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating online status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
