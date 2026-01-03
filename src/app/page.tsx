import Link from 'next/link'
import { 
  MessageSquare, Users, Zap, Lock, Globe, Sparkles,
  ArrowRight, Rocket, Shield, Battery, Cpu, Satellite,
  Calendar, CheckCircle, Star
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-telegram-bg to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-telegram-primary/10 to-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:50px_50px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-telegram-bg-tertiary rounded-full mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">All-in-One Platform</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-telegram-primary via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Plan Events.
              </span>
              <br />
              <span className="text-white">Chat. Connect.</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-telegram-text-muted max-w-3xl mx-auto mb-10">
              Everything you need to organize amazing events and connect with your community in one seamless platform.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/events"
                className="group relative px-8 py-4 bg-gradient-to-r from-telegram-primary to-blue-500 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-telegram-primary/30 transition-all duration-300 flex items-center gap-3"
              >
                <Calendar className="w-5 h-5" />
                <span>Explore Events</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <Link
                href="/chat"
                className="px-8 py-4 bg-telegram-bg-tertiary border border-telegram-border rounded-xl font-bold text-lg hover:bg-telegram-bg-secondary transition-all flex items-center gap-3"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Join Chat</span>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Users, value: 'Active Community', label: 'Join thousands' },
                { icon: Zap, value: 'Real-Time', label: 'Instant updates' },
                { icon: Lock, value: 'Secure', label: 'End-to-end encrypted' },
                { icon: Globe, value: 'Global', label: 'Worldwide access' },
              ].map((stat, index) => (
                <div key={index} className="p-6 bg-telegram-bg-tertiary/50 rounded-xl border border-telegram-border">
                  <stat.icon className="w-8 h-8 text-telegram-primary mb-3 mx-auto" />
                  <div className="text-lg font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-telegram-text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-telegram-bg-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Plannerum?</h2>
            <p className="text-telegram-text-muted max-w-2xl mx-auto">
              The complete solution for event planning and community building
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: 'Event Management',
                description: 'Create, manage, and promote events with powerful tools',
                color: 'from-telegram-primary to-blue-500'
              },
              {
                icon: MessageSquare,
                title: 'Real-Time Chat',
                description: 'Instant messaging with your event participants',
                color: 'from-green-500 to-emerald-400'
              },
              {
                icon: Users,
                title: 'Community Hub',
                description: 'Connect with like-minded people in your niche',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: Shield,
                title: 'Secure Platform',
                description: 'Your data and conversations are protected',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Optimized for speed and performance',
                color: 'from-cyan-500 to-blue-400'
              },
              {
                icon: Star,
                title: 'Easy to Use',
                description: 'Intuitive interface that anyone can master',
                color: 'from-yellow-500 to-orange-400'
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group p-6 bg-telegram-bg-tertiary rounded-xl border border-telegram-border hover:border-telegram-primary/50 transition-all duration-300 hover:scale-[1.02]"
              >
                <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-telegram-text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-telegram-text-muted max-w-2xl mx-auto">
              Get started in just three simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up',
                description: 'Create your free account in seconds',
                icon: <Users className="w-8 h-8" />
              },
              {
                step: '2',
                title: 'Create Events',
                description: 'Plan and organize your events with our tools',
                icon: <Calendar className="w-8 h-8" />
              },
              {
                step: '3',
                title: 'Connect & Chat',
                description: 'Engage with participants in real-time',
                icon: <MessageSquare className="w-8 h-8" />
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative p-8 bg-telegram-bg-tertiary rounded-xl border border-telegram-border"
              >
                <div className="absolute -top-4 -left-4 w-12 h-12 rounded-xl bg-gradient-to-r from-telegram-primary to-blue-500 flex items-center justify-center font-bold text-xl">
                  {step.step}
                </div>
                <div className="text-telegram-primary mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-telegram-text-muted">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-telegram-primary/5 via-transparent to-blue-500/5"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-telegram-bg-tertiary rounded-full mb-8">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="font-medium">Free to Get Started</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Transform Your{' '}
            <span className="bg-gradient-to-r from-telegram-primary to-blue-500 bg-clip-text text-transparent">
              Event Experience?
            </span>
          </h2>
          
          <p className="text-xl text-telegram-text-muted mb-10 max-w-2xl mx-auto">
            Join thousands of event organizers and community members already using Plannerum.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/events"
              className="group px-8 py-4 bg-gradient-to-r from-telegram-primary to-blue-500 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-telegram-primary/30 transition-all flex items-center justify-center gap-3"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
            
            <Link
              href="/chat"
              className="px-8 py-4 bg-telegram-bg-tertiary border border-telegram-border rounded-xl font-bold text-lg hover:bg-telegram-bg-secondary transition-all"
            >
              Try Demo Chat
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
