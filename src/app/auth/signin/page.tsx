'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password: password || 'demo', // Демо пароль якщо не введено
        redirect: false,
      })

      console.log('🔐 Результат входу:', result)

      if (result?.error) {
        setError('Неправильний email або пароль. Спробуйте ще раз.')
      } else {
        console.log('✅ Успішний вхід, перенаправляємо...')
        router.push('/')
        router.refresh()
      }
    } catch (error) {
      console.error('❌ Помилка входу:', error)
      setError('Щось пішло не так. Спробуйте ще раз.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setEmail('demo@example.com')
    setPassword('demo')
    
    const result = await signIn('credentials', {
      email: 'demo@example.com',
      password: 'demo',
      redirect: false,
    })

    if (result?.error) {
      setError('Помилка демо-входу')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Увійти в Plannerum</h1>
            <p className="text-gray-600 mt-2">
              Введіть ваші дані для входу
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center text-red-700">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Помилка:</span>
              </div>
              <p className="mt-1 text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-1" />
                Email адреса
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Lock className="inline w-4 h-4 mr-1" />
                Пароль (опційно)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Можна залишити пустим для демо"
              />
              <p className="mt-2 text-sm text-gray-500">
                Якщо ви новий користувач, система створить акаунт автоматично
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Вхід...
                  </span>
                ) : (
                  'Увійти'
                )}
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg hover:shadow-xl"
              >
                Демо-вхід
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              <p>Для тестування використовуйте:</p>
              <p className="mt-1 font-medium">Email: demo@example.com</p>
              <p>Пароль: demo (або будь-який)</p>
              <p className="mt-3">
                <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                  ← Повернутися на головну
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
