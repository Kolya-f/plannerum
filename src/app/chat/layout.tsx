import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                <span className="font-medium">Back to Plannerum</span>
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              💬 Real-Time Global Chat
            </div>
          </div>
        </div>
      </nav>
      {children}
    </>
  )
}
