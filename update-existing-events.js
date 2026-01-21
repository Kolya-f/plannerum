const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateExistingEvents() {
  try {
    // Знаходимо всі існуючі події
    const events = await prisma.event.findMany()
    
    for (const event of events) {
      // Оновлюємо кожну подію
      await prisma.event.update({
        where: { id: event.id },
        data: {
          publicId: event.publicId || `event-${event.id}-${Date.now()}`,
          createdById: event.createdById || 'unknown-user',
          isPublic: true,
          location: 'Online',
          category: 'other'
        }
      })
      console.log(`Updated event: ${event.id}`)
    }
    
    console.log('All events updated successfully!')
  } catch (error) {
    console.error('Error updating events:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateExistingEvents()
