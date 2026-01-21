import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await prisma.$connect()
    const userCount = await prisma.user.count()
    const eventCount = await prisma.event.count()
    await prisma.$disconnect()
    
    return NextResponse.json({
      status: 'connected',
      userCount,
      eventCount,
      databaseUrl: process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set'
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      error: error.message,
      databaseUrl: process.env.DATABASE_URL ? 'Set (hidden)' : 'Not set'
    }, { status: 500 })
  }
}
