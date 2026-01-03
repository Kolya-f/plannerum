import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    const count = await prisma.event.count()
    await prisma.$disconnect()
    
    return NextResponse.json({ 
      message: 'Events API is working',
      eventCount: count,
      status: 'connected'
    })
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error.message,
        status: 'error'
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { message: 'Use /api/events/create to create events' },
    { status: 400 }
  )
}
