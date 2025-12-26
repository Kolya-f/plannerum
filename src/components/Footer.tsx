import { CalendarDaysIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded">
                <CalendarDaysIcon className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">Plannerum</span>
            </div>
            <p className="text-gray-400 text-sm">
              Making event planning simple and collaborative
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-gray-400 hover:text-white text-sm">Features</Link></li>
              <li><Link href="/pricing" className="text-gray-400 hover:text-white text-sm">Pricing</Link></li>
              <li><Link href="/api" className="text-gray-400 hover:text-white text-sm">API</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white text-sm">About</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white text-sm">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white text-sm">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white text-sm">Terms</Link></li>
              <li><Link href="/cookies" className="text-gray-400 hover:text-white text-sm">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Plannerum. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
