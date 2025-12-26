import Link from 'next/link'
import { 
  CalendarDaysIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  FireIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const features = [
    {
      icon: <CalendarDaysIcon className="h-6 w-6" />,
      title: "Create Events",
      description: "Easily create events and propose multiple dates",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: <UserGroupIcon className="h-6 w-6" />,
      title: "Invite Friends",
      description: "Share links with friends and colleagues",
      color: "text-purple-600 bg-purple-50"
    },
    {
      icon: <ClockIcon className="h-6 w-6" />,
      title: "Vote on Dates",
      description: "Participants vote on dates that work best",
      color: "text-green-600 bg-green-50"
    },
    {
      icon: <ChartBarIcon className="h-6 w-6" />,
      title: "See Results",
      description: "Real-time results show popular dates",
      color: "text-orange-600 bg-orange-50"
    }
  ]

  const stats = [
    { value: "10,000+", label: "Events Created", color: "border-blue-200" },
    { value: "50,000+", label: "Happy Users", color: "border-purple-200" },
    { value: "98%", label: "Satisfaction", color: "border-green-200" },
    { value: "24/7", label: "Support", color: "border-orange-200" }
  ]

  const steps = [
    { number: "1", title: "Create Event", description: "Fill simple form with dates" },
    { number: "2", title: "Share Link", description: "Send unique link to participants" },
    { number: "3", title: "Collect Votes", description: "People vote on best dates" },
    { number: "4", title: "Finalize", description: "Pick the date with most votes" }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
            <SparklesIcon className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-700">No sign-up required to vote</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Plan Events
            <span className="block text-blue-600 mt-2">Together, Effortlessly</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Create events, propose dates, and vote together. Find the perfect time 
            that works for everyone with our collaborative planning platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/create-event" 
              className="group px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <CalendarDaysIcon className="h-5 w-5" />
              Create Free Event
              <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/how-it-works" 
              className="px-6 py-3 rounded-lg bg-white text-gray-800 font-semibold border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 flex items-center gap-2"
            >
              <TrophyIcon className="h-5 w-5 text-purple-500" />
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className={`bg-white rounded-xl p-6 text-center border-t-4 ${stat.color}`}
            >
              <div className="text-2xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Simple & Effective Planning
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to organize events without the hassle
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300"
            >
              <div className={`inline-flex p-3 rounded-lg ${feature.color} mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How Plannerum Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Four simple steps to find the perfect date
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="bg-white rounded-xl p-6 text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-lg mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 right-0 w-full h-0.5 bg-gray-300 -translate-y-1/2 translate-x-1/2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Ready to Simplify Planning?</h2>
          <p className="text-blue-100 mb-6 max-w-xl mx-auto">
            Join thousands who plan events without the back-and-forth emails
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/create-event" 
              className="px-6 py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-all duration-300"
            >
              Start Planning Free
            </Link>
            <Link 
              href="/how-it-works" 
              className="px-6 py-3 rounded-lg bg-transparent text-white font-semibold border border-white/50 hover:bg-white/10 transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
