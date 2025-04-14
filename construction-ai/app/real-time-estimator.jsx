"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle,
  CloudRain,
  Construction,
  Loader2,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react"

// Function to format numbers in Indian currency format
function formatIndianCurrency(num) {
  const numStr = num.toString()
  let result = ""

  // Handle the decimal part if exists
  const parts = numStr.split(".")
  const intPart = parts[0]
  const decimalPart = parts.length > 1 ? "." + parts[1] : ""

  // Format the integer part with commas (Indian format: 1,23,456)
  let i = intPart.length
  let count = 0

  while (i--) {
    result = intPart[i] + result
    count++
    if (count === 3 && i !== 0) {
      result = "," + result
      count = 0
    } else if (count === 2 && i !== 0 && result.indexOf(",") !== -1) {
      result = "," + result
      count = 0
    }
  }

  return result + decimalPart
}

// Simulated real-time data
const REAL_TIME_DATA = {
  materials: {
    cement: { price: 350, trend: 3, availability: "High" },
    steel: { price: 60000, trend: -1, availability: "Medium" },
    sand: { price: 1500, trend: 5, availability: "Low" },
    bricks: { price: 10, trend: 0, availability: "High" },
    aggregate: { price: 1200, trend: 2, availability: "Medium" },
    wood: { price: 800, trend: 4, availability: "Medium" },
    glass: { price: 250, trend: -2, availability: "High" },
    paint: { price: 300, trend: 1, availability: "High" },
  },
  labor: {
    mason: { rate: 800, availability: "Medium" },
    helper: { rate: 500, availability: "High" },
    carpenter: { rate: 900, availability: "Low" },
    electrician: { rate: 1000, availability: "Medium" },
    plumber: { rate: 950, availability: "Medium" },
    painter: { rate: 800, availability: "High" },
  },
  weather: {
    Mumbai: { condition: "Rain", impact: "Moderate", delay: 3 },
    Delhi: { condition: "Clear", impact: "Low", delay: 0 },
    Bangalore: { condition: "Clear", impact: "Low", delay: 0 },
    Chennai: { condition: "Rain", impact: "High", delay: 5 },
    Kolkata: { condition: "Rain", impact: "Moderate", delay: 2 },
    Hyderabad: { condition: "Clear", impact: "Low", delay: 0 },
    Pune: { condition: "Rain", impact: "Low", delay: 1 },
    Ahmedabad: { condition: "Extreme Heat", impact: "Moderate", delay: 2 },
    Jaipur: { condition: "Extreme Heat", impact: "High", delay: 4 },
    Lucknow: { condition: "Clear", impact: "Low", delay: 0 },
    Mangalore: { condition: "Rain", impact: "Moderate", delay: 2 },
  },
  marketNews: [
    "Cement prices expected to rise by 5% next month due to increased demand",
    "Government announces new subsidies for eco-friendly construction materials",
    "Steel imports facing delays due to international shipping constraints",
    "Labor unions in Maharashtra negotiating for 10% wage increase",
    "New sustainable building regulations to be implemented next quarter",
  ],
}

// Construction type base rates (per sq ft)
const CONSTRUCTION_RATES = {
  house: { base: 2000, materialFactor: 1, laborFactor: 1 },
  building: { base: 2500, materialFactor: 1.2, laborFactor: 1.3 },
  school: { base: 2200, materialFactor: 1.1, laborFactor: 1.2 },
  commercial: { base: 3000, materialFactor: 1.3, laborFactor: 1.4 },
  warehouse: { base: 1800, materialFactor: 0.9, laborFactor: 0.8 },
}

// Location factors
const LOCATION_FACTORS = {
  Mumbai: 1.3,
  Delhi: 1.2,
  Bangalore: 1.25,
  Chennai: 1.15,
  Kolkata: 1.1,
  Hyderabad: 1.2,
  Pune: 1.15,
  Ahmedabad: 1.05,
  Jaipur: 1,
  Lucknow: 0.95,
  Mangalore: 1.18,
}

