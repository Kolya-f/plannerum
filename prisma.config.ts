import { defineConfig } from 'prisma'

export default defineConfig({
  directUrl: process.env.DATABASE_URL,
})
