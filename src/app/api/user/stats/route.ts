import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic' // Це фіксує помилку з headers

export async function GET() {
  try {
    // Проста статистика для тесту
    return NextResponse.json({
      totalEvents: 0,
      totalVotes: 0,
      upcomingEvents: 0
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
  }
}
