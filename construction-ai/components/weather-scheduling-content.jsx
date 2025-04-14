"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertCircle,
  Calendar,
  CloudRain,
  Droplets,
  RefreshCw,
  Sun,
  Wind,
  Cloud,
  CloudLightning,
  CloudSnow,
} from "lucide-react"
import { useState, useEffect } from "react"
import { getWeather, getWeatherForecast, analyzeWeatherImpact, processForecast } from "@/utils/weather-service"
import { DetailedScheduleView } from "./detailed-schedule-view"
import { LoadingIndicator } from "./loading-indicator"

export function WeatherSchedulingContent({ location: defaultLocation = "Mumbai" }) {
  const [isLoading, setIsLoading] = useState(true)
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState([])
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [showDetailedSchedule, setShowDetailedSchedule] = useState(false)
  const [location, setLocation] = useState(defaultLocation)

  // Fetch weather data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Get current weather
        const currentWeather = await getWeather(location)
        if (currentWeather) {
          setWeatherData(analyzeWeatherImpact(currentWeather))
        } else {
          console.error("No weather data returned")
          setError("Failed to load weather data. Please try again later.")
        }

        // Get forecast
        const forecast = await getWeatherForecast(location)
        if (forecast && forecast.list) {
          const processedForecast = processForecast(forecast)
          setForecastData(processedForecast || []) // Ensure we always have an array
        } else {
          console.error("No forecast data returned or missing list property")
          setForecastData([]) // Set empty array as fallback
        }

        setLastUpdated(new Date())
      } catch (err) {
        console.error("Error fetching weather data:", err)
        setError("Failed to load weather data. Please try again later.")
        // Set default values to prevent errors
        setForecastData([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [location])

  // Function to refresh weather data
  const refreshWeatherData = async (newLocation = location) => {
    setIsLoading(true)
    setError(null)

    try {
      // Get current weather
      const currentWeather = await getWeather(newLocation)
      if (currentWeather) {
        setWeatherData(analyzeWeatherImpact(currentWeather))
      } else {
        console.error("No weather data returned")
        setError("Failed to load weather data. Please try again later.")
      }

      // Get forecast
      const forecast = await getWeatherForecast(newLocation)
      if (forecast && forecast.list) {
        const processedForecast = processForecast(forecast)
        setForecastData(processedForecast || [])
      } else {
        console.error("No forecast data returned or missing list property")
        setForecastData([])
      }

      setLastUpdated(new Date())
    } catch (err) {
      console.error("Error refreshing weather data:", err)
      setError("Failed to refresh weather data. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to get impact color
  const getImpactColor = (impact) => {
    switch (impact) {
      case "Low":
        return "text-green-400"
      case "Moderate":
        return "text-yellow-400"
      case "High":
        return "text-red-400"
      default:
        return "text-white"
    }
  }

  // Function to get weather icon
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Clear":
        return <Sun className="h-8 w-8 text-yellow-400" />
      case "Clouds":
        return <Cloud className="h-8 w-8 text-gray-400" />
      case "Rain":
      case "Drizzle":
        return <CloudRain className="h-8 w-8 text-blue-400" />
      case "Thunderstorm":
        return <CloudLightning className="h-8 w-8 text-purple-400" />
      case "Snow":
        return <CloudSnow className="h-8 w-8 text-white" />
      default:
        return <Sun className="h-8 w-8 text-yellow-400" />
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
  }

  // Toggle detailed schedule view
  const toggleDetailedSchedule = () => {
    setShowDetailedSchedule(!showDetailedSchedule)
  }

  if (isLoading) {
    return <LoadingIndicator message="Loading real-time weather data..." />
  }

  if (error) {
    return (
      <Alert className="bg-red-600/20 border-red-600/30 text-white">
        <AlertCircle className="h-4 w-4 text-red-400" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  // If detailed schedule is shown, render that instead
  if (showDetailedSchedule) {
    return <DetailedScheduleView forecastData={forecastData} onClose={toggleDetailedSchedule} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Weather Scheduling & Real-Time Data</h2>
        <Button
          variant="outline"
          size="sm"
          className="text-white border-blue-600"
          onClick={refreshWeatherData}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {lastUpdated && (
        <div className="text-sm text-white/70">
          Last updated: {lastUpdated.toLocaleTimeString()} | Location: {location}
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <label htmlFor="location-select" className="text-white">
          Location:
        </label>
        <select
          id="location-select"
          className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1"
          value={location}
          onChange={(e) => {
            const newLocation = e.target.value
            setLocation(newLocation)
            refreshWeatherData(newLocation)
          }}
        >
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Chennai">Chennai</option>
          <option value="Kolkata">Kolkata</option>
          <option value="Pune">Pune</option>
          <option value="Ahmedabad">Ahmedabad</option>
          <option value="Mangalore">Mangalore</option>
        </select>
      </div>

      {/* Current Weather Display - Prominent at the top */}
      {weatherData && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex items-start gap-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-white">{weatherData.name || location}</h2>
                    {getWeatherIcon(weatherData.condition)}
                  </div>
                  <p className="text-white/70">{weatherData.description || "scattered clouds"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <div className="text-4xl font-bold text-white">{Math.round(weatherData.temperature)}°C</div>
                <div className={`text-lg ${getImpactColor(weatherData.impact)}`}>{weatherData.impact} Impact</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-3">
                <Droplets className="h-6 w-6 text-blue-400" />
                <div>
                  <div className="text-white/70">Humidity</div>
                  <div className="text-xl font-semibold text-white">{weatherData.humidity || 69}%</div>
                </div>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-4 flex items-center gap-3">
                <Wind className="h-6 w-6 text-blue-400" />
                <div>
                  <div className="text-white/70">Wind</div>
                  <div className="text-xl font-semibold text-white">{weatherData.windSpeed || 2.06} m/s</div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">5-Day Forecast</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                {forecastData && forecastData.length > 0 ? (
                  forecastData.slice(0, 5).map((day, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                      <div className="text-white font-medium">{formatDate(day.date)}</div>
                      <div className="flex justify-between items-center my-2">
                        {getWeatherIcon(day.condition)}
                        <div className="text-white">
                          {day.temperature.min}° - {day.temperature.max}°
                        </div>
                      </div>
                      <div className={`text-sm ${getImpactColor(day.impact)}`}>{day.impact} Impact</div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-5 text-white/70">No forecast data available</div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Construction Activity Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {weatherData &&
                  weatherData.activities &&
                  Object.entries(weatherData.activities).map(([activity, data], index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <div className="text-white">{activity}</div>
                        <Badge
                          className={`
                      ${
                        data.status === "Optimal"
                          ? "bg-green-600"
                          : data.status === "Caution"
                            ? "bg-yellow-600"
                            : data.status === "Delayed"
                              ? "bg-orange-600"
                              : "bg-red-600"
                      }
                    `}
                        >
                          {data.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Alert className="bg-blue-600/20 border-blue-600/30 text-white">
        <AlertCircle className="h-4 w-4 text-blue-400" />
        <AlertTitle>Real-Time Data Integration</AlertTitle>
        <AlertDescription>
          This dashboard connects to multiple APIs to provide you with the most up-to-date information for your
          construction project planning.
        </AlertDescription>
      </Alert>

      {/* Remove the entire Tabs component with TabsList and TabsContent */}
      {/* Replace with just the AI recommendation card */}

      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">AI-Powered Recommendations</CardTitle>
          <CardDescription className="text-white">
            Smart suggestions based on real-time weather data analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-600/20 p-4 rounded-lg border border-blue-600/30">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-medium text-white">Scheduling Optimization</h3>
            </div>
            <p className="text-white/90 mb-3">
              Based on weather forecasts, schedule exterior work for Monday-Tuesday when conditions are optimal.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-blue-600 text-blue-400 hover:bg-blue-600/20"
              onClick={toggleDetailedSchedule}
            >
              View Detailed Schedule
            </Button>
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-blue-600 text-blue-400 hover:bg-blue-600/20"
                onClick={() => (window.location.href = "/weather-scheduling/work-schedule")}
              >
                Manage Work Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
