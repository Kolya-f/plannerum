import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message?.trim();
    
    if (!message) {
      return NextResponse.json({
        success: false,
        error: 'Повідомлення не може бути порожнім'
      }, { status: 400 });
    }

    // Беремо API ключ з env змінних
    const apiKey = process.env.GROQ_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'API ключ не налаштовано. Додайте GROQ_API_KEY до .env.local'
      }, { status: 500 });
    }

    // Перевірка формату ключа
    if (!apiKey.startsWith('gsk_')) {
      return NextResponse.json({
        success: false,
        error: `Невірний формат API ключа. Має починатись з "gsk_", а починається з "${apiKey.substring(0, 10)}..."`
      }, { status: 500 });
    }

    console.log('🔑 Використовуємо API ключ:', apiKey.substring(0, 10) + '...');
    console.log('📝 Запит користувача:', message.substring(0, 50));

    // Підготовка запиту до Groq
    const groqData = {
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'Ти корисний AI-помічник для Plannerum - сервісу планування подій. Відповідай українською мовою. Будь дружнім, корисним та професійним.'
        },
        {
          role: 'user',
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      stream: false
    };

    // Відправляємо запит до Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Plannerum-AI-Chat/1.0'
      },
      body: JSON.stringify(groqData)
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('❌ Помилка від Groq API:', response.status, responseText);
      
      let errorMessage = 'Помилка AI сервісу';
      try {
        const errorJson = JSON.parse(responseText);
        errorMessage = errorJson.error?.message || errorMessage;
      } catch (e) {
        // Якщо не вдалося розпарсити JSON
      }
      
      return NextResponse.json({
        success: false,
        error: errorMessage,
        status: response.status
      }, { status: response.status });
    }

    // Парсимо успішну відповідь
    const data = JSON.parse(responseText);
    const aiResponse = data.choices?.[0]?.message?.content || 'Не вдалося отримати відповідь';

    console.log('✅ Успішна відповідь від AI');
    
    return NextResponse.json({
      success: true,
      message: aiResponse,
      model: 'llama-3.1-8b-instant'
    });

  } catch (error) {
    console.error('❌ Помилка сервера:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Невідома помилка сервера'
    }, { status: 500 });
  }
}

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;
  const hasKey = !!apiKey;
  
  return NextResponse.json({
    status: 'online',
    service: 'Plannerum AI Chat',
    has_api_key: hasKey,
    key_preview: hasKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : null,
    timestamp: new Date().toISOString()
  });
}
