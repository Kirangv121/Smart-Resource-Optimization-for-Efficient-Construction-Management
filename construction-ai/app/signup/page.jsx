"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Construction } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignupPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState("homeowner")

  const handleSignup = (e) => {
    e.preventDefault()
    // In a real app, we would register the user here
    if (userRole === "homeowner") {
      router.push("/homeowner-dashboard")
    } else {
      router.push("/contractor-dashboard")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 text-white border-gray-700">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center gap-2">
              <Construction className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">BuildSmart AI</span>
            </Link>
          </div>
          <CardTitle className="text-2xl text-center text-white">Create an account</CardTitle>
          <CardDescription className="text-white text-center">Enter your information to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name" className="text-white">
                    First name
                  </Label>
                  <Input
                    id="first-name"
                    placeholder="John"
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name" className="text-white">
                    Last name
                  </Label>
                  <Input id="last-name" placeholder="Doe" required className="bg-gray-700 border-gray-600 text-white" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password" className="text-white">
                  Confirm Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-white">Account Type</Label>
                <RadioGroup defaultValue="homeowner" onValueChange={setUserRole} className="text-white">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="homeowner"
                      id="homeowner"
                      className="text-white border-white data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="homeowner" className="text-white">
                      Homeowner
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="contractor"
                      id="contractor"
                      className="text-white border-white data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:border-blue-600"
                    />
                    <Label htmlFor="contractor" className="text-white">
                      Contractor
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-sm text-white text-center w-full">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:text-blue-300">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
