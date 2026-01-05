import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Providers from './providers'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Plannerum - Плануйте зустрічі разом',
  description: 'Інструмент для планування зустрічей, голосування за дати та спілкування в чаті',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body className={`${inter.className} bg-gray-50`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <footer className="bg-gray-900 text-white py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Plannerum</h3>
                  <p className="text-gray-400">
                    Простий інструмент для планування зустрічей та спілкування
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Меню</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/" className="hover:text-white">Головна</a></li>
                    <li><a href="/events" className="hover:text-white">Події</a></li>
                    <li><a href="/create-event" className="hover:text-white">Створити подію</a></li>
                    <li><a href="/chat" className="hover:text-white">Чат</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Функції</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/how-it-works" className="hover:text-white">Як це працює</a></li>
                    <li><a href="/about" className="hover:text-white">Про нас</a></li>
                    <li><a href="/contact" className="hover:text-white">Контакти</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Правова інформація</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li><a href="/privacy" className="hover:text-white">Політика конфіденційності</a></li>
                    <li><a href="/terms" className="hover:text-white">Умови використання</a></li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>© 2024 Plannerum. Всі права захищені.</p>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
