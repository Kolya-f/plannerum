export const dynamic = "force-dynamic"
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  return NextResponse.json({ message: 'Vote API endpoint' })
}

export async function POST() {
  return NextResponse.json({ message: 'Vote recorded' })
}
