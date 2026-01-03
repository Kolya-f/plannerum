import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MainHeader from '@/components/MainHeader'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Plannerum - Plan Your Events',
  description: 'Event planning and voting platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <MainHeader />
          <main className="min-h-screen bg-gray-50">
            {children}
          </main>
          <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4 text-center">
              <p>© 2025 Plannerum. All rights reserved.</p>
              <p className="mt-2 text-gray-400">
                Plan your events with ease and connect with your community
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
