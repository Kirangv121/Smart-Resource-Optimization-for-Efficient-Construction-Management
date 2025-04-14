"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BrainCircuit, Loader2, Package, Truck, Users, AlertTriangle } from "lucide-react"
import { AIResourceOptimizationTool } from "@/components/ai-resource-optimization-tool"

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

export default function ResourcePrediction() {
const [isLoading, setIsLoading] = useState(false)
const [activeTab, setActiveTab] = useState("materials")
const [projectType, setProjectType] = useState("")
const [projectSize, setProjectSize] = useState("")
const [location, setLocation] = useState("")
const [predictionResult, setPredictionResult] = useState(null)
const [confidenceLevel, setConfidenceLevel] = useState(0)
const [optimizationResults, setOptimizationResults] = useState(null) // Store optimization results
const [areDimensionsSet, setAreDimensionsSet] = useState(false) // To track if the dimensions are set

// Function to set site dimensions from parent components
const setSiteDimensions = (dimensions) => {
  setProjectSize(dimensions.length * dimensions.width) // Calculate a new project size
  setAreDimensionsSet(true) // Mark dimensions as set
}

// Run prediction
const runPrediction = () => {
  if (!projectType || !projectSize || !location) return

  setIsLoading(true)

  // Simulate API call to prediction model
  setTimeout(() => {
    // Generate prediction results based on inputs
    const result = generatePredictionResults(projectType, projectSize, location)
    setPredictionResult(result)
    setConfidenceLevel(85)
    setIsLoading(false)
  }, 2500)
}

// Function to handle results from AIResourceOptimizationTool
const handleOptimizationComplete = (results) => {
  setOptimizationResults(results)
}

// Generate prediction results
const generatePredictionResults = (type, size, loc) => {
  // Base rates for different project types (per sq ft)
  const baseRates = {
    house: {
      materials: 1200,
      labor: 800,
      equipment: 300,
      timeline: 0.15, // days per sq ft
      materialBreakdown: {
        cement: 0.4, // bags per sq ft
        steel: 0.008, // tons per sq ft
        bricks: 10, // pieces per sq ft
        sand: 0.06, // cubic meters per sq ft
        aggregate: 0.08, // cubic meters per sq ft
      },
      laborBreakdown: {
        mason: 0.04, // worker-days per sq ft
        helper: 0.08, // worker-days per sq ft
        carpenter: 0.02, // worker-days per sq ft
        electrician: 0.01, // worker-days per sq ft
        plumber: 0.01, // worker-days per sq ft
      },
    },
    building: {
      materials: 1500,
      labor: 1000,
      equipment: 500,
      timeline: 0.2, // days per sq ft
      materialBreakdown: {
        cement: 0.5, // bags per sq ft
        steel: 0.012, // tons per sq ft
        bricks: 12, // pieces per sq ft
        sand: 0.08, // cubic meters per sq ft
        aggregate: 0.1, // cubic meters per sq ft
      },
      laborBreakdown: {
        mason: 0.05, // worker-days per sq ft
        helper: 0.1, // worker-days per sq ft
        carpenter: 0.025, // worker-days per sq ft
        electrician: 0.015, // worker-days per sq ft
        plumber: 0.015, // worker-days per sq ft
      },
    },
    commercial: {
      materials: 1800,
      labor: 1200,
      equipment: 700,
      timeline: 0.25, // days per sq ft
      materialBreakdown: {
        cement: 0.6, // bags per sq ft
        steel: 0.015, // tons per sq ft
        bricks: 8, // pieces per sq ft
        sand: 0.09, // cubic meters per sq ft
        aggregate: 0.12, // cubic meters per sq ft
      },
      laborBreakdown: {
        mason: 0.06, // worker-days per sq ft
        helper: 0.12, // worker-days per sq ft
        carpenter: 0.03, // worker-days per sq ft
        electrician: 0.02, // worker-days per sq ft
        plumber: 0.02, // worker-days per sq ft
      },
    },
  }

  // Location factors
  const locationFactors = {
    mumbai: 1.3,
    delhi: 1.2,
    bangalore: 1.25,
    chennai: 1.15,
    kolkata: 1.1,
    hyderabad: 1.2,
    pune: 1.15,
    ahmedabad: 1.05,
    jaipur: 1,
    lucknow: 0.95,
  }

  // Parse size to number
  const sizeNum = Number.parseInt(size)

  // Get base rates for project type
  const baseRate = baseRates[type]

  // Get location factor
  const locationFactor = locationFactors[loc.toLowerCase()] || 1

  // Calculate material costs
  const materialCost = baseRate.materials * sizeNum * locationFactor

  // Calculate labor costs
  const laborCost = baseRate.labor * sizeNum * locationFactor

  // Calculate equipment costs
  const equipmentCost = baseRate.equipment * sizeNum * locationFactor

  // Calculate overhead costs (20% of direct costs)
  const overheadCost = (materialCost + laborCost + equipmentCost) * 0.2

  // Calculate total cost
  const totalCost = materialCost + laborCost + equipmentCost + overheadCost

  // Calculate timeline
  const timeline = Math.ceil(baseRate.timeline * sizeNum)

  // Calculate material quantities
  const materialQuantities = {}
  Object.entries(baseRate.materialBreakdown).forEach(([material, rate]) => {
    materialQuantities[material] = Math.round(rate * sizeNum * 10) / 10
  })

  // Calculate labor requirements
  const laborRequirements = {}
  Object.entries(baseRate.laborBreakdown).forEach(([labor, rate]) => {
    laborRequirements[labor] = Math.ceil(rate * sizeNum)
  })

  // Calculate equipment needs
  const equipmentNeeds = [
    { name: "Concrete Mixer", days: Math.ceil(timeline * 0.3), dailyRate: 1500 },
    { name: "Excavator", days: Math.ceil(timeline * 0.1), dailyRate: 8000 },
    { name: "Scaffolding", days: Math.ceil(timeline * 0.7), dailyRate: 500 },
    { name: "Crane", days: type === "building" ? Math.ceil(timeline * 0.5) : 0, dailyRate: 12000 },
    { name: "Power Tools", days: timeline, dailyRate: 300 },
  ].filter((item) => item.days > 0)

  // Calculate carbon footprint
  const carbonFootprint = {
    cement: materialQuantities.cement * 100, // kg CO2 per bag
    steel: materialQuantities.steel * 1800, // kg CO2 per ton
    transport: sizeNum * 0.5, // kg CO2 per sq ft
    equipment: equipmentNeeds.reduce((sum, item) => sum + item.days * 50, 0), // kg CO2 per day
    total: 0,
  }
  carbonFootprint.total =
    carbonFootprint.cement + carbonFootprint.steel + carbonFootprint.transport + carbonFootprint.equipment

  // Calculate water usage
  const waterUsage = sizeNum * 0.3 // kiloliters

  return {
    projectType: type,
    projectSize: sizeNum,
    location: loc,
    costs: {
      materials: materialCost,
      labor: laborCost,
      equipment: equipmentCost,
      overhead: overheadCost,
      total: totalCost,
    },
    timeline: timeline,
    materials: materialQuantities,
    labor: laborRequirements,
    equipment: equipmentNeeds,
    sustainability: {
      carbonFootprint: carbonFootprint,
      waterUsage: waterUsage,
    },
    riskFactors: [
      {
        factor: "Weather Delays",
        probability: loc.toLowerCase() === "mumbai" ? "High" : "Medium",
        impact: "Moderate",
      },
      { factor: "Material Price Volatility", probability: "Medium", impact: "High" },
      { factor: "Labor Availability", probability: "Low", impact: "High" },
      { factor: "Permit Delays", probability: "Medium", impact: "High" },
    ],
  }
}

return (
  <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
    <div className="max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">AI Resource Prediction</h1>
        </div>
        <p className="text-white mt-2">Predict resource requirements for your construction project</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-type" className="text-white">
                  Project Type
                </Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger id="project-type" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="building">Building</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="project-size" className="text-white">
                  Project Size (sq ft)
                </Label>
                <Input
                  id="project-size"
                  type="number"
                  placeholder="e.g., 2000"
                  value={projectSize}
                  onChange={(e) => setProjectSize(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-white">
                  Location
                </Label>
                <Select value={location} onValueChange={setLocation}>
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
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 mt-4"
                onClick={runPrediction}
                disabled={isLoading || !projectType || !projectSize || !location}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="h-4 w-4" />
                    Generate Prediction
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Data Sources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Historical Projects</span>
                <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded-full text-xs">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Market Prices</span>
                <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded-full text-xs">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Regional Factors</span>
                <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded-full text-xs">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Weather Patterns</span>
                <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded-full text-xs">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white">Sustainability Metrics</span>
                <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded-full text-xs">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 space-y-6">
          {isLoading ? (
            <Card className="bg-gray-800 border-gray-700 min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-400" />
                <h3 className="text-xl font-medium text-white">Generating Prediction</h3>
                <p className="text-white/70 mt-2">
                  Our AI is analyzing historical data and generating resource predictions...
                </p>
                <div className="w-64 mx-auto mt-6">
                  <Progress value={confidenceLevel} className="h-2" />
                  <div className="flex justify-between mt-2 text-xs text-white/70">
                    <span>Processing Data</span>
                    <span>Building Model</span>
                    <span>Finalizing</span>
                  </div>
                </div>
              </div>
            </Card>
          ) : !predictionResult ? (
            <Card className="bg-gray-800 border-gray-700 min-h-[400px] flex items-center justify-center">
              <div className="text-center p-8">
                <BrainCircuit className="h-12 w-12 mx-auto mb-4 text-blue-400" />
                <h3 className="text-xl font-medium text-white">Enter Project Details</h3>
                <p className="text-white/70 mt-2">
                  Fill in your project information on the left to generate AI-powered resource predictions.
                </p>
              </div>
            </Card>
          ) : (
            <>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-white">Resource Prediction Results</CardTitle>
                      <CardDescription className="text-white">
                        AI-generated resource requirements for your {predictionResult.projectType} project
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm">Confidence Level:</span>
                      <div className="px-2 py-1 bg-green-600/30 text-green-400 rounded-full text-xs">
                        {confidenceLevel}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-white mb-2">Total Cost</h3>
                      <div className="text-3xl font-bold text-white">
                        ₹{formatIndianCurrency(Math.round(predictionResult.costs.total))}
                      </div>
                      <div className="text-white/70 text-sm mt-1">
                        ₹
                        {formatIndianCurrency(
                          Math.round(predictionResult.costs.total / predictionResult.projectSize),
                        )}{" "}
                        per sq ft
                      </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-white mb-2">Timeline</h3>
                      <div className="text-3xl font-bold text-white">{predictionResult.timeline} days</div>
                      <div className="text-white/70 text-sm mt-1">
                        Approximately {Math.ceil(predictionResult.timeline / 30)} months
                      </div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-white mb-2">Carbon Footprint</h3>
                      <div className="text-3xl font-bold text-white">
                        {Math.round(predictionResult.sustainability.carbonFootprint.total / 1000)} tons
                      </div>
                      <div className="text-white/70 text-sm mt-1">
                        {Math.round(
                          predictionResult.sustainability.carbonFootprint.total / predictionResult.projectSize,
                        )}{" "}
                        kg CO₂ per sq ft
                      </div>
                    </div>
                  </div>

                  <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-gray-700 grid grid-cols-4">
                      <TabsTrigger value="materials" className="data-[state=active]:bg-blue-600 text-white">
                        <Package className="h-4 w-4 mr-2" />
                        Materials
                      </TabsTrigger>
                      <TabsTrigger value="labor" className="data-[state=active]:bg-blue-600 text-white">
                        <Users className="h-4 w-4 mr-2" />
                        Labor
                      </TabsTrigger>
                      <TabsTrigger value="equipment" className="data-[state=active]:bg-blue-600 text-white">
                        <Truck className="h-4 w-4 mr-2" />
                        Equipment
                      </TabsTrigger>
                      <TabsTrigger value="risks" className="data-[state=active]:bg-blue-600 text-white">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Risks
                      </TabsTrigger>
                    </TabsList>

                    {/* Materials Tab */}
                    <TabsContent value="materials" className="mt-6">
                      {/* Materials Section Content Here */}
                    </TabsContent>

                    {/* Labor Tab */}
                    <TabsContent value="labor" className="mt-6">
                      {/* Labor Section Content Here */}
                    </TabsContent>

                    {/* Equipment Tab */}
                    <TabsContent value="equipment" className="mt-6">
                      {/* Equipment Section Content Here */}
                    </TabsContent>

                    {/* Risks Tab */}
                    <TabsContent value="risks" className="mt-6">
                      {/* Risks Section Content Here */}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Embed the AIResourceOptimizationTool */}
              {predictionResult && (
                <AIResourceOptimizationTool
                  projectDetails={predictionResult}
                  onOptimizationComplete={handleOptimizationComplete}
                />
              )}
              {/* Display optimization results if available */}
              {optimizationResults && (
               <Card className="bg-gray-800 border-gray-700">
                 <CardHeader>
                   <CardTitle className="text-white">
                     Optimized Results
                   </CardTitle>
                 </CardHeader>
                 <CardContent>
                   {/* Display optimization results here */}
                   <p className="text-white">
                     Savings: ₹{formatIndianCurrency(optimizationResults.totalSavings)}
                   </p>
                 </CardContent>
               </Card>
             )}
          </>
        )}
      </div>
    </div>
  </div>
)
}
