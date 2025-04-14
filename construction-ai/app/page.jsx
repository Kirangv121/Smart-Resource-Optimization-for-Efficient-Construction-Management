import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Construction, Home, School, ShoppingBag, Warehouse } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Construction className="h-8 w-8 text-blue-400" />
          <h1 className="text-2xl font-bold">BuildSmart AI</h1>
        </div>
        <div className="flex gap-4">
          <Link href="/login">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Login
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign Up</Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              AI-Driven Smart Resource Optimization for Construction
            </h2>
            <p className="text-xl text-white">
              Reduce delays, cut costs, and optimize resources with our advanced AI system that provides real-time
              monitoring and predictive analytics.
            </p>
            <div className="flex gap-4 pt-4">
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 text-lg">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" className="text-white border-white hover:bg-white/10 px-6 py-6 text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="w-full h-[400px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Material Optimization</h3>
                    <p className="text-white">Reduce waste by 30% with AI-driven material planning</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Cost Tracking</h3>
                    <p className="text-white">Real-time budget monitoring and expense forecasting</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Labor Management</h3>
                    <p className="text-white">Optimize workforce allocation and scheduling</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Project Insights</h3>
                    <p className="text-white">AI-powered analytics for better decision making</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-gray-800/50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Building2 className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Project Estimation</h3>
                <p className="text-white">
                  Get accurate estimates for materials, labor, and costs based on your project specifications.
                </p>
              </div>
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Construction className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-Time Project Tracking</h3>
                <p className="text-white">
                  Monitor progress, delays, and material consumption with our advanced tracking system.
                </p>
              </div>
              <div className="bg-gray-700/50 p-6 rounded-xl">
                <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Material Supplier Module</h3>
                <p className="text-white">
                  Directly request materials from suppliers and manage inventory efficiently.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Construction Types */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Construction Types We Support</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-gray-700/50 p-6 rounded-xl flex flex-col items-center text-center">
              <Home className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Residential</h3>
              <p className="text-white">1BHK, 2BHK, 3BHK, Duplex, Villa</p>
            </div>
            <div className="bg-gray-700/50 p-6 rounded-xl flex flex-col items-center text-center">
              <Building2 className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Buildings</h3>
              <p className="text-white">4-Story, 8-Story, Skyscraper, Commercial Office</p>
            </div>
            <div className="bg-gray-700/50 p-6 rounded-xl flex flex-col items-center text-center">
              <School className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Educational</h3>
              <p className="text-white">Primary, High School, University, Auditorium</p>
            </div>
            <div className="bg-gray-700/50 p-6 rounded-xl flex flex-col items-center text-center">
              <ShoppingBag className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Commercial</h3>
              <p className="text-white">Retail, Mall, Corporate, Mixed-Use</p>
            </div>
            <div className="bg-gray-700/50 p-6 rounded-xl flex flex-col items-center text-center">
              <Warehouse className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Industrial</h3>
              <p className="text-white">Storage Unit, Distribution Center, Industrial, Cold Storage</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Construction Project?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of contractors and homeowners who are saving time, reducing costs, and improving
              efficiency.
            </p>
            <Link href="/signup">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold">
                Get Started Now
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <Construction className="h-6 w-6 text-blue-400" />
              <h2 className="text-xl font-bold">BuildSmart AI</h2>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="text-white hover:text-white">
                About
              </Link>
              <Link href="#" className="text-white hover:text-white">
                Features
              </Link>
              <Link href="#" className="text-white hover:text-white">
                Pricing
              </Link>
              <Link href="#" className="text-white hover:text-white">
                Contact
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-white">
            <p>© 2023 BuildSmart AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
