'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const errorMessages: Record<string, string> = {
    Configuration: 'Проблема з конфігурацією сервера.',
    AccessDenied: 'Доступ заборонено.',
    Verification: 'Посилання для верифікації недійсне або застаріло.',
    Default: 'Сталася помилка під час автентифікації.',
  }

  const errorMessage = error ? errorMessages[error] || errorMessages.Default : errorMessages.Default

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Помилка автентифікації</h1>
            <p className="text-gray-600 mt-2">
              {errorMessage}
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="block w-full bg-blue-600 text-white py-3 rounded-lg text-center font-medium hover:bg-blue-700"
            >
              Спробувати знову
            </Link>
            
            <Link
              href="/"
              className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg text-center font-medium hover:bg-gray-50"
            >
              На головну
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Якщо помилка повторюється, зверніться до адміністратора.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
