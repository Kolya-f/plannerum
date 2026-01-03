import { ReactNode } from 'react'
import Link from 'next/link'

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-600">
              Plannerum Chat
            </Link>
            <nav className="flex space-x-4">
              <Link href="/events" className="text-gray-600 hover:text-gray-900">
                Events
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-gray-900">
                Profile
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Community Chat</h1>
          <p className="text-gray-600 mb-8">
            Connect with other users, discuss events, and share ideas
          </p>
          {children}
        </div>
      </main>
    </div>
  )
}
