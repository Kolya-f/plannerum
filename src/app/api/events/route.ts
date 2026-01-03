import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Simple fallback response
    return NextResponse.json({ message: 'Events API is working' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
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
