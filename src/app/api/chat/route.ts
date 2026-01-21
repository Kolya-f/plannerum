import { NextRequest, NextResponse } from 'next/server';

// Типи для запитів до зовнішніх API
interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GroqRequest {
  model: string;
  messages: GroqMessage[];
  temperature?: number;
  max_tokens?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [], model = 'llama-3.1-8b-instant' } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Повідомлення обов\'язкове і має бути рядком' },
        { status: 400 }
      );
    }

    // Перевірка наявності API ключа
    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // Повертаємо демо-відповідь, якщо API ключа немає
      return NextResponse.json({
        success: true,
        message: `Це демо-відповідь AI. У реальній версії тут буде інтеграція з AI API.\n\nВи написали: "${message}"\n\nДля налаштування реального AI:\n1. Додайте GROQ_API_KEY або OPENAI_API_KEY у .env.local\n2. Налаштуйте відповідний endpoint`,
        model: 'demo'
      });
    }

    // Підготовка повідомлень для API
    const messages: GroqMessage[] = [
      { role: 'system', content: 'Ти корисний AI-асистент для Plannerum - сервісу планування подій. Відповідай українською мовою.' },
      ...conversationHistory.slice(-10).map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    // Використання Groq API
    const groqRequest: GroqRequest = {
      model: model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000
    };

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(groqRequest)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Помилка Groq API:', response.status, errorText);
      
      return NextResponse.json(
        { 
          error: `Помилка AI API: ${response.status}`,
          details: errorText.slice(0, 200)
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || 'Не вдалося отримати відповідь';

    return NextResponse.json({
      success: true,
      message: aiResponse,
      model: model
    });

  } catch (error) {
    console.error('Помилка обробки запиту:', error);
    
    return NextResponse.json(
      { 
        error: 'Внутрішня помилка сервера',
        details: error instanceof Error ? error.message : 'Невідома помилка'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'Plannerum AI Chat API',
    endpoints: {
      chat: 'POST /api/chat',
      models: 'GET /api/chat/models'
    }
  });
}
