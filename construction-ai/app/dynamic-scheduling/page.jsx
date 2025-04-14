"use client"

import { Button } from "@/components/ui/button"

import { CardDescription } from "@/components/ui/card"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import Link from "next/link"

export default function DynamicSchedulingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-2">
            <Calendar className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Dynamic Project Scheduling</h1>
          </div>
          <p className="text-white mt-2">Optimize your project schedules with real-time data and AI insights</p>
        </header>

        <div className="space-y-6">
          {/* Feature Card: AI-Driven Adjustments */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">AI-Driven Schedule Adjustments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Automatically adjust task schedules based on weather forecasts, resource availability, and other
                real-time factors. Minimize delays and maximize efficiency with smart scheduling.
              </p>
            </CardContent>
          </Card>

          {/* Feature Card: Real-Time Task Management */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Real-Time Task Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Monitor task progress, update dependencies, and manage resources in real-time. Our intuitive interface
                allows you to quickly respond to changing conditions and keep your project on track.
              </p>
            </CardContent>
          </Card>

          {/* Feature Card: Weather-Optimized Scheduling */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Weather-Optimized Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Integrate weather forecasts into your project schedule to proactively avoid delays and minimize the
                impact of inclement weather. Ensure that outdoor tasks are completed during optimal conditions.
              </p>
            </CardContent>
          </Card>

          {/* Feature Card: Resource Allocation Optimization */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Resource Allocation Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Optimize resource allocation across all project tasks. Our AI algorithms automatically identify
                bottlenecks and reallocate resources to ensure maximum efficiency and minimize downtime.
              </p>
            </CardContent>
          </Card>

          {/* Feature Card: Mobile Accessibility */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Mobile Accessibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                Access and manage your project schedules from anywhere with our fully responsive mobile interface. Stay
                connected and informed, even when you're on the go.
              </p>
            </CardContent>
          </Card>

          {/* Call to Action Card */}
          <Card className="bg-blue-600 hover:bg-blue-700 text-white">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Get Started with Dynamic Scheduling</CardTitle>
              <CardDescription className="text-white">
                Transform your construction projects with our cutting-edge scheduling tools
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center pt-4">
              <Link href="/signup">
                <Button className="bg-white text-blue-600 hover:bg-blue-100">Sign Up Now</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
