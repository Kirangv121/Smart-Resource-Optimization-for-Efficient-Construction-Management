"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Info,
  CloudRain,
  Clock,
  BookOpen,
  UserPlus,
  Zap,
} from "lucide-react"
import { useState } from "react"

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

export function LaborOptimizationSuggestions({ suggestions, workerTypes, originalPlan, adjustedPlan }) {
  const [expandedSuggestion, setExpandedSuggestion] = useState(null)

  // Toggle the expanded state of a suggestion
  const toggleExpand = (index) => {
    if (expandedSuggestion === index) {
      setExpandedSuggestion(null)
    } else {
      setExpandedSuggestion(index)
    }
  }

  // Cost difference between original and adjusted plans
  const costDifference = adjustedPlan.totalLaborCost - originalPlan.totalLaborCost
  const costPercentage = (costDifference / originalPlan.totalLaborCost) * 100

  // Count workers by skill level
  const countWorkersBySkill = (labor) => {
    const counts = { Skilled: 0, Unskilled: 0, Management: 0 }

    Object.keys(labor).forEach((workerType) => {
      const skill = workerTypes[workerType].skill
      counts[skill] = (counts[skill] || 0) + labor[workerType]
    })

    return counts
  }

  const originalCounts = countWorkersBySkill(originalPlan.labor)
  const adjustedCounts = countWorkersBySkill(adjustedPlan.labor)

  // Get the appropriate icon for a suggestion type
  const getSuggestionIcon = (type) => {
    switch (type) {
      case "labor-adjustment":
        return <Users className="h-5 w-5 text-blue-400" />
      case "schedule-adjustment":
        return <Calendar className="h-5 w-5 text-green-400" />
      case "cross-training":
        return <BookOpen className="h-5 w-5 text-purple-400" />
      case "standby-labor":
        return <UserPlus className="h-5 w-5 text-amber-400" />
      default:
        return <Info className="h-5 w-5 text-blue-400" />
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Labor Optimization Suggestions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-2">Weather Impact Cost</h3>
              <div className="text-xl font-bold text-white">₹{formatIndianCurrency(Math.round(costDifference))}</div>
              <div className={`text-sm ${costPercentage > 0 ? "text-amber-400" : "text-green-400"}`}>
                {costPercentage > 0 ? "+" : ""}
                {costPercentage.toFixed(1)}% from standard plan
              </div>
              <div className="mt-3">
                <div className="text-white/70 text-xs mb-1">Impact on Total Project Budget</div>
                <Progress value={Math.min(Math.abs(costPercentage) * 2, 100)} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-2">Skilled Labor Adjustment</h3>
              <div className="text-xl font-bold text-white">
                {adjustedCounts.Skilled - originalCounts.Skilled > 0 ? "+" : ""}
                {adjustedCounts.Skilled - originalCounts.Skilled} Workers
              </div>
              <div className="text-sm text-white/70">{adjustedCounts.Skilled} total skilled workers needed</div>
              <div className="mt-3">
                <div className="text-white/70 text-xs mb-1">Skilled Labor Availability</div>
                <div className="flex items-center gap-2">
                  <Progress value={65} className="h-2 flex-grow" />
                  <span className="text-white/70 text-xs">65%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-2">Unskilled Labor Adjustment</h3>
              <div className="text-xl font-bold text-white">
                {adjustedCounts.Unskilled - originalCounts.Unskilled > 0 ? "+" : ""}
                {adjustedCounts.Unskilled - originalCounts.Unskilled} Workers
              </div>
              <div className="text-sm text-white/70">{adjustedCounts.Unskilled} total unskilled workers needed</div>
              <div className="mt-3">
                <div className="text-white/70 text-xs mb-1">Unskilled Labor Availability</div>
                <div className="flex items-center gap-2">
                  <Progress value={85} className="h-2 flex-grow" />
                  <span className="text-white/70 text-xs">85%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weather Impact Overview */}
        <Alert className="bg-blue-600/20 border-blue-600/30">
          <CloudRain className="h-4 w-4 text-blue-400" />
          <AlertTitle className="text-white">Weather Impact Analysis</AlertTitle>
          <AlertDescription className="text-white/70">
            Based on the weather forecast, your project will require adjustment to labor resources and scheduling to
            maintain the timeline. Below are AI-powered optimization suggestions to mitigate weather-related delays and
            optimize labor efficiency.
          </AlertDescription>
        </Alert>

        {/* Optimization Suggestions */}
        <div className="space-y-4">
          <h3 className="text-white font-medium">AI-Powered Optimization Suggestions</h3>
          {suggestions.map((suggestion, index) => (
            <div key={index} className="bg-gray-700 border border-gray-600 rounded-lg overflow-hidden">
              <div className="p-4 cursor-pointer flex justify-between items-start" onClick={() => toggleExpand(index)}>
                <div className="flex gap-3">
                  {getSuggestionIcon(suggestion.type)}
                  <div>
                    <h4 className="text-white font-medium mb-1">
                      {suggestion.phase
                        ? `${suggestion.phase} Phase: ${suggestion.description.split(":")[0]}`
                        : suggestion.description}
                    </h4>
                    <p className="text-white/70 text-sm">{suggestion.impact}</p>
                  </div>
                </div>
                <div>
                  <div className={`transform transition-transform ${expandedSuggestion === index ? "rotate-90" : ""}`}>
                    <ArrowRight className="h-5 w-5 text-white/70" />
                  </div>
                </div>
              </div>

              {expandedSuggestion === index && (
                <div className="border-t border-gray-600 p-4 bg-gray-800/50">
                  {suggestion.type === "labor-adjustment" && suggestion.changes && (
                    <div className="space-y-3">
                      <h5 className="text-white font-medium">Recommended Labor Adjustments:</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {Object.entries(suggestion.changes).map(([workerType, count], i) => (
                          <div
                            key={i}
                            className="bg-blue-900/30 border border-blue-500 p-3 rounded-lg flex justify-between items-center"
                          >
                            <span className="text-white">{workerTypes[workerType]?.title || workerType}:</span>
                            <Badge className="bg-green-600">+{count} workers</Badge>
                          </div>
                        ))}
                      </div>
                      <div className="bg-blue-600/20 p-3 rounded-lg">
                        <p className="text-white/70">
                          Implement these workforce adjustments during {suggestion.phase} phase to compensate for
                          weather-related productivity losses and maintain project timeline.
                        </p>
                      </div>
                    </div>
                  )}

                  {suggestion.type === "schedule-adjustment" && (
                    <div className="space-y-3">
                      <h5 className="text-white font-medium">Scheduling Strategy:</h5>
                      <div className="bg-gray-700 p-3 rounded-lg">
                        <div className="flex gap-2 mb-2">
                          <Calendar className="h-5 w-5 text-blue-400" />
                          <span className="text-white font-medium">Weather-Sensitive Work:</span>
                        </div>
                        <p className="text-white/70 mb-2">
                          Schedule weather-sensitive tasks during forecasted good weather periods.
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="bg-green-900/30 border border-green-500 p-2 rounded text-center">
                            <div className="text-white/70 text-xs">Optimal Weather Days</div>
                            <div className="text-white font-medium">External Construction</div>
                          </div>
                          <div className="bg-red-900/30 border border-red-500 p-2 rounded text-center">
                            <div className="text-white/70 text-xs">Poor Weather Days</div>
                            <div className="text-white font-medium">Internal Work</div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-600/20 p-3 rounded-lg">
                        <p className="text-white/70">
                          This flexible scheduling approach ensures maximum productivity despite adverse weather
                          conditions, reducing overall project delays.
                        </p>
                      </div>
                    </div>
                  )}

                  {suggestion.type === "cross-training" && suggestion.workerTypes && (
                    <div className="space-y-3">
                      <h5 className="text-white font-medium">Cross-Training Program:</h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {suggestion.workerTypes.map((type, i) => (
                          <div key={i} className="bg-purple-900/30 border border-purple-500 p-3 rounded-lg">
                            <div className="text-white font-medium mb-1">{workerTypes[type]?.title || type}</div>
                            <div className="text-white/70 text-sm">
                              Cross-train {workerTypes[type]?.skill === "Skilled" ? "Unskilled" : "Skilled"} workers for
                              basic {workerTypes[type]?.title.toLowerCase()} tasks.
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-blue-600/20 p-3 rounded-lg">
                        <p className="text-white/70">
                          Cross-training increases workforce flexibility and reduces dependency on specialized workers
                          during weather disruptions.
                        </p>
                      </div>
                    </div>
                  )}

                  {suggestion.type === "standby-labor" && (
                    <div className="space-y-3">
                      <h5 className="text-white font-medium">On-Call Labor Strategy:</h5>
                      <div className="bg-amber-900/30 border border-amber-500 p-3 rounded-lg">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-amber-400" />
                            <span className="text-white">24-48 hour mobilization period</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-amber-400" />
                            <span className="text-white">
                              {Math.round(Object.values(adjustedPlan.labor).reduce((a, b) => a + b, 0) * 0.15)} workers
                              on standby (15% of total workforce)
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-amber-400" />
                            <span className="text-white">Quick scaling during good weather windows</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-600/20 p-3 rounded-lg">
                        <p className="text-white/70">
                          Maintaining a pool of on-call workers allows for rapid scaling during favorable weather
                          conditions, helping to accelerate progress and recover from weather-related delays.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex justify-end">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Apply Suggestion
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Implementation Plan */}
        <Card className="bg-gray-700 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white text-lg">Implementation Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600/30 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Immediate Actions (Within 7 Days)</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-white/70">
                    <li>Update labor requirements based on weather-adjusted plan</li>
                    <li>Contact labor contractors to ensure availability of additional workforce</li>
                    <li>
                      Revise construction schedule to prioritize weather-sensitive tasks during favorable conditions
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-600/30 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Short-Term Actions (Within 30 Days)</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-white/70">
                    <li>Implement cross-training program for existing workforce</li>
                    <li>Establish on-call worker agreements with labor contractors</li>
                    <li>Prepare indoor work areas for productivity during adverse weather</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-600/30 p-2 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">Ongoing Actions</h4>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-white/70">
                    <li>Weekly review of weather forecasts and adjustment of labor allocation</li>
                    <li>Daily monitoring of productivity and labor utilization</li>
                    <li>Regular assessment of cross-training effectiveness</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost-Benefit Analysis */}
        <Alert className="bg-green-600/20 border-green-600/30">
          <TrendingUp className="h-4 w-4 text-green-400" />
          <AlertTitle className="text-white">Cost-Benefit Analysis</AlertTitle>
          <AlertDescription className="text-white/70">
            The additional cost of ₹{formatIndianCurrency(Math.round(costDifference))} for weather-adjusted labor is
            significantly less than the potential cost of project delays due to weather disruptions, estimated at ₹
            {formatIndianCurrency(Math.round(originalPlan.totalLaborCost * 0.2))} (20% of standard labor cost).
            Implementing these suggestions will result in a net benefit of approximately ₹
            {formatIndianCurrency(Math.round(originalPlan.totalLaborCost * 0.2 - costDifference))}.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
