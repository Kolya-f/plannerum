import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Простий middleware без Supabase для тесту
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
