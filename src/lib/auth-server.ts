import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || 'your-fallback-secret-key-change-in-production'
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function decrypt(input: string) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function registerUser(email: string, password: string, name: string) {
  try {
    // Перевірка чи існує користувач
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { user: null, error: 'Користувач з таким email вже існує' }
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10)

    // Створення користувача
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    // Створення сесії
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 днів
    const session = await encrypt({ userId: user.id, expires })

    // Зберігаємо в cookies
    ;(await cookies()).set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires,
      path: '/',
    })

    // Повернення без пароля
    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword, error: null }
  } catch (error: any) {
    console.error('Registration error:', error)
    return { user: null, error: 'Помилка сервера' }
  }
}

export async function loginUser(email: string, password: string) {
  try {
    // Пошук користувача
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return { user: null, error: 'Невірний email або пароль' }
    }

    if (!user.password) {
      return { user: null, error: 'Спочатку зареєструйтесь' }
    }

    // Перевірка пароля
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return { user: null, error: 'Невірний email або пароль' }
    }

    // Створення сесії
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 днів
    const session = await encrypt({ userId: user.id, expires })

    // Зберігаємо в cookies
    ;(await cookies()).set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires,
      path: '/',
    })

    // Повернення без пароля
    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword, error: null }
  } catch (error: any) {
    console.error('Login error:', error)
    return { user: null, error: 'Помилка сервера' }
  }
}

export async function logout() {
  ;(await cookies()).delete('session')
}

export async function getCurrentUser() {
  try {
    const session = (await cookies()).get('session')?.value
    
    if (!session) return null

    const payload = await decrypt(session)
    
    if (!payload) return null

    const user = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
      }
    })

    return user
  } catch (error) {
    return null
  }
}
