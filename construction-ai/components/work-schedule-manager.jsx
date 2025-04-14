"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Sun, CloudRain, RefreshCw } from "lucide-react"
import { LoadingIndicator } from "./loading-indicator"

// Initial work schedule data matching the example
const initialWorkSchedule = [
  {
    id: 1,
    task: "Site Evaluation",
    originalStartDate: new Date("2025-07-16"),
    originalEndDate: new Date("2025-07-30"),
    duration: "2 weeks",
    workers: 4,
    weatherSensitive: true,
    status: "Scheduled",
    currentStartDate: new Date("2025-07-16"),
    currentEndDate: new Date("2025-07-30"),
    rescheduleCount: 0,
  },
  {
    id: 2,
    task: "Architect & Engineer Selection",
    originalStartDate: new Date("2025-07-30"),
    originalEndDate: new Date("2025-08-27"),
    duration: "4 weeks",
    workers: 2,
    weatherSensitive: false,
    status: "Scheduled",
    currentStartDate: new Date("2025-07-30"),
    currentEndDate: new Date("2025-08-27"),
    rescheduleCount: 0,
  },
]

// Format date helper
const formatDate = (date) => {
  const options = { year: "numeric", month: "short", day: "numeric" }
  return date.toLocaleDateString("en-US", options)
}

