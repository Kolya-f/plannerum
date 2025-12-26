// Простий тест API голосування
const eventId = 'cmjmqdojk0001y4tf07ggpj70' // Заміни на ID твоєї події

console.log('🔍 Testing voting API...')

// 1. Тест GET /api/events/[id]/vote
fetch(`http://localhost:3000/api/events/${eventId}/vote`)
  .then(res => res.json())
  .then(data => console.log('GET Votes:', data.success ? '✅' : '❌', data))
  .catch(err => console.error('GET Error:', err))

// 2. Тест POST /api/events/[id]/vote (потрібна авторизація)
console.log('Note: POST test requires authentication')
