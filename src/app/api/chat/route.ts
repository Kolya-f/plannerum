import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Простий мок для тесту
    return NextResponse.json({ 
      success: true, 
      messages: [
        { text: 'Welcome to Plannerum Chat!', user_name: 'System', created_at: new Date().toISOString() },
        { text: 'Chat functionality coming soon', user_name: 'System', created_at: new Date().toISOString() }
      ]
    })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { text } = await request.json()
    
    if (!text?.trim()) {
      return NextResponse.json({ error: 'Message cannot be empty' }, { status: 400 })
    }

    console.log('Message would be saved:', text.trim())
    
    return NextResponse.json({ success: true, message: 'Message sent (mock)' })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
