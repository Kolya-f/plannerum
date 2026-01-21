import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="glass border-t border-white/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="text-2xl font-bold gradient-text">Plannerum</span>
            </div>
            <p className="text-gray-600">
              Making event planning simple and collaborative for everyone.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600">🎯</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600">🚀</span>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600">❤️</span>
              </div>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/features" className="text-gray-600 hover:text-primary-600 transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-gray-600 hover:text-primary-600 transition-colors">Pricing</Link></li>
              <li><Link href="/api" className="text-gray-600 hover:text-primary-600 transition-colors">API</Link></li>
              <li><Link href="/documentation" className="text-gray-600 hover:text-primary-600 transition-colors">Documentation</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">About</Link></li>
              <li><Link href="/blog" className="text-gray-600 hover:text-primary-600 transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="text-gray-600 hover:text-primary-600 transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="text-gray-600 hover:text-primary-600 transition-colors">Terms</Link></li>
              <li><Link href="/cookies" className="text-gray-600 hover:text-primary-600 transition-colors">Cookies</Link></li>
              <li><Link href="/security" className="text-gray-600 hover:text-primary-600 transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600">
            © {new Date().getFullYear()} Plannerum. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">LinkedIn</a>
            <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">GitHub</a>
            <a href="#" className="text-gray-400 hover:text-primary-600 transition-colors">Discord</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
