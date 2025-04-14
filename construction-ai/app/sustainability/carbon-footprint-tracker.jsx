"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Leaf, TrendingDown, TrendingUp, AlertCircle, BarChart3 } from "lucide-react"

export function CarbonFootprintTracker() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  useEffect(() => {
    // Simulate API call to fetch carbon footprint data
    const fetchData = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data
      const mockData = {
        week: {
          total: 2450,
          target: 3000,
          previousPeriod: 2800,
          breakdown: {
            materials: 1200,
            transportation: 650,
            energy: 450,
            waste: 150,
          },
          dailyData: [
            { day: "Mon", value: 400 },
            { day: "Tue", value: 350 },
            { day: "Wed", value: 450 },
            { day: "Thu", value: 300 },
            { day: "Fri", value: 500 },
            { day: "Sat", value: 250 },
            { day: "Sun", value: 200 },
          ],
          insights: [
            {
              type: "positive",
              text: "Reduced concrete usage saved 350kg CO2e this week",
            },
            {
              type: "warning",
              text: "Transportation emissions increased by 15% on Thursday",
            },
          ],
        },
        month: {
          total: 10500,
          target: 12000,
          previousPeriod: 13200,
          breakdown: {
            materials: 5200,
            transportation: 2800,
            energy: 1800,
            waste: 700,
          },
          dailyData: [
            { day: "Week 1", value: 2800 },
            { day: "Week 2", value: 2500 },
            { day: "Week 3", value: 2700 },
            { day: "Week 4", value: 2500 },
          ],
          insights: [
            {
              type: "positive",
              text: "20% reduction in overall carbon footprint compared to last month",
            },
            {
              type: "positive",
              text: "Switching to local suppliers reduced transportation emissions by 25%",
            },
            {
              type: "warning",
              text: "Concrete usage still accounts for 40% of material emissions",
            },
          ],
        },
        project: {
          total: 45000,
          target: 50000,
          previousPeriod: 60000,
          breakdown: {
            materials: 22000,
            transportation: 12000,
            energy: 8000,
            waste: 3000,
          },
          dailyData: [
            { day: "Phase 1", value: 15000 },
            { day: "Phase 2", value: 12000 },
            { day: "Phase 3", value: 10000 },
            { day: "Phase 4", value: 8000 },
          ],
          insights: [
            {
              type: "positive",
              text: "On track to achieve 25% carbon reduction compared to similar projects",
            },
            {
              type: "positive",
              text: "Sustainable material choices saved 8000kg CO2e to date",
            },
            {
              type: "warning",
              text: "Final phase needs optimization to meet target",
            },
          ],
        },
      }

      setData(mockData)
      setLoading(false)
    }

    fetchData()
  }, [])

  const handlePeriodChange = (value) => {
    setSelectedPeriod(value)
  }

  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carbon Footprint Tracker</CardTitle>
          <CardDescription>Loading carbon footprint data...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentData = data[selectedPeriod]
  const percentageOfTarget = Math.round((currentData.total / currentData.target) * 100)
  const changeFromPrevious = Math.round(
    ((currentData.previousPeriod - currentData.total) / currentData.previousPeriod) * 100,
  )

  // Calculate breakdown percentages
  const totalBreakdown = Object.values(currentData.breakdown).reduce((sum, value) => sum + value, 0)
  const breakdownPercentages = {}
  Object.entries(currentData.breakdown).forEach(([key, value]) => {
    breakdownPercentages[key] = Math.round((value / totalBreakdown) * 100)
  })

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Carbon Footprint Tracker</CardTitle>
            <CardDescription>Monitor and reduce your project's carbon emissions</CardDescription>
          </div>
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="project">Entire Project</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium">Total Carbon Footprint</h3>
                <p className="text-sm text-gray-500">
                  {selectedPeriod === "week"
                    ? "This week"
                    : selectedPeriod === "month"
                      ? "This month"
                      : "Current project"}
                </p>
              </div>
              <Badge
                className={
                  changeFromPrevious > 0
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-red-100 text-red-800 border-red-300"
                }
              >
                {changeFromPrevious > 0 ? (
                  <TrendingDown className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 mr-1" />
                )}
                {Math.abs(changeFromPrevious)}% vs previous
              </Badge>
            </div>

            <div className="flex items-center justify-center mb-4">
              <div className="relative h-40 w-40 flex items-center justify-center">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" strokeLinecap="round" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={percentageOfTarget > 90 ? "#ef4444" : percentageOfTarget > 75 ? "#f59e0b" : "#10b981"}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${(percentageOfTarget * 283) / 100} 283`}
                    strokeDashoffset="70.75"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{percentageOfTarget}%</span>
                  <span className="text-sm text-gray-500">of target</span>
                </div>
              </div>
            </div>

            <div className="text-center mb-4">
              <div className="text-2xl font-bold">{currentData.total.toLocaleString()} kg CO₂e</div>
              <div className="text-sm text-gray-500">Target: {currentData.target.toLocaleString()} kg CO₂e</div>
            </div>

            <div className="flex items-center justify-center">
              <Leaf className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm">
                {changeFromPrevious > 0
                  ? `You've reduced emissions by ${changeFromPrevious}% compared to the previous period`
                  : `Emissions increased by ${Math.abs(changeFromPrevious)}% compared to the previous period`}
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Emission Breakdown</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Materials</span>
                  <span>{breakdownPercentages.materials}%</span>
                </div>
                <Progress value={breakdownPercentages.materials} className="h-2" />
                <div className="text-xs text-gray-500">{currentData.breakdown.materials.toLocaleString()} kg CO₂e</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Transportation</span>
                  <span>{breakdownPercentages.transportation}%</span>
                </div>
                <Progress value={breakdownPercentages.transportation} className="h-2" />
                <div className="text-xs text-gray-500">
                  {currentData.breakdown.transportation.toLocaleString()} kg CO₂e
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Energy Use</span>
                  <span>{breakdownPercentages.energy}%</span>
                </div>
                <Progress value={breakdownPercentages.energy} className="h-2" />
                <div className="text-xs text-gray-500">{currentData.breakdown.energy.toLocaleString()} kg CO₂e</div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Waste</span>
                  <span>{breakdownPercentages.waste}%</span>
                </div>
                <Progress value={breakdownPercentages.waste} className="h-2" />
                <div className="text-xs text-gray-500">{currentData.breakdown.waste.toLocaleString()} kg CO₂e</div>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="chart">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chart">Emissions Chart</TabsTrigger>
            <TabsTrigger value="insights">Insights & Recommendations</TabsTrigger>
          </TabsList>
          <TabsContent value="chart" className="pt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-medium">Emissions Over Time</h3>
                <BarChart3 className="h-5 w-5 text-gray-400" />
              </div>
              <div className="h-64 relative">
                <div className="flex h-full items-end justify-between">
                  {currentData.dailyData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center w-full">
                      <div
                        className="bg-blue-500 rounded-t w-8"
                        style={{
                          height: `${(item.value / Math.max(...currentData.dailyData.map((d) => d.value))) * 100}%`,
                          maxHeight: "90%",
                        }}
                      ></div>
                      <div className="text-xs mt-2">{item.day}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="insights" className="pt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-base font-medium mb-4">Insights & Recommendations</h3>
              <div className="space-y-3">
                {currentData.insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg flex items-start ${
                      insight.type === "positive"
                        ? "bg-green-50 border border-green-200"
                        : "bg-amber-50 border border-amber-200"
                    }`}
                  >
                    <AlertCircle
                      className={`h-5 w-5 mr-2 ${insight.type === "positive" ? "text-green-500" : "text-amber-500"}`}
                    />
                    <span className="text-sm">{insight.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Generate Detailed Carbon Report</Button>
      </CardFooter>
    </Card>
  )
}
