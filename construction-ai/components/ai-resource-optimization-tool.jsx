"use client"

import { AlertDescription } from "@/components/ui/alert"

import { AlertTitle } from "@/components/ui/alert"

import { Alert } from "@/components/ui/alert"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

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

const sampleOptimizationResults = {
  optimizedCost: 4500000, // Updated total cost after optimization
  materialSavings: 150000,
  laborSavings: 80000,
  equipmentSavings: 30000,
  totalSavings: 260000,
  timelineReduction: "2 weeks",
  sustainabilityScoreImprovement: "+15%",
  weatherAdjusted: true,
  recommendations: [
    {
      type: "Material",
      description: "Use locally sourced materials to reduce transportation costs and carbon footprint.",
      savings: "₹50,000",
    },
    {
      type: "Labor",
      description: "Optimize labor schedules to reduce overtime costs.",
      savings: "₹30,000",
    },
    {
      type: "Equipment",
      description: "Use more energy-efficient equipment to reduce fuel consumption.",
      savings: "₹15,000",
    },
  ],
}

export function AIResourceOptimizationTool({ projectDetails, onOptimizationComplete }) {
  const [optimizationPriority, setOptimizationPriority] = useState("cost") // cost, time, sustainability
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationResults, setOptimizationResults] = useState(null)
  const [showAlert, setShowAlert] = useState(false)

  // useEffect to simulate optimization and update results
  useEffect(() => {
    if (isOptimizing) {
      // Simulate optimization process
      setTimeout(() => {
        // You would replace this with actual optimization logic
        setOptimizationResults(sampleOptimizationResults) // loading dummy data
        setIsOptimizing(false)
        setShowAlert(true) // set alert to true when optimization is complete
        onOptimizationComplete(sampleOptimizationResults) // Pass to parent component

        console.log("Optimization complete!")
      }, 2500)
    }
  }, [isOptimizing, onOptimizationComplete])

  // Handle optimization
  const handleOptimize = async () => {
    setIsOptimizing(true)
    setShowAlert(false)
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">AI-Powered Resource Optimization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Optimization Priority Setting */}
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Optimization Priority</h3>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="priority"
                  value="cost"
                  checked={optimizationPriority === "cost"}
                  onChange={() => setOptimizationPriority("cost")}
                />
                <span className="ml-2 text-white">Cost Reduction</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="priority"
                  value="time"
                  checked={optimizationPriority === "time"}
                  onChange={() => setOptimizationPriority("time")}
                />
                <span className="ml-2 text-white">Time Reduction</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="priority"
                  value="sustainability"
                  checked={optimizationPriority === "sustainability"}
                  onChange={() => setOptimizationPriority("sustainability")}
                />
                <span className="ml-2 text-white">Sustainability</span>
              </label>
            </div>
          </div>

          {/* Project Overview */}
          <div>
            <h3 className="text-lg font-medium text-white mb-2">Project Overview</h3>
            {projectDetails ? (
              <>
                <div className="text-white">Total Cost: ₹{formatIndianCurrency(projectDetails.totalCost)}</div>
                <div className="text-white">Duration: {projectDetails.duration}</div>
                <div className="text-white">Location: {projectDetails.location}</div>
              </>
            ) : (
              <div className="text-gray-400">No project details available</div>
            )}
          </div>

          {/* Optimize Button */}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleOptimize}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Optimizing...
              </>
            ) : (
              "Run AI Optimization"
            )}
          </Button>

          {/* Alert after optimization */}
          {showAlert && (
            <Alert className="bg-green-900/30 border-green-500">
              <AlertTitle className="text-green-400">Optimization Complete!</AlertTitle>
              <AlertDescription className="text-green-400">
                Resources have been optimized based on your project and weather data.
              </AlertDescription>
            </Alert>
          )}

          {/* Display Optimization Results */}
          {optimizationResults && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-2">Optimization Results</h3>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Reduced Costs */}
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-white">Reduced Costs</h4>
                    <div className="text-2xl font-bold text-green-400">
                      ₹{formatIndianCurrency(optimizationResults.optimizedCost)}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Savings: ₹{formatIndianCurrency(optimizationResults.totalSavings)}
                    </div>
                  </div>

                  {/* Timeline Reduction */}
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-medium text-white">Timeline Reduction</h4>
                    <div className="text-2xl font-bold text-green-400">{optimizationResults.timelineReduction}</div>
                    <div className="text-sm text-gray-400 mt-1">
                      Project completed ahead of schedule by {optimizationResults.timelineReduction}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-4">
                  <h4 className="text-md font-semibold text-white">Recommendations</h4>
                  <ul className="list-disc pl-5 mt-2">
                    {optimizationResults.recommendations.map((recommendation, index) => (
                      <li key={index} className="text-gray-400">
                        {recommendation.description} (Savings: {recommendation.savings})
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