export function WorkScheduleManager() {
  const [workSchedule, setWorkSchedule] = useState(initialWorkSchedule)
  const [isLoading, setIsLoading] = useState(false)
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState([])
  const [location, setLocation] = useState("Mumbai")
  const [lastUpdated, setLastUpdated] = useState(null)

  // Fetch weather data on component mount
  useEffect(() => {
    fetchWeatherData()
  }, [])

  // Fetch weather data from weather API
  const fetchWeatherData = async () => {
    setIsLoading(true)
    try {
      // Fetch current weather data
      const weatherResponse = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)
      const weatherResult = await weatherResponse.json()

      // Fetch forecast data
      const forecastResponse = await fetch(`/api/forecast?location=${encodeURIComponent(location)}`)
      const forecastResult = await forecastResponse.json()

      // Process the forecast data
      const processed = processForecast(forecastResult)

      setWeatherData(weatherResult)
      setForecastData(processed || [])
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Error fetching weather data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Process forecast data
  const processForecast = (data) => {
    if (!data || !data.list) return []

    // Group by day
    const dailyData = {}

    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000).toISOString().split("T")[0]

      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          conditions: [item.weather[0].main],
          wind: [item.wind.speed],
        }
      } else {
        dailyData[date].conditions.push(item.weather[0].main)
        dailyData[date].wind.push(item.wind.speed)

        if (item.main.temp_min < dailyData[date].temp_min) {
          dailyData[date].temp_min = item.main.temp_min
        }

        if (item.main.temp_max > dailyData[date].temp_max) {
          dailyData[date].temp_max = item.main.temp_max
        }
      }
    })

    // Convert to array and determine the primary condition and impact
    return Object.values(dailyData).map((day) => {
      // Get most common condition
      const conditionCounts = {}
      day.conditions.forEach((condition) => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1
      })

      const primaryCondition = Object.entries(conditionCounts).sort((a, b) => b[1] - a[1])[0][0]

      // Calculate average wind speed
      const avgWind = day.wind.reduce((sum, speed) => sum + speed, 0) / day.wind.length

      // Determine impact based on conditions
      let impact = "Low"
      if (primaryCondition === "Rain" || primaryCondition === "Thunderstorm" || primaryCondition === "Snow") {
        impact = "High"
      } else if (primaryCondition === "Clouds" && avgWind > 20) {
        impact = "Moderate"
      } else if (day.temp_max > 35 || day.temp_min < 5) {
        impact = "Moderate"
      }

      return {
        date: day.date,
        condition: primaryCondition,
        temp_min: day.temp_min,
        temp_max: day.temp_max,
        avgWind,
        impact,
      }
    })
  }

  // Check if weather conditions are poor for construction
  const isBadWeather = (weatherData) => {
    if (!weatherData) return false

    // Consider bad weather if impact is high
    return weatherData.impact === "High" || ["Rain", "Thunderstorm", "Snow"].includes(weatherData.condition)
  }

  // Reschedule weather-sensitive tasks
  const rescheduleWeatherSensitiveTasks = () => {
    setIsLoading(true)

    setTimeout(() => {
      // First, identify all weather-sensitive tasks
      const weatherSensitiveTasks = workSchedule.filter((task) => task.weatherSensitive)

      // Make a copy of the current schedule
      let updatedSchedule = [...workSchedule]

      // First pass: Shift all weather-sensitive tasks by one day
      updatedSchedule = updatedSchedule.map((task) => {
        if (task.weatherSensitive) {
          // Create new dates by adding one day
          const newStartDate = new Date(task.currentStartDate)
          newStartDate.setDate(newStartDate.getDate() + 1)

          const newEndDate = new Date(task.currentEndDate)
          newEndDate.setDate(newEndDate.getDate() + 1)

          return {
            ...task,
            currentStartDate: newStartDate,
            currentEndDate: newEndDate,
            rescheduleCount: task.rescheduleCount + 1,
            status: "Rescheduled",
          }
        }
        return task
      })

      // Second pass: Sort tasks by start date to process them in chronological order
      updatedSchedule.sort((a, b) => a.currentStartDate - b.currentStartDate)

      // Third pass: Ensure dependent tasks start after their predecessors end
      for (let i = 1; i < updatedSchedule.length; i++) {
        const prevTask = updatedSchedule[i - 1]
        const currentTask = updatedSchedule[i]

        // Check if this task would start before the previous task ends
        if (currentTask.currentStartDate < prevTask.currentEndDate) {
          // Calculate the time difference to maintain task duration
          const taskDuration = currentTask.originalEndDate - currentTask.originalStartDate

          // Move task to start after previous task ends
          const newStartDate = new Date(prevTask.currentEndDate)
          const newEndDate = new Date(newStartDate.getTime() + taskDuration)

          updatedSchedule[i] = {
            ...currentTask,
            currentStartDate: newStartDate,
            currentEndDate: newEndDate,
            status: currentTask.weatherSensitive ? "Rescheduled" : "Adjusted",
          }
        }
      }

      setWorkSchedule(updatedSchedule)
      setIsLoading(false)
    }, 1000)
  }

  // Reset schedule to original dates
  const resetSchedule = () => {
    setWorkSchedule(initialWorkSchedule)
  }

  // Get weather status icon
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Rain":
      case "Thunderstorm":
      case "Drizzle":
        return <CloudRain className="h-5 w-5 text-blue-400" />
      case "Clear":
        return <Sun className="h-5 w-5 text-yellow-400" />
      case "Clouds":
        return <Sun className="h-5 w-5 text-gray-400" />
      default:
        return <Sun className="h-5 w-5 text-yellow-400" />
    }
  }

  if (isLoading) {
    return <LoadingIndicator message="Processing schedule and weather data..." />
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">Construction Work Schedule</CardTitle>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
            onClick={fetchWeatherData}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Weather
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {lastUpdated && (
          <div className="text-sm text-white/70 mb-4">
            Weather data last updated: {lastUpdated.toLocaleTimeString()} | Location: {location}
          </div>
        )}

        {/* Current Weather Summary */}
        {weatherData && (
          <div className="bg-gray-700 p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {getWeatherIcon(weatherData.weather[0].main)}
                <div>
                  <h3 className="text-white font-medium">Current Weather in {location}</h3>
                  <p className="text-white/70">
                    {weatherData.weather[0].main} - {Math.round(weatherData.main.temp)}°C
                  </p>
                </div>
              </div>
              <div>
                <Badge
                  className={`${isBadWeather({ condition: weatherData.weather[0].main, impact: "High" }) ? "bg-red-600" : "bg-green-600"}`}
                >
                  {isBadWeather({ condition: weatherData.weather[0].main, impact: "High" })
                    ? "Unfavorable for Construction"
                    : "Favorable for Construction"}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Forecast Summary */}
        {forecastData.length > 0 && (
          <div className="bg-gray-700 p-4 rounded-lg mb-6">
            <h3 className="text-white font-medium mb-3">5-Day Weather Forecast</h3>
            <div className="grid grid-cols-5 gap-2">
              {forecastData.slice(0, 5).map((day, index) => (
                <div key={index} className="bg-gray-800 p-3 rounded-lg text-center">
                  <div className="text-white/70">
                    {new Date(day.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex justify-center my-2">{getWeatherIcon(day.condition)}</div>
                  <div className="text-white">
                    {Math.round(day.temp_min)}° - {Math.round(day.temp_max)}°
                  </div>
                  <Badge
                    className={`mt-2 ${day.impact === "High" ? "bg-red-600" : day.impact === "Moderate" ? "bg-amber-600" : "bg-green-600"}`}
                  >
                    {day.impact} Impact
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Work Schedule Table */}
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-700">
              <TableHead className="text-white">Task</TableHead>
              <TableHead className="text-white">Original Dates</TableHead>
              <TableHead className="text-white">Current Dates</TableHead>
              <TableHead className="text-white">Duration</TableHead>
              <TableHead className="text-white">Workers</TableHead>
              <TableHead className="text-white">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workSchedule.map((task) => (
              <TableRow key={task.id} className="border-b border-gray-700">
                <TableCell className="text-white">{task.task}</TableCell>
                <TableCell className="text-white">
                  {formatDate(task.originalStartDate)} to {formatDate(task.originalEndDate)}
                </TableCell>
                <TableCell className="text-white">
                  {formatDate(task.currentStartDate)} to {formatDate(task.currentEndDate)}
                </TableCell>
                <TableCell className="text-white">{task.duration}</TableCell>
                <TableCell className="text-white">{task.workers} workers</TableCell>
                <TableCell>
                  {task.status === "Rescheduled" ? (
                    <Badge variant="secondary">Rescheduled</Badge>
                  ) : task.status === "Adjusted" ? (
                    <Badge variant="secondary">Adjusted</Badge>
                  ) : (
                    <Badge variant="default">On Schedule</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
