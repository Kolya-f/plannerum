import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  return NextResponse.json({ message: 'Votes API' })
}

export async function POST() {
  return NextResponse.json({ message: 'Vote recorded' })
}
