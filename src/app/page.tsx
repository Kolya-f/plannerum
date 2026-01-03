import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Plan Events. Connect People.
            </h1>
            <p className="text-xl mb-10 opacity-90">
              The easiest way to organize events, collect votes, and build community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create-event"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition"
              >
                Start Planning →
              </Link>
              <Link
                href="/how-it-works"
                className="bg-transparent border-2 border-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg text-lg transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything You Need for Event Planning
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="text-blue-600 text-4xl mb-4">🗓️</div>
            <h3 className="text-xl font-semibold mb-3">Event Creation</h3>
            <p className="text-gray-600">
              Create beautiful event pages with dates, locations, and descriptions
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-blue-600 text-4xl mb-4">🗳️</div>
            <h3 className="text-xl font-semibold mb-3">Voting System</h3>
            <p className="text-gray-600">
              Let attendees vote on dates, locations, or other options
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="text-blue-600 text-4xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-3">Community Chat</h3>
            <p className="text-gray-600">
              Built-in chat for discussing details and connecting with people
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Join thousands of users who are already planning their events with Plannerum
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg"
            >
              Sign Up Free
            </Link>
            <Link
              href="/events"
              className="bg-white border-2 border-gray-300 hover:border-blue-600 text-gray-800 font-bold py-3 px-8 rounded-lg"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
