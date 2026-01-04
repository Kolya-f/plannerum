import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/db/prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          console.log('❌ No email provided')
          return null
        }

        console.log('🔐 Authorizing:', credentials.email)

        // Перевіряємо чи існує користувач
        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        // Якщо немає - створюємо нового
        if (!user) {
          console.log('👤 Creating new user:', credentials.email)
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0] || 'Користувач'
            }
          })
          console.log('✅ User created:', user.email)
        }

        // У реальному додатку тут була б перевірка пароля
        // Але для демо просто повертаємо користувача
        
        return {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 днів
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/',
    error: '/auth/error',
    newUser: '/'
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
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
}