export default function RealTimeEstimator() {
  // Form inputs
  const [constructionType, setConstructionType] = useState("")
  const [size, setSize] = useState("")
  const [location, setLocation] = useState("")

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState(0)
  const [processingProgress, setProcessingProgress] = useState(0)

  // Results
  const [estimationResult, setEstimationResult] = useState(null)

  // Handle form submission
  const handleEstimate = (e) => {
    e.preventDefault()
    if (!constructionType || !size || !location) return

    setIsProcessing(true)
    setProcessingStep(0)
    setProcessingProgress(0)
    setEstimationResult(null)

    // Simulate AI processing steps
    simulateProcessing()
  }

  // Simulate AI processing
  const simulateProcessing = () => {
    const totalSteps = 7
    let currentStep = 0

    const interval = setInterval(() => {
      currentStep++
      setProcessingStep(currentStep)
      setProcessingProgress(Math.round((currentStep / totalSteps) * 100))

      if (currentStep >= totalSteps) {
        clearInterval(interval)
        generateResults()
        setIsProcessing(false)
      }
    }, 1000)
  }

  // Generate estimation results
  const generateResults = () => {
    const sizeNum = Number.parseFloat(size)
    const baseRate = CONSTRUCTION_RATES[constructionType].base
    const locationFactor = LOCATION_FACTORS[location]
    const materialFactor = CONSTRUCTION_RATES[constructionType].materialFactor
    const laborFactor = CONSTRUCTION_RATES[constructionType].laborFactor

    // Calculate material quantities based on construction type and size
    const cementQuantity = Math.round(sizeNum * 0.4) // bags
    const steelQuantity = Math.round(sizeNum * 0.008) // tons
    const sandQuantity = Math.round(sizeNum * 0.06) // cubic meters
    const bricksQuantity = Math.round(sizeNum * 10) // pieces

    // Calculate material costs
    const cementCost = cementQuantity * REAL_TIME_DATA.materials.cement.price
    const steelCost = steelQuantity * REAL_TIME_DATA.materials.steel.price
    const sandCost = sandQuantity * REAL_TIME_DATA.materials.sand.price
    const bricksCost = bricksQuantity * REAL_TIME_DATA.materials.bricks.price

    // Calculate labor requirements
    const masonCount = Math.max(2, Math.round(sizeNum / 500))
    const helperCount = Math.max(4, Math.round(sizeNum / 250))
    const carpenterCount = Math.max(1, Math.round(sizeNum / 1000))
    const electricianCount = Math.max(1, Math.round(sizeNum / 1500))

    // Calculate labor costs (assuming 30 days of work)
    const masonCost = masonCount * REAL_TIME_DATA.labor.mason.rate * 30
    const helperCost = helperCount * REAL_TIME_DATA.labor.helper.rate * 30
    const carpenterCost = carpenterCount * REAL_TIME_DATA.labor.carpenter.rate * 30
    const electricianCost = electricianCount * REAL_TIME_DATA.labor.electrician.rate * 30

    // Calculate total material and labor costs
    const totalMaterialCost = cementCost + steelCost + sandCost + bricksCost
    const totalLaborCost = masonCost + helperCost + carpenterCost + electricianCost

    // Apply location factor
    const adjustedMaterialCost = totalMaterialCost * locationFactor * materialFactor
    const adjustedLaborCost = totalLaborCost * locationFactor * laborFactor

    // Calculate equipment costs
    const concreteHours = Math.min(sizeNum * 0.1, 24) // Cap at 24 hours per day
    const concreteUsageDays = Math.ceil((sizeNum * 0.1) / 24) // Calculate days needed
    const concreteHoursPerDay = Math.min(concreteHours, 8) // Realistic hours per day
    const concreteEquipmentCost = concreteHoursPerDay * concreteUsageDays * 500 // 500 per hour

    // Calculate equipment and overhead costs
    const equipmentCost = adjustedMaterialCost * 0.15
    const overheadCost = (adjustedMaterialCost + adjustedLaborCost) * 0.1

    // Calculate total project cost
    const totalProjectCost = adjustedMaterialCost + adjustedLaborCost + equipmentCost + overheadCost

    // Weather impact
    const weatherImpact = REAL_TIME_DATA.weather[location]

    // Generate optimization suggestions
    const suggestions = []

    // Check cement alternatives
    if (REAL_TIME_DATA.materials.cement.trend > 0) {
      suggestions.push({
        title: "Use eco-friendly cement",
        description: "PPC cement instead of OPC can save costs and reduce carbon footprint",
        saving: Math.round(cementCost * 0.1),
        environmental: true,
      })
    }

    // Check steel alternatives
    if (REAL_TIME_DATA.materials.steel.availability === "Low") {
      suggestions.push({
        title: "Consider alternative reinforcement",
        description: "Fiber-reinforced concrete can reduce steel requirements",
        saving: Math.round(steelCost * 0.05),
        environmental: true,
      })
    }

    // Check sand alternatives
    if (REAL_TIME_DATA.materials.sand.availability === "Low") {
      suggestions.push({
        title: "Use manufactured sand (M-Sand)",
        description: "M-Sand is a good alternative to river sand and more environmentally friendly",
        saving: Math.round(sandCost * 0.15),
        environmental: true,
      })
    }

    // Weather-based suggestion
    if (weatherImpact.delay > 0) {
      suggestions.push({
        title: `Delay project start by ${weatherImpact.delay} days`,
        description: `Avoiding ${weatherImpact.condition.toLowerCase()} conditions will prevent work delays and material damage`,
        saving: Math.round(totalProjectCost * 0.03),
        environmental: false,
      })
    }

    // Set the estimation result
    setEstimationResult({
      totalCost: totalProjectCost,
      materials: {
        cement: {
          quantity: cementQuantity,
          unit: "bags",
          cost: cementCost,
          trend: REAL_TIME_DATA.materials.cement.trend,
          availability: REAL_TIME_DATA.materials.cement.availability,
        },
        steel: {
          quantity: steelQuantity,
          unit: "tons",
          cost: steelCost,
          trend: REAL_TIME_DATA.materials.steel.trend,
          availability: REAL_TIME_DATA.materials.steel.availability,
        },
        sand: {
          quantity: sandQuantity,
          unit: "cubic meters",
          cost: sandCost,
          trend: REAL_TIME_DATA.materials.sand.trend,
          availability: REAL_TIME_DATA.materials.sand.availability,
        },
        bricks: {
          quantity: bricksQuantity,
          unit: "pieces",
          cost: bricksCost,
          trend: REAL_TIME_DATA.materials.bricks.trend,
          availability: REAL_TIME_DATA.materials.bricks.availability,
        },
      },
      labor: {
        total: totalLaborCost,
        breakdown: {
          mason: { count: masonCount, cost: masonCost, availability: REAL_TIME_DATA.labor.mason.availability },
          helper: { count: helperCount, cost: helperCost, availability: REAL_TIME_DATA.labor.helper.availability },
          carpenter: {
            count: carpenterCount,
            cost: carpenterCost,
            availability: REAL_TIME_DATA.labor.carpenter.availability,
          },
          electrician: {
            count: electricianCount,
            cost: electricianCost,
            availability: REAL_TIME_DATA.labor.electrician.availability,
          },
        },
      },
      equipment: equipmentCost,
      overhead: overheadCost,
      weather: weatherImpact,
      suggestions: suggestions,
      marketNews: REAL_TIME_DATA.marketNews.slice(0, 3),
    })
  }

  // Render weather icon based on condition
  const renderWeatherIcon = (condition) => {
    switch (condition) {
      case "Rain":
        return <CloudRain className="h-5 w-5 text-blue-400" />
      case "Clear":
        return <Sun className="h-5 w-5 text-amber-400" />
      case "Storm":
        return <Wind className="h-5 w-5 text-purple-400" />
      case "Extreme Heat":
        return <Thermometer className="h-5 w-5 text-red-400" />
      default:
        return <Sun className="h-5 w-5 text-amber-400" />
    }
  }

  // Render availability indicator
  const renderAvailability = (availability) => {
    const color =
      availability === "High" ? "text-green-400" : availability === "Medium" ? "text-amber-400" : "text-red-400"

    return <span className={color}>{availability}</span>
  }

  // Render trend indicator
  const renderTrend = (trend) => {
    if (trend > 0) {
      return (
        <span className="flex items-center text-red-400">
          <ArrowUp className="h-3 w-3 mr-1" />
          {trend}%
        </span>
      )
    } else if (trend < 0) {
      return (
        <span className="flex items-center text-green-400">
          <ArrowDown className="h-3 w-3 mr-1" />
          {Math.abs(trend)}%
        </span>
      )
    } else {
      return <span className="text-white">0%</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center gap-2">
          <Construction className="h-8 w-8 text-blue-400" />
          <h1 className="text-3xl font-bold">Real-Time Construction Cost Estimator</h1>
        </header>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          {/* Input Form */}
          <Card className="bg-gray-800 border-gray-700 lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white">Project Details</CardTitle>
              <CardDescription className="text-white">
                Enter your construction project details for real-time estimation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEstimate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="construction-type" className="text-white">
                    Construction Type
                  </Label>
                  <Select value={constructionType} onValueChange={setConstructionType} required>
                    <SelectTrigger id="construction-type" className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="building">Building</SelectItem>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size" className="text-white">
                    Size (sq ft)
                  </Label>
                  <Input
                    id="size"
                    type="number"
                    placeholder="e.g., 1500"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-white">
                    Location
                  </Label>
                  <Select value={location} onValueChange={setLocation} required>
                    <SelectTrigger id="location" className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Chennai">Chennai</SelectItem>
                      <SelectItem value="Kolkata">Kolkata</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                      <SelectItem value="Jaipur">Jaipur</SelectItem>
                      <SelectItem value="Lucknow">Lucknow</SelectItem>
                      <SelectItem value="Mangalore">Mangalore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Generate Real-Time Estimation"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Processing or Results */}
          <div className="lg:col-span-2">
            {isProcessing ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">AI Processing</CardTitle>
                  <CardDescription className="text-white">
                    Analyzing real-time data and generating estimation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={processingProgress} className="h-2" />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full ${processingStep >= 1 ? "bg-blue-500" : "bg-gray-600"}`}
                      ></div>
                      <span className={processingStep >= 1 ? "text-white" : "text-gray-400"}>
                        Retrieving live material costs & adjusting project expenses
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full ${processingStep >= 2 ? "bg-blue-500" : "bg-gray-600"}`}
                      ></div>
                      <span className={processingStep >= 2 ? "text-white" : "text-gray-400"}>
                        Fetching real-time labor wages & updating workforce expenses
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full ${processingStep >= 3 ? "bg-blue-500" : "bg-gray-600"}`}
                      ></div>
                      <span className={processingStep >= 3 ? "text-white" : "text-gray-400"}>
                        Analyzing weather forecast to determine potential delays
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full ${processingStep >= 4 ? "bg-blue-500" : "bg-gray-600"}`}
                      ></div>
                      <span className={processingStep >= 4 ? "text-white" : "text-gray-400"}>
                        Checking material availability; suggesting alternatives if needed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full ${processingStep >= 5 ? "bg-blue-500" : "bg-gray-600"}`}
                      ></div>
                      <span className={processingStep >= 5 ? "text-white" : "text-gray-400"}>
                        Factoring in market trends (price hikes or dips)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full ${processingStep >= 6 ? "bg-blue-500" : "bg-gray-600"}`}
                      ></div>
                      <span className={processingStep >= 6 ? "text-white" : "text-gray-400"}>
                        Providing a final estimation with an optimized budget, timeline, and resource plan
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-4 w-4 rounded-full ${processingStep >= 7 ? "bg-blue-500" : "bg-gray-600"}`}
                      ></div>
                      <span className={processingStep >= 7 ? "text-white" : "text-gray-400"}>
                        Recommending eco-friendly & cost-effective solutions
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : estimationResult ? (
              <div className="space-y-6">
                {/* Summary Card */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Estimation Summary</CardTitle>
                    <CardDescription className="text-white">
                      Real-time cost estimation for your {constructionType} project in {location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <div className="text-sm text-white mb-1">Total Estimated Cost</div>
                        <div className="text-2xl font-bold text-white">
                          ₹{formatIndianCurrency(Math.round(estimationResult.totalCost))}
                        </div>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <div className="text-sm text-white mb-1">Project Size</div>
                        <div className="text-2xl font-bold text-white">{size} sq ft</div>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg flex items-center">
                        <div>
                          <div className="text-sm text-white mb-1">Weather Impact</div>
                          <div className="flex items-center gap-2">
                            {renderWeatherIcon(estimationResult.weather.condition)}
                            <span className="text-lg font-medium text-white">{estimationResult.weather.condition}</span>
                          </div>
                        </div>
                        {estimationResult.weather.delay > 0 && (
                          <div className="ml-auto bg-red-900/30 px-2 py-1 rounded text-sm text-white">
                            +{estimationResult.weather.delay} days delay
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Breakdown */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Detailed Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="materials">
                      <TabsList className="bg-gray-700">
                        <TabsTrigger value="materials" className="data-[state=active]:bg-blue-600 text-white">
                          Materials
                        </TabsTrigger>
                        <TabsTrigger value="labor" className="data-[state=active]:bg-blue-600 text-white">
                          Labor
                        </TabsTrigger>
                        <TabsTrigger value="other" className="data-[state=active]:bg-blue-600 text-white">
                          Other Costs
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="materials" className="mt-4 space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 text-white">Material</th>
                                <th className="text-left py-3 px-4 text-white">Quantity</th>
                                <th className="text-left py-3 px-4 text-white">Cost</th>
                                <th className="text-left py-3 px-4 text-white">Price Trend</th>
                                <th className="text-left py-3 px-4 text-white">Availability</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-700">
                                <td className="py-3 px-4 text-white">Cement</td>
                                <td className="py-3 px-4 text-white">
                                  {estimationResult.materials.cement.quantity} {estimationResult.materials.cement.unit}
                                </td>
                                <td className="py-3 px-4 text-white">
                                  ₹{formatIndianCurrency(Math.round(estimationResult.materials.cement.cost))}
                                </td>
                                <td className="py-3 px-4">{renderTrend(estimationResult.materials.cement.trend)}</td>
                                <td className="py-3 px-4">
                                  {renderAvailability(estimationResult.materials.cement.availability)}
                                </td>
                              </tr>
                              <tr className="border-b border-gray-700">
                                <td className="py-3 px-4 text-white">Steel</td>
                                <td className="py-3 px-4 text-white">
                                  {estimationResult.materials.steel.quantity} {estimationResult.materials.steel.unit}
                                </td>
                                <td className="py-3 px-4 text-white">
                                  ₹{formatIndianCurrency(Math.round(estimationResult.materials.steel.cost))}
                                </td>
                                <td className="py-3 px-4">{renderTrend(estimationResult.materials.steel.trend)}</td>
                                <td className="py-3 px-4">
                                  {renderAvailability(estimationResult.materials.steel.availability)}
                                </td>
                              </tr>
                              <tr className="border-b border-gray-700">
                                <td className="py-3 px-4 text-white">Sand</td>
                                <td className="py-3 px-4 text-white">
                                  {estimationResult.materials.sand.quantity} {estimationResult.materials.sand.unit}
                                </td>
                                <td className="py-3 px-4 text-white">
                                  ₹{formatIndianCurrency(Math.round(estimationResult.materials.sand.cost))}
                                </td>
                                <td className="py-3 px-4">{renderTrend(estimationResult.materials.sand.trend)}</td>
                                <td className="py-3 px-4">
                                  {renderAvailability(estimationResult.materials.sand.availability)}
                                </td>
                              </tr>
                              <tr className="border-b border-gray-700">
                                <td className="py-3 px-4 text-white">Bricks</td>
                                <td className="py-3 px-4 text-white">
                                  {estimationResult.materials.bricks.quantity} {estimationResult.materials.bricks.unit}
                                </td>
                                <td className="py-3 px-4 text-white">
                                  ₹{formatIndianCurrency(Math.round(estimationResult.materials.bricks.cost))}
                                </td>
                                <td className="py-3 px-4">{renderTrend(estimationResult.materials.bricks.trend)}</td>
                                <td className="py-3 px-4">
                                  {renderAvailability(estimationResult.materials.bricks.availability)}
                                </td>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr className="bg-gray-700/50">
                                <td className="py-3 px-4 font-bold text-white" colSpan={2}>
                                  Total Material Cost
                                </td>
                                <td className="py-3 px-4 font-bold text-white">
                                  ₹
                                  {formatIndianCurrency(
                                    Math.round(
                                      estimationResult.materials.cement.cost +
                                        estimationResult.materials.steel.cost +
                                        estimationResult.materials.sand.cost +
                                        estimationResult.materials.bricks.cost,
                                    ),
                                  )}
                                </td>
                                <td className="py-3 px-4" colSpan={2}></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </TabsContent>

                      <TabsContent value="labor" className="mt-4 space-y-4">
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 text-white">Labor Type</th>
                                <th className="text-left py-3 px-4 text-white">Count</th>
                                <th className="text-left py-3 px-4 text-white">Cost</th>
                                <th className="text-left py-3 px-4 text-white">Availability</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-gray-700">
                                <td className="py-3 px-4 text-white">Mason</td>
                                <td className="py-3 px-4 text-white">{estimationResult.labor.breakdown.mason.count}</td>
                                <td className="py-3 px-4 text-white">
                                  ₹{formatIndianCurrency(Math.round(estimationResult.labor.breakdown.mason.cost))}
                                </td>
                                <td className="py-3 px-4">
                                  {renderAvailability(estimationResult.labor.breakdown.mason.availability)}
                                </td>
                              </tr>
                              <tr className="border-b border-gray-700">
                                <td className="py-3 px-4 text-white">Helper</td>
                                <td className="py-3 px-4 text-white">
                                  {estimationResult.labor.breakdown.helper.count}
                                </td>
                                <td className="py-3 px-4 text-white">
                                  ₹{formatIndianCurrency(Math.round(estimationResult.labor.breakdown.helper.cost))}
                                </td>
                                <td className="py-3 px-4">
                                  {renderAvailability(estimationResult.labor.breakdown.helper.availability)}
                                </td>
                              </tr>
                              <tr className="border-b border-gray-700">
                                <td className="py-3 px-4 text-white">Carpenter</td>
                                <td className="py-3 px-4 text-white">
                                  {estimationResult.labor.breakdown.carpenter.count}
                                </td>
                                <td className="py-3 px-4 text-white">
                                  ₹{formatIndianCurrency(Math.round(estimationResult.labor.breakdown.carpenter.cost))}
                                </td>
                                <td className="py-3 px-4">
                                  {renderAvailability(estimationResult.labor.breakdown.carpenter.availability)}
                                </td>
                              </tr>
                              <tr className="border-b border-gray-700">
                                <td className="py-3 px-4 text-white">Electrician</td>
                                <td className="py-3 px-4 text-white">
                                  {estimationResult.labor.breakdown.electrician.count}
                                </td>
                                <td className="py-3 px-4 text-white">
                                  ₹{formatIndianCurrency(Math.round(estimationResult.labor.breakdown.electrician.cost))}
                                </td>
                                <td className="py-3 px-4">
                                  {renderAvailability(estimationResult.labor.breakdown.electrician.availability)}
                                </td>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr className="bg-gray-700/50">
                                <td className="py-3 px-4 font-bold text-white" colSpan={2}>
                                  Total Labor Cost
                                </td>
                                <td className="py-3 px-4 font-bold text-white">
                                  ₹{formatIndianCurrency(Math.round(estimationResult.labor.total))}
                                </td>
                                <td className="py-3 px-4"></td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </TabsContent>

                      <TabsContent value="other" className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-white mb-2">Equipment Cost</h3>
                            <p className="text-2xl font-bold text-white">
                              ₹{formatIndianCurrency(Math.round(estimationResult.equipment))}
                            </p>
                            <p className="text-sm text-white mt-1">Includes machinery, tools, and equipment rental</p>
                          </div>
                          <div className="bg-gray-700 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-white mb-2">Overhead Cost</h3>
                            <p className="text-2xl font-bold text-white">
                              ₹{formatIndianCurrency(Math.round(estimationResult.overhead))}
                            </p>
                            <p className="text-sm text-white mt-1">
                              Includes permits, supervision, and miscellaneous expenses
                            </p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Optimization Suggestions */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Optimization Suggestions</CardTitle>
                    <CardDescription className="text-white">
                      AI-powered recommendations to optimize your project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {estimationResult.suggestions.map((suggestion, index) => (
                        <div key={index} className="bg-blue-600/20 p-4 rounded-lg border border-blue-600/30">
                          <div className="flex items-start gap-2">
                            <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                              <CheckCircle className="h-4 w-4 text-blue-400" />
                            </div>
                            <div>
                              <h3 className="font-medium text-white">{suggestion.title}</h3>
                              <p className="text-sm text-white mt-1">{suggestion.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-green-400 text-sm">
                                  Saves ₹{formatIndianCurrency(suggestion.saving)}
                                </span>
                                {suggestion.environmental && (
                                  <span className="bg-green-900/30 text-green-400 text-xs px-2 py-1 rounded">
                                    Eco-friendly
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Market Trends */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Market Insights</CardTitle>
                    <CardDescription className="text-white">
                      Recent market trends affecting construction costs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {estimationResult.marketNews.map((news, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="rounded-full bg-amber-600/30 p-1 mt-0.5">
                            <AlertCircle className="h-4 w-4 text-amber-400" />
                          </div>
                          <p className="text-white">{news}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Final Recommendation */}
                <Card className="bg-blue-600/20 border border-blue-600/30">
                  <CardHeader>
                    <CardTitle className="text-white">Final Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white">
                      Based on our real-time analysis of material costs, labor availability, weather conditions, and
                      market trends, we recommend proceeding with your {constructionType} project in {location} with the
                      optimizations suggested above.
                      {estimationResult.weather.delay > 0
                        ? ` Consider delaying the project start by ${estimationResult.weather.delay} days to avoid ${estimationResult.weather.condition.toLowerCase()} conditions.`
                        : " Weather conditions are favorable for starting construction immediately."}
                    </p>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Estimation Report</Button>
                      <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/20">
                        Request Contractor Quotes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-gray-800 border-gray-700 h-full flex flex-col justify-center items-center p-8">
                <Construction className="h-16 w-16 text-blue-400 mb-4" />
                <CardTitle className="text-white text-center">Real-Time Construction Cost Estimator</CardTitle>
                <CardDescription className="text-white text-center mt-2 max-w-md">
                  Enter your project details on the left to get an AI-powered real-time cost estimation with
                  optimization suggestions
                </CardDescription>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
