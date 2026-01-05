const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Добавляем тестовые сообщения в чат...')

  // Проверяем существование пользователей
  const users = await prisma.user.findMany()
  if (users.length === 0) {
    console.log('❌ Нет пользователей. Сначала создайте пользователей.')
    return
  }

  // Проверяем существование событий
  const events = await prisma.event.findMany()
  if (events.length === 0) {
    console.log('❌ Нет событий. Сначала создайте события.')
    return
  }

  // Добавляем тестовые сообщения
  const testMessages = [
    {
      content: 'Привет всем! Как ваши дела?',
      userId: users[0].id,
      userName: users[0].name,
      userEmail: users[0].email,
      eventId: events[0].id
    },
    {
      content: 'Привет! Все отлично, жду нашей встречи!',
      userId: users[1]?.id || users[0].id,
      userName: users[1]?.name || 'Другой пользователь',
      userEmail: users[1]?.email || 'user2@example.com',
      eventId: events[0].id
    },
    {
      content: 'Когда начинаем воркшоп? Уже не терпится!',
      userId: users[0].id,
      userName: users[0].name,
      userEmail: users[0].email,
      eventId: events[1]?.id || events[0].id
    },
    {
      content: 'Всем доброго дня! Кто будет на встрече?',
      userId: users[0].id,
      userName: users[0].name,
      userEmail: users[0].email,
      eventId: null // Глобальное сообщение
    },
    {
      content: 'Я буду! Жду не дождусь нашего обсуждения.',
      userId: users[1]?.id || users[0].id,
      userName: users[1]?.name || 'Другой пользователь',
      userEmail: users[1]?.email || 'user2@example.com',
      eventId: null // Глобальное сообщение
    }
  ]

  for (const message of testMessages) {
    try {
      await prisma.chatMessage.create({
        data: message
      })
      console.log(`✅ Добавлено сообщение: "${message.content.substring(0, 30)}..."`)
    } catch (error) {
      console.log(`❌ Ошибка при добавлении сообщения: ${error.message}`)
    }
  }

  // Добавляем пользователей в онлайн
  for (const user of users) {
    try {
      await prisma.onlineUser.upsert({
        where: { userId: user.id },
        update: { lastSeen: new Date() },
        create: {
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          lastSeen: new Date()
        }
      })
      console.log(`✅ Пользователь ${user.name} добавлен в онлайн`)
    } catch (error) {
      console.log(`❌ Ошибка при добавлении пользователя в онлайн: ${error.message}`)
    }
  }

  const messageCount = await prisma.chatMessage.count()
  const onlineCount = await prisma.onlineUser.count()

  console.log('\n📊 Статистика после сидинга:')
  console.log(`   Сообщений в чате: ${messageCount}`)
  console.log(`   Пользователей онлайн: ${onlineCount}`)
  console.log('🎉 Сидинг чата завершен!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при сидинге:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
