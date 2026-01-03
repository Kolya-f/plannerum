import Link from 'next/link'

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">How Plannerum Works</h1>
        
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl mb-4">1</div>
            <h3 className="text-xl font-semibold mb-3">Create Events</h3>
            <p className="text-gray-600">
              Easily create events with details like date, location, and description.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl mb-4">2</div>
            <h3 className="text-xl font-semibold mb-3">Invite & Vote</h3>
            <p className="text-gray-600">
              Share events with your community and let people vote on options.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-3xl mb-4">3</div>
            <h3 className="text-xl font-semibold mb-3">Connect</h3>
            <p className="text-gray-600">
              Use the chat to discuss details and connect with attendees.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li>Sign up for a free account</li>
            <li>Create your first event</li>
            <li>Invite friends or colleagues</li>
            <li>Collect votes and feedback</li>
            <li>Chat with attendees</li>
          </ol>
        </div>

        <div className="text-center">
          <Link
            href="/create-event"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
          >
            Create Your First Event
          </Link>
          <p className="mt-4 text-gray-600">
            or{' '}
            <Link href="/events" className="text-blue-600 hover:underline">
              browse existing events
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
