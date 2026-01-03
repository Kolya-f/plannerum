import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/db/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Временная демо-авторизация
        if (credentials?.email === 'demo@example.com') {
          return {
            id: 'demo-user',
            email: 'demo@example.com',
            name: 'Демо Користувач'
          }
        }
        
        // Проверка в базе данных
        if (credentials?.email) {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })
          
          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name
            }
          }
        }
        
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
      }
      return session
    }
  }
}
