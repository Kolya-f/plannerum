import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email is required")
        }

        // Шукаємо користувача в базі
        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        // Якщо користувача немає - створюємо нового
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0], // Ім'я з email
              password: credentials.password // В реальному додатку потрібно хешувати!
            }
          })
          console.log('✅ Created new user:', user.id)
        } 
        // Якщо користувач є - перевіряємо пароль
        else if (user.password !== credentials.password) {
          // Для MVP: якщо пароль не співпадає, оновлюємо його
          user = await prisma.user.update({
            where: { id: user.id },
            data: { password: credentials.password }
          })
          console.log('🔄 Updated password for user:', user.id)
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 днів
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        
        // Додатково отримуємо інфо з бази
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            createdAt: true,
            events: {
              select: { id: true, title: true },
              take: 5
            }
          }
        })
        
        if (dbUser) {
          session.user.createdAt = dbUser.createdAt
          session.user.eventCount = dbUser.events.length
        }
      }
      return session
    }
  },
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
