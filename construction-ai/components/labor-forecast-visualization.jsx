"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

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

export function LaborForecastVisualization({ originalPlan, adjustedPlan, workerTypes }) {
  const [chartType, setChartType] = useState("workforce")

  // Skip if plans are not available
  if (!originalPlan || !adjustedPlan) {
    return null
  }

  // Prepare data for workforce chart
  const prepareWorkforceData = () => {
    return Object.keys(adjustedPlan.labor).map((workerType) => ({
      name: workerTypes[workerType].title,
      Standard: originalPlan.labor[workerType] || 0,
      Adjusted: adjustedPlan.labor[workerType] || 0,
      skillLevel: workerTypes[workerType].skill,
    }))
  }

  // Prepare data for cost chart
  const prepareCostData = () => {
    return Object.keys(adjustedPlan.laborCosts).map((workerType) => ({
      name: workerTypes[workerType].title,
      Standard: Math.round(originalPlan.laborCosts[workerType] || 0),
      Adjusted: Math.round(adjustedPlan.laborCosts[workerType] || 0),
      skillLevel: workerTypes[workerType].skill,
    }))
  }

  // Prepare data for phase workforce chart
  const preparePhaseWorkforceData = () => {
    return adjustedPlan.phases.map((phase) => {
      const result = { name: phase.phase }
      Object.keys(phase.labor).forEach((workerType) => {
        result[workerTypes[workerType].title] = phase.labor[workerType]
      })
      return result
    })
  }

  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-gray-900 p-3 rounded border border-gray-700">
          <p className="text-white font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex justify-between items-center">
              <span style={{ color: entry.color }}>{entry.name}: </span>
              <span className="text-white ml-2">
                {chartType === "cost" ? `₹${formatIndianCurrency(entry.value)}` : entry.value}
              </span>
            </div>
          ))}
        </div>
      )
    }

    return null
  }

  // Determine chart colors based on skill level
  const getBarColor = (skillLevel) => {
    switch (skillLevel) {
      case "Skilled":
        return "#3b82f6" // blue
      case "Unskilled":
        return "#10b981" // green
      case "Management":
        return "#8b5cf6" // purple
      default:
        return "#6b7280" // gray
    }
  }

  // Render the selected chart
  const renderChart = () => {
    switch (chartType) {
      case "workforce":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={prepareWorkforceData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: "#e5e7eb" }} axisLine={{ stroke: "#4b5563" }} />
              <YAxis
                tick={{ fill: "#e5e7eb" }}
                axisLine={{ stroke: "#4b5563" }}
                label={{
                  value: "Number of Workers",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#e5e7eb",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 10 }}
                formatter={(value) => <span className="text-white">{value}</span>}
              />
              <Bar dataKey="Standard" fill="#6366f1" name="Standard Workforce" />
              <Bar dataKey="Adjusted" fill="#3b82f6" name="Weather-Adjusted Workforce" />
            </BarChart>
          </ResponsiveContainer>
        )

      case "cost":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={prepareCostData()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: "#e5e7eb" }} axisLine={{ stroke: "#4b5563" }} />
              <YAxis
                tick={{ fill: "#e5e7eb" }}
                axisLine={{ stroke: "#4b5563" }}
                label={{
                  value: "Labor Cost (₹)",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#e5e7eb",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 10 }}
                formatter={(value) => <span className="text-white">{value}</span>}
              />
              <Bar dataKey="Standard" fill="#0ea5e9" name="Standard Cost" />
              <Bar dataKey="Adjusted" fill="#06b6d4" name="Weather-Adjusted Cost" />
            </BarChart>
          </ResponsiveContainer>
        )

      case "phase":
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={preparePhaseWorkforceData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" tick={{ fill: "#e5e7eb" }} axisLine={{ stroke: "#4b5563" }} />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#e5e7eb" }}
                axisLine={{ stroke: "#4b5563" }}
                width={120}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: 10 }}
                formatter={(value) => <span className="text-white">{value}</span>}
              />
              {Object.keys(workerTypes).map((type) => {
                // Only include worker types that are actually used in the phases
                const isUsed = adjustedPlan.phases.some((phase) => phase.labor[type] && phase.labor[type] > 0)

                if (isUsed) {
                  return (
                    <Bar
                      key={type}
                      dataKey={workerTypes[type].title}
                      fill={getBarColor(workerTypes[type].skill)}
                      name={workerTypes[type].title}
                    />
                  )
                }
                return null
              })}
            </BarChart>
          </ResponsiveContainer>
        )

      default:
        return null
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Labor Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={chartType} onValueChange={setChartType} className="w-full">
          <TabsList className="bg-gray-700 grid grid-cols-3">
            <TabsTrigger value="workforce" className="data-[state=active]:bg-blue-600 text-white">
              Workforce
            </TabsTrigger>
            <TabsTrigger value="cost" className="data-[state=active]:bg-blue-600 text-white">
              Labor Cost
            </TabsTrigger>
            <TabsTrigger value="phase" className="data-[state=active]:bg-blue-600 text-white">
              By Phase
            </TabsTrigger>
          </TabsList>

          <TabsContent value={chartType} className="pt-4">
            {renderChart()}
          </TabsContent>
        </Tabs>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-blue-500">Skilled Labor</Badge>
            <Badge className="bg-green-500">Unskilled Labor</Badge>
            <Badge className="bg-purple-500">Management</Badge>
          </div>
          <div className="mt-2 text-white/70 text-sm">
            The visualization shows the labor requirements and costs based on standard project estimation versus
            weather-adjusted projections.
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
