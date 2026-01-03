import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    
    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }
    
    // Here you would typically:
    // 1. Check if user exists
    // 2. Hash password
    // 3. Create user in database
    // 4. Send verification email
    
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Registration successful!',
      user: {
        id: Date.now().toString(),
        name,
        email,
        createdAt: new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
