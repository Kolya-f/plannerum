import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    console.log('Fetching events from Neon database...')
    
    const events = await prisma.event.findMany({
      take: 20,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    console.log(`Found ${events.length} events in Neon`)
    
    return NextResponse.json(events)
  } catch (error: any) {
    console.error('Neon database error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch events from database',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
