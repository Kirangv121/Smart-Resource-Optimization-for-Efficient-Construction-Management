"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

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

export function LiveCostTracker({ totalCost, budgetLimit }) {
  const [currentCost, setCurrentCost] = useState(totalCost)
  const [costHistory, setCostHistory] = useState([totalCost])
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [isLive, setIsLive] = useState(false)
  const [alerts, setAlerts] = useState([])

  // Use refs to store previous values to avoid unnecessary re-renders
  const prevTotalCostRef = useRef(totalCost)

  // Simulate live cost updates
  useEffect(() => {
    let interval

    if (isLive) {
      interval = setInterval(() => {
        // Random fluctuation between -0.5% and +1.5%
        const fluctuation = (Math.random() * 2 - 0.5) / 100
        const newCost = Math.round(currentCost * (1 + fluctuation))

        setCurrentCost(newCost)
        setCostHistory((prev) => [...prev, newCost])
        setLastUpdate(new Date())

        // Check for budget alerts
        if (newCost > budgetLimit && currentCost <= budgetLimit) {
          setAlerts((prev) => [
            {
              id: Date.now(),
              type: "budget",
              message: "Budget limit exceeded!",
              timestamp: new Date(),
            },
            ...prev,
          ])
        }

        // Check for sudden cost increase
        if (newCost > currentCost * 1.01) {
          setAlerts((prev) => [
            {
              id: Date.now(),
              type: "increase",
              message: "Sudden cost increase detected!",
              timestamp: new Date(),
            },
            ...prev,
          ])
        }
      }, 5000) // Update every 5 seconds
    }

    return () => clearInterval(interval)
  }, [isLive, currentCost, budgetLimit])

  // Update when totalCost changes from parent
  useEffect(() => {
    // Only update if totalCost has actually changed
    if (totalCost !== prevTotalCostRef.current) {
      setCurrentCost(totalCost)
      setCostHistory((prev) => [...prev, totalCost])
      prevTotalCostRef.current = totalCost
    }
  }, [totalCost])

  // Format the last update time
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  // Calculate cost change
  const costChange =
    costHistory.length > 1
      ? ((currentCost - costHistory[costHistory.length - 2]) / costHistory[costHistory.length - 2]) * 100
      : 0

  // Dismiss an alert
  const dismissAlert = (alertId) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  // Determine cost change class
  const getCostChangeClass = () => {
    if (costChange > 0) return "text-red-400"
    if (costChange < 0) return "text-green-400"
    return "text-white"
  }

  // Generate SVG points for the chart
  const generateChartPoints = () => {
    if (costHistory.length <= 1) return ""

    return costHistory
      .map((cost, i) => {
        const minCost = Math.min(...costHistory) * 0.95
        const maxCost = Math.max(...costHistory) * 1.05
        const range = maxCost - minCost
        const y = 100 - ((cost - minCost) / range) * 100
        return `${i},${y}`
      })
      .join(" ")
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">Live Cost Tracker</CardTitle>
        <Button
          variant={isLive ? "destructive" : "outline"}
          size="sm"
          onClick={() => setIsLive(!isLive)}
          className={isLive ? "" : "border-blue-600 text-blue-400 hover:bg-blue-600/20"}
        >
          {isLive ? "Stop Tracking" : "Start Live Tracking"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="bg-gray-700 p-4 rounded-lg w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-white">Current Cost</div>
                <div className="flex items-center text-sm">
                  {costChange > 0 && <TrendingUp className="h-4 w-4 text-red-400 mr-1" />}
                  {costChange < 0 && <TrendingDown className="h-4 w-4 text-green-400 mr-1" />}
                  <span className={getCostChangeClass()}>{costChange.toFixed(2)}%</span>
                </div>
              </div>
              <div className="text-2xl font-bold text-white">₹{formatIndianCurrency(currentCost)}</div>
              <div className="flex items-center mt-2 text-xs text-white">
                <Clock className="h-3 w-3 mr-1" />
                <span>Last updated: {formatTime(lastUpdate)}</span>
              </div>
            </div>

            <div className="bg-gray-700 p-4 rounded-lg w-full">
              <div className="text-sm text-white mb-2">Budget Utilization</div>
              <div className="flex justify-between text-sm text-white mb-1">
                <span>₹{formatIndianCurrency(currentCost)}</span>
                <span>₹{formatIndianCurrency(budgetLimit)}</span>
              </div>
              <Progress value={Math.min(100, (currentCost / budgetLimit) * 100)} className="h-2" />
              <div className="flex justify-between mt-2 text-xs text-white">
                <span>Current</span>
                <span>{Math.min(100, Math.round((currentCost / budgetLimit) * 100))}% of budget</span>
              </div>
            </div>
          </div>

          {/* Cost history mini chart */}
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-sm text-white mb-2">Cost History</div>
            <div className="h-16 relative">
              {costHistory.length > 1 && (
                <svg className="w-full h-full" viewBox={`0 0 ${costHistory.length} 100`} preserveAspectRatio="none">
                  <polyline points={generateChartPoints()} fill="none" stroke="#3b82f6" strokeWidth="2" />
                </svg>
              )}
            </div>
          </div>

          {/* Alerts section */}
          {alerts.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-white">Alerts</div>
              {alerts.slice(0, 3).map((alert) => {
                let alertClass = "bg-blue-900/30 border border-blue-500"
                let alertIcon = <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />

                if (alert.type === "budget") {
                  alertClass = "bg-red-900/30 border border-red-500"
                  alertIcon = <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                } else if (alert.type === "increase") {
                  alertClass = "bg-amber-900/30 border border-amber-500"
                  alertIcon = <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5" />
                }

                return (
                  <div key={alert.id} className={`p-3 rounded-lg flex items-start justify-between ${alertClass}`}>
                    <div className="flex items-start gap-2">
                      {alertIcon}
                      <div>
                        <div className="text-white font-medium">{alert.message}</div>
                        <div className="text-xs text-white/70">{formatTime(alert.timestamp)}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-white/70 hover:text-white"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      ×
                    </Button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
