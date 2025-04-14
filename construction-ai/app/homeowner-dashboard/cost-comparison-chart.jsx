"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, BarChart, LineChart } from "lucide-react"

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

export function CostComparisonChart({ materialCost, laborCost, equipmentCost, overheadCost, totalCost, location }) {
  const [chartType, setChartType] = useState("bar")

  // Calculate percentages for pie chart
  const materialPercent = Math.round((materialCost / totalCost) * 100)
  const laborPercent = Math.round((laborCost / totalCost) * 100)
  const equipmentPercent = Math.round((equipmentCost / totalCost) * 100)
  const overheadPercent = Math.round((overheadCost / totalCost) * 100)

  // For bar chart - compare with industry average
  const industryAverage = {
    material: totalCost * 0.55, // 55% of total cost
    labor: totalCost * 0.25, // 25% of total cost
    equipment: totalCost * 0.1, // 10% of total cost
    overhead: totalCost * 0.1, // 10% of total cost
  }

  // Draw bar chart using HTML/CSS
  const renderBarChart = () => {
    const maxValue = Math.max(
      materialCost,
      laborCost,
      equipmentCost,
      overheadCost,
      industryAverage.material,
      industryAverage.labor,
      industryAverage.equipment,
      industryAverage.overhead,
    )

    return (
      <div className="mt-4">
        <div className="flex items-center mb-6">
          <div className="w-24 text-sm text-white">Material</div>
          <div className="flex-1 relative h-8">
            <div className="absolute inset-0 flex">
              <div
                className="bg-blue-600 h-full flex items-center justify-end px-2 text-xs text-white"
                style={{ width: `${(materialCost / maxValue) * 100}%` }}
              >
                ₹{formatIndianCurrency(materialCost)}
              </div>
            </div>
            <div className="absolute inset-0 flex">
              <div
                className="bg-blue-300/30 h-full border-r-2 border-blue-300"
                style={{ width: `${(industryAverage.material / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-6">
          <div className="w-24 text-sm text-white">Labor</div>
          <div className="flex-1 relative h-8">
            <div className="absolute inset-0 flex">
              <div
                className="bg-green-600 h-full flex items-center justify-end px-2 text-xs text-white"
                style={{ width: `${(laborCost / maxValue) * 100}%` }}
              >
                ₹{formatIndianCurrency(laborCost)}
              </div>
            </div>
            <div className="absolute inset-0 flex">
              <div
                className="bg-green-300/30 h-full border-r-2 border-green-300"
                style={{ width: `${(industryAverage.labor / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center mb-6">
          <div className="w-24 text-sm text-white">Equipment</div>
          <div className="flex-1 relative h-8">
            <div className="absolute inset-0 flex">
              <div
                className="bg-amber-600 h-full flex items-center justify-end px-2 text-xs text-white"
                style={{ width: `${(equipmentCost / maxValue) * 100}%` }}
              >
                ₹{formatIndianCurrency(equipmentCost)}
              </div>
            </div>
            <div className="absolute inset-0 flex">
              <div
                className="bg-amber-300/30 h-full border-r-2 border-amber-300"
                style={{ width: `${(industryAverage.equipment / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-24 text-sm text-white">Overhead</div>
          <div className="flex-1 relative h-8">
            <div className="absolute inset-0 flex">
              <div
                className="bg-purple-600 h-full flex items-center justify-end px-2 text-xs text-white"
                style={{ width: `${(overheadCost / maxValue) * 100}%` }}
              >
                ₹{formatIndianCurrency(overheadCost)}
              </div>
            </div>
            <div className="absolute inset-0 flex">
              <div
                className="bg-purple-300/30 h-full border-r-2 border-purple-300"
                style={{ width: `${(industryAverage.overhead / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-4 text-xs text-white">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 mr-1"></div>
            <span>Your Cost</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 border-2 border-blue-300 mr-1"></div>
            <span>Industry Average</span>
          </div>
        </div>
      </div>
    )
  }

  // Draw pie chart using HTML/CSS
  const renderPieChart = () => {
    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-4">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Material Cost Slice */}
            <circle
              r="25"
              cx="50"
              cy="50"
              fill="transparent"
              stroke="#2563eb"
              strokeWidth="50"
              strokeDasharray={`${materialPercent} ${100 - materialPercent}`}
              strokeDashoffset="25"
              transform="rotate(-90 50 50)"
            />
            {/* Labor Cost Slice */}
            <circle
              r="25"
              cx="50"
              cy="50"
              fill="transparent"
              stroke="#16a34a"
              strokeWidth="50"
              strokeDasharray={`${laborPercent} ${100 - laborPercent}`}
              strokeDashoffset={`${25 - materialPercent}`}
              transform="rotate(-90 50 50)"
            />
            {/* Equipment Cost Slice */}
            <circle
              r="25"
              cx="50"
              cy="50"
              fill="transparent"
              stroke="#d97706"
              strokeWidth="50"
              strokeDasharray={`${equipmentPercent} ${100 - equipmentPercent}`}
              strokeDashoffset={`${25 - materialPercent - laborPercent}`}
              transform="rotate(-90 50 50)"
            />
            {/* Overhead Cost Slice */}
            <circle
              r="25"
              cx="50"
              cy="50"
              fill="transparent"
              stroke="#9333ea"
              strokeWidth="50"
              strokeDasharray={`${overheadPercent} ${100 - overheadPercent}`}
              strokeDashoffset={`${25 - materialPercent - laborPercent - equipmentPercent}`}
              transform="rotate(-90 50 50)"
            />
            {/* Inner circle (hole) */}
            <circle r="25" cx="50" cy="50" fill="#1f2937" />
          </svg>
        </div>

        <div className="space-y-2 text-white">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 mr-2"></div>
            <span>
              Material Cost: {materialPercent}% (₹{formatIndianCurrency(materialCost)})
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-600 mr-2"></div>
            <span>
              Labor Cost: {laborPercent}% (₹{formatIndianCurrency(laborCost)})
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-amber-600 mr-2"></div>
            <span>
              Equipment Cost: {equipmentPercent}% (₹{formatIndianCurrency(equipmentCost)})
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-600 mr-2"></div>
            <span>
              Overhead Cost: {overheadPercent}% (₹{formatIndianCurrency(overheadCost)})
            </span>
          </div>
          <div className="pt-2 font-bold">Total: ₹{formatIndianCurrency(totalCost)}</div>
          {location && <div className="text-sm text-white/70 mt-1">Location: {location}</div>}
        </div>
      </div>
    )
  }

  // Draw line chart for cost trends
  const renderLineChart = () => {
    // Sample data for cost trends over time
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    const materialTrend = [
      materialCost * 0.85,
      materialCost * 0.9,
      materialCost * 0.95,
      materialCost,
      materialCost * 1.02,
      materialCost * 1.05,
    ]
    const laborTrend = [
      laborCost * 0.8,
      laborCost * 0.85,
      laborCost * 0.9,
      laborCost,
      laborCost * 1.05,
      laborCost * 1.1,
    ]

    const maxValue = Math.max(...materialTrend, ...laborTrend) * 1.1

    return (
      <div className="mt-4">
        <div className="relative h-64 mt-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-white">
            <div>₹{formatIndianCurrency(Math.round(maxValue))}</div>
            <div>₹{formatIndianCurrency(Math.round(maxValue * 0.75))}</div>
            <div>₹{formatIndianCurrency(Math.round(maxValue * 0.5))}</div>
            <div>₹{formatIndianCurrency(Math.round(maxValue * 0.25))}</div>
            <div>₹0</div>
          </div>

          {/* Chart area */}
          <div className="absolute left-12 right-0 top-0 bottom-0 border-l border-b border-gray-600">
            {/* Horizontal grid lines */}
            <div className="absolute left-0 right-0 top-0 h-px bg-gray-700"></div>
            <div className="absolute left-0 right-0 top-1/4 h-px bg-gray-700"></div>
            <div className="absolute left-0 right-0 top-2/4 h-px bg-gray-700"></div>
            <div className="absolute left-0 right-0 top-3/4 h-px bg-gray-700"></div>

            {/* Material cost line */}
            <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                points={months
                  .map((_, i) => `${(i / (months.length - 1)) * 100},${100 - (materialTrend[i] / maxValue) * 100}`)
                  .join(" ")}
                fill="none"
                stroke="#2563eb"
                strokeWidth="2"
              />
              {materialTrend.map((value, i) => (
                <circle
                  key={i}
                  cx={`${(i / (months.length - 1)) * 100}`}
                  cy={`${100 - (value / maxValue) * 100}`}
                  r="1.5"
                  fill="#2563eb"
                />
              ))}
            </svg>

            {/* Labor cost line */}
            <svg className="absolute inset-0" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                points={months
                  .map((_, i) => `${(i / (months.length - 1)) * 100},${100 - (laborTrend[i] / maxValue) * 100}`)
                  .join(" ")}
                fill="none"
                stroke="#16a34a"
                strokeWidth="2"
              />
              {laborTrend.map((value, i) => (
                <circle
                  key={i}
                  cx={`${(i / (months.length - 1)) * 100}`}
                  cy={`${100 - (value / maxValue) * 100}`}
                  r="1.5"
                  fill="#16a34a"
                />
              ))}
            </svg>
          </div>

          {/* X-axis labels */}
          <div className="absolute left-12 right-0 bottom-0 translate-y-4 flex justify-between text-xs text-white">
            {months.map((month, i) => (
              <div key={i}>{month}</div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-8 text-xs text-white">
          <div className="flex items-center mr-4">
            <div className="w-3 h-3 bg-blue-600 mr-1"></div>
            <span>Material Cost</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-600 mr-1"></div>
            <span>Labor Cost</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">Cost Analysis</CardTitle>
        <Tabs defaultValue="bar" onValueChange={setChartType} className="w-auto">
          <TabsList className="bg-gray-700">
            <TabsTrigger value="bar" className="data-[state=active]:bg-blue-600 text-white">
              <BarChart className="h-4 w-4 mr-1" />
              Bar
            </TabsTrigger>
            <TabsTrigger value="pie" className="data-[state=active]:bg-blue-600 text-white">
              <PieChart className="h-4 w-4 mr-1" />
              Pie
            </TabsTrigger>
            <TabsTrigger value="line" className="data-[state=active]:bg-blue-600 text-white">
              <LineChart className="h-4 w-4 mr-1" />
              Trend
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {chartType === "bar" && renderBarChart()}
        {chartType === "pie" && renderPieChart()}
        {chartType === "line" && renderLineChart()}
      </CardContent>
    </Card>
  )
}
