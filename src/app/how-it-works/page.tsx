import Link from 'next/link'
import { 
  CalendarDaysIcon,
  LinkIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

export default function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Create Your Event",
      description: "Give your event a name and add multiple date options",
      icon: <CalendarDaysIcon className="h-6 w-6" />,
      color: "bg-blue-50 text-blue-600"
    },
    {
      number: "2",
      title: "Share Voting Link",
      description: "Copy and share the unique link with participants",
      icon: <LinkIcon className="h-6 w-6" />,
      color: "bg-purple-50 text-purple-600"
    },
    {
      number: "3",
      title: "Collect Votes",
      description: "Participants vote Yes, No, or Maybe on each date",
      icon: <UserGroupIcon className="h-6 w-6" />,
      color: "bg-green-50 text-green-600"
    },
    {
      number: "4",
      title: "Finalize Date",
      description: "See results instantly and choose the best date",
      icon: <CheckCircleIcon className="h-6 w-6" />,
      color: "bg-orange-50 text-orange-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Plannerum Works
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A simple four-step process to plan any event collaboratively
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`${step.color} p-3 rounded-lg`}>
                        {step.icon}
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center">
                          {step.number}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-9 top-full w-0.5 h-8 bg-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Do participants need to sign up?
                </h3>
                <p className="text-gray-600">
                  No! Participants can vote without creating an account. Only event creators need to sign up.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Is there a limit on participants?
                </h3>
                <p className="text-gray-600">
                  No limits! Invite as many people as you need.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Can I change dates after creating an event?
                </h3>
                <p className="text-gray-600">
                  Yes! You can add or remove date options anytime.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Is Plannerum free to use?
                </h3>
                <p className="text-gray-600">
                  Yes, Plannerum is completely free for all features.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-blue-100 mb-6">
              Create your first event in under a minute
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/create-event" 
                className="px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all duration-300"
              >
                Create Free Event
              </Link>
              <Link 
                href="/" 
                className="px-6 py-3 rounded-lg bg-transparent text-white font-semibold border border-white/50 hover:bg-white/10 transition-all duration-300"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
