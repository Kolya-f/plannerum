// Mock Prisma client for MVP
export const prisma = {
  event: {
    findMany: async () => {
      return [
        {
          id: '1',
          title: 'Welcome to Plannerum!',
          description: 'This is a sample event to get started',
          userId: '1',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Online',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Community Meeting',
          description: 'Join our monthly community gathering',
          userId: '2',
          date: new Date(Date.now() + 172800000).toISOString(),
          location: 'City Hall',
          createdAt: new Date().toISOString(),
        }
      ]
    },
    create: async (data: any) => {
      console.log('Creating event:', data)
      return {
        id: Date.now().toString(),
        ...data.data,
        createdAt: new Date().toISOString(),
      }
    },
    findUnique: async (where: any) => {
      return { id: where.id, title: 'Test Event', userId: '1' }
    },
    count: async () => 2,
  },
  user: {
    findMany: async () => {
      return [
        { id: '1', email: 'test@example.com', name: 'Test User' },
        { id: '2', email: 'admin@example.com', name: 'Admin User' }
      ]
    },
    findUnique: async (where: any) => {
      return { id: '1', email: where.email, name: 'Test User' }
    },
    create: async (data: any) => {
      console.log('Creating user:', data)
      return {
        id: Date.now().toString(),
        ...data.data,
      }
    },
    upsert: async ({ where, create, update }: any) => {
      console.log('Upserting user:', { where, create, update })
      return {
        id: '1',
        email: where.email,
        name: create.name || 'Test User',
      }
    },
    count: async () => 2,
  },
  vote: {
    findMany: async () => {
      return [
        {
          id: '1',
          eventId: '1',
          option: 'yes',
          userId: '1',
          createdAt: new Date().toISOString(),
        }
      ]
    },
    create: async (data: any) => {
      console.log('Creating vote:', data)
      return {
        id: Date.now().toString(),
        ...data.data,
        createdAt: new Date().toISOString(),
      }
    },
    count: async () => 1,
  },
  $connect: async () => console.log('Connected to in-memory DB'),
  $disconnect: async () => console.log('Disconnected from in-memory DB'),
}

export default prisma
