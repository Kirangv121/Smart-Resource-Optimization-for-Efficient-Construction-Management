"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Construction, Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter()
  const [userRole, setUserRole] = useState("homeowner")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showLoginInfo, setShowLoginInfo] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    // In a real app, we would authenticate the user here
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
          <CardTitle className="text-2xl text-center text-white">Login to your account</CardTitle>
          <CardDescription className="text-white text-center">
            Enter your credentials to access your dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {/* Login Info Section */}
              <div className="bg-blue-600/20 p-3 rounded-lg border border-blue-600/30">
                <button
                  type="button"
                  onClick={() => setShowLoginInfo(!showLoginInfo)}
                  className="flex items-center gap-2 w-full text-left text-white"
                >
                  <Info className="h-4 w-4 text-blue-400" />
                  <span className="font-medium">Demo Login Details</span>
                  <span className="ml-auto text-xs">{showLoginInfo ? "Hide" : "Show"}</span>
                </button>

                {showLoginInfo && (
                  <div className="mt-2 text-sm space-y-2">
                    <div>
                      <p className="font-medium text-blue-400">Homeowner:</p>
                      <p className="text-white">Email: homeowner@example.com</p>
                      <p className="text-white">Password: password123</p>
                    </div>
                    <div>
                      <p className="font-medium text-blue-400">Contractor:</p>
                      <p className="text-white">Email: contractor@example.com</p>
                      <p className="text-white">Password: password123</p>
                    </div>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-white text-center">
            <Link href="#" className="text-blue-400 hover:text-blue-300">
              Forgot your password?
            </Link>
          </div>
          <div className="text-sm text-white text-center">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
