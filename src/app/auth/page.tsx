'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User as UserIcon } from 'lucide-react'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Создаем пользователя
      const user = {
        id: `user-${Date.now()}`,
        name: name || 'Демо Користувач',
        email: email || 'demo@example.com'
      }
      
      localStorage.setItem('plannerum-user', JSON.stringify(user))
      
      // Ждем немного для реалистичности
      await new Promise(resolve => setTimeout(resolve, 500))
      
      router.push('/')
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setIsLoading(true)
    try {
      const demoUser = {
        id: 'demo-user',
        name: 'Демо Користувач',
        email: 'demo@example.com'
      }
      
      localStorage.setItem('plannerum-user', JSON.stringify(demoUser))
      
      await new Promise(resolve => setTimeout(resolve, 300))
      router.push('/')
    } catch (error) {
      console.error('Demo login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-blue-600 rounded-full mb-4">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Вхід до Plannerum' : 'Реєстрація'}
          </h1>
          <p className="text-gray-600">
            {isLogin 
              ? 'Увійдіть у свій акаунт для продовження' 
              : 'Створіть новий акаунт для початку роботи'
            }
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <UserIcon className="inline w-4 h-4 mr-1 text-gray-400" />
                  Ім'я
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ваше ім'я"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-1 text-gray-400" />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="inline w-4 h-4 mr-1 text-gray-400" />
                  Пароль
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isLogin ? 'Вхід...' : 'Реєстрація...'}
                </span>
              ) : (
                isLogin ? 'Увійти' : 'Зареєструватися'
              )}
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 mb-4 disabled:opacity-50"
            >
              Спробувати демо-акаунт
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
            >
              {isLogin 
                ? 'Немає акаунту? Зареєструватися' 
                : 'Вже є акаунт? Увійти'
              }
            </button>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Демо-акаунт використовує локальне зберігання в браузері</p>
          <p className="mt-1">Дані зберігаються тільки на вашому пристрої</p>
        </div>
      </div>
    </div>
  )
}
