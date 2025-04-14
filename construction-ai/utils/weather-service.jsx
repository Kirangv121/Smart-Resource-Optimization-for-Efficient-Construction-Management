// Weather impact mapping for construction activities
const WEATHER_IMPACT = {
  // Main weather conditions
  Clear: {
    impact: "Low",
    activities: {
      Excavation: { delay: 0, status: "Optimal" },
      Foundation: { delay: 0, status: "Optimal" },
      Framing: { delay: 0, status: "Optimal" },
      Roofing: { delay: 0, status: "Optimal" },
      Exterior: { delay: 0, status: "Optimal" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
  Clouds: {
    impact: "Low",
    activities: {
      Excavation: { delay: 0, status: "Optimal" },
      Foundation: { delay: 0, status: "Optimal" },
      Framing: { delay: 0, status: "Optimal" },
      Roofing: { delay: 0, status: "Optimal" },
      Exterior: { delay: 0, status: "Optimal" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
  Rain: {
    impact: "Moderate",
    activities: {
      Excavation: { delay: 2, status: "Delayed" },
      Foundation: { delay: 2, status: "Delayed" },
      Framing: { delay: 1, status: "Caution" },
      Roofing: { delay: 3, status: "Halted" },
      Exterior: { delay: 2, status: "Delayed" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
  Drizzle: {
    impact: "Low",
    activities: {
      Excavation: { delay: 1, status: "Caution" },
      Foundation: { delay: 1, status: "Caution" },
      Framing: { delay: 0, status: "Optimal" },
      Roofing: { delay: 2, status: "Delayed" },
      Exterior: { delay: 1, status: "Caution" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
  Thunderstorm: {
    impact: "High",
    activities: {
      Excavation: { delay: 3, status: "Halted" },
      Foundation: { delay: 3, status: "Halted" },
      Framing: { delay: 3, status: "Halted" },
      Roofing: { delay: 3, status: "Halted" },
      Exterior: { delay: 3, status: "Halted" },
      Interior: { delay: 1, status: "Caution" },
    },
  },
  Snow: {
    impact: "High",
    activities: {
      Excavation: { delay: 3, status: "Halted" },
      Foundation: { delay: 3, status: "Halted" },
      Framing: { delay: 2, status: "Delayed" },
      Roofing: { delay: 3, status: "Halted" },
      Exterior: { delay: 3, status: "Halted" },
      Interior: { delay: 1, status: "Caution" },
    },
  },
  Mist: {
    impact: "Low",
    activities: {
      Excavation: { delay: 1, status: "Caution" },
      Foundation: { delay: 1, status: "Caution" },
      Framing: { delay: 1, status: "Caution" },
      Roofing: { delay: 1, status: "Caution" },
      Exterior: { delay: 1, status: "Caution" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
  Fog: {
    impact: "Moderate",
    activities: {
      Excavation: { delay: 1, status: "Caution" },
      Foundation: { delay: 1, status: "Caution" },
      Framing: { delay: 2, status: "Delayed" },
      Roofing: { delay: 2, status: "Delayed" },
      Exterior: { delay: 2, status: "Delayed" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
  Haze: {
    impact: "Low",
    activities: {
      Excavation: { delay: 1, status: "Caution" },
      Foundation: { delay: 0, status: "Optimal" },
      Framing: { delay: 0, status: "Optimal" },
      Roofing: { delay: 1, status: "Caution" },
      Exterior: { delay: 1, status: "Caution" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
  Dust: {
    impact: "Moderate",
    activities: {
      Excavation: { delay: 1, status: "Caution" },
      Foundation: { delay: 1, status: "Caution" },
      Framing: { delay: 1, status: "Caution" },
      Roofing: { delay: 1, status: "Caution" },
      Exterior: { delay: 2, status: "Delayed" },
      Interior: { delay: 1, status: "Caution" },
    },
  },
  default: {
    impact: "Unknown",
    activities: {
      Excavation: { delay: 1, status: "Caution" },
      Foundation: { delay: 1, status: "Caution" },
      Framing: { delay: 1, status: "Caution" },
      Roofing: { delay: 1, status: "Caution" },
      Exterior: { delay: 1, status: "Caution" },
      Interior: { delay: 0, status: "Optimal" },
    },
  },
}

// Get current weather data
export async function getWeather(location) {
  try {
    // Ensure location is a string
    const locationStr = typeof location === "object" ? "Mumbai" : String(location)

    console.log("Fetching weather data for:", locationStr)

    const response = await fetch(`/api/weather?location=${encodeURIComponent(locationStr)}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      console.error("Weather API response not OK:", response.status, response.statusText)
      throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Weather data received:", data ? "success" : "empty")

    // Validate the data structure
    if (!data || !data.weather || !data.weather[0] || !data.main) {
      throw new Error("Invalid weather data structure received")
    }

    return data
  } catch (error) {
    console.error("Error in getWeather function:", error.message)
    // Return a minimal valid weather object that won't break the UI
    return {
      weather: [{ main: "Clear", description: "clear sky", icon: "01d" }],
      main: { temp: 30, humidity: 60 },
      wind: { speed: 3 },
      name: typeof location === "string" ? location : "Mumbai",
    }
  }
}

// Get 5-day forecast
export async function getWeatherForecast(location) {
  try {
    // Ensure location is a string
    const locationStr = typeof location === "object" ? "Mumbai" : String(location)

    console.log("Fetching forecast data for:", locationStr)

    const response = await fetch(`/api/forecast?location=${encodeURIComponent(locationStr)}`, {
      method: "GET",
      headers: {
        "Cache-Control": "no-cache",
      },
    })

    if (!response.ok) {
      console.error("Forecast API response not OK:", response.status, response.statusText)
      throw new Error(`Failed to fetch forecast data: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Forecast data received:", data && data.list ? "success" : "empty")

    // Validate the data structure
    if (!data || !data.list || !Array.isArray(data.list) || data.list.length === 0) {
      throw new Error("Invalid forecast data structure received")
    }

    return data
  } catch (error) {
    console.error("Error in getWeatherForecast function:", error.message)
    // Return minimal valid forecast data
    return {
      list: [
        {
          dt: Math.floor(Date.now() / 1000),
          main: { temp: 30 },
          weather: [{ main: "Clear" }],
          wind: { speed: 3 },
        },
      ],
    }
  }
}

// Analyze weather impact on construction
export function analyzeWeatherImpact(weatherData) {
  if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
    return WEATHER_IMPACT.default
  }

  const mainWeather = weatherData.weather[0].main
  const impact = WEATHER_IMPACT[mainWeather] || WEATHER_IMPACT.default

  // Adjust for temperature extremes
  const temp = weatherData.main.temp
  let tempImpact = { impact: "Low", activities: {} }

  if (temp > 35) {
    tempImpact = {
      impact: "Moderate",
      activities: {
        Excavation: { delay: 1, status: "Caution" },
        Foundation: { delay: 2, status: "Delayed" }, // Concrete curing issues
        Framing: { delay: 1, status: "Caution" },
        Roofing: { delay: 2, status: "Delayed" }, // Heat exposure risk
        Exterior: { delay: 1, status: "Caution" },
        Interior: { delay: 0, status: "Optimal" },
      },
    }
  } else if (temp < 5) {
    tempImpact = {
      impact: "Moderate",
      activities: {
        Excavation: { delay: 1, status: "Caution" },
        Foundation: { delay: 2, status: "Delayed" }, // Concrete freezing risk
        Framing: { delay: 1, status: "Caution" },
        Roofing: { delay: 1, status: "Caution" },
        Exterior: { delay: 2, status: "Delayed" },
        Interior: { delay: 0, status: "Optimal" },
      },
    }
  }

  // Combine weather and temperature impacts
  const combinedImpact = {
    impact:
      impact.impact === "High"
        ? "High"
        : impact.impact === "Moderate" || tempImpact.impact === "Moderate"
          ? "Moderate"
          : "Low",
    activities: {},
  }

  // Combine activity impacts (take the worse of the two)
  for (const activity in impact.activities) {
    const weatherDelay = impact.activities[activity].delay
    const tempDelay = tempImpact.activities[activity]?.delay || 0
    const maxDelay = Math.max(weatherDelay, tempDelay)

    let status
    if (maxDelay === 0) status = "Optimal"
    else if (maxDelay === 1) status = "Caution"
    else if (maxDelay === 2) status = "Delayed"
    else status = "Halted"

    combinedImpact.activities[activity] = {
      delay: maxDelay,
      status: status,
    }
  }

  return {
    ...combinedImpact,
    condition: mainWeather,
    temperature: temp,
    humidity: weatherData.main.humidity,
    windSpeed: weatherData.wind.speed,
    description: weatherData.weather[0].description,
    icon: weatherData.weather[0].icon,
  }
}

// Process forecast data into daily summaries
export function processForecast(forecastData) {
  if (!forecastData || !forecastData.list) {
    return []
  }

  const dailyForecasts = {}

  // Group forecast by day
  forecastData.list.forEach((item) => {
    const date = new Date(item.dt * 1000)
    const day = date.toISOString().split("T")[0]

    if (!dailyForecasts[day]) {
      dailyForecasts[day] = {
        date: day,
        forecasts: [],
      }
    }

    dailyForecasts[day].forecasts.push(item)
  })

  // Process each day to get summary
  const processedForecast = Object.values(dailyForecasts).map((day) => {
    // Find the worst weather condition for the day
    let worstImpact = "Low"
    let mainWeather = "Clear"
    let icon = "01d"
    let maxTemp = -100
    let minTemp = 100
    let maxWind = 0

    day.forecasts.forEach((forecast) => {
      const weather = forecast.weather[0].main
      const impact = WEATHER_IMPACT[weather]?.impact || "Low"
      const temp = forecast.main.temp
      const wind = forecast.wind.speed

      // Update worst impact
      if (
        impact === "High" ||
        (impact === "Moderate" && worstImpact !== "High") ||
        (impact === "Low" && worstImpact === "Unknown")
      ) {
        worstImpact = impact
        mainWeather = weather
        icon = forecast.weather[0].icon
      }

      // Update temperature range
      if (temp > maxTemp) maxTemp = temp
      if (temp < minTemp) minTemp = temp

      // Update max wind
      if (wind > maxWind) maxWind = wind
    })

    // Get impact on activities
    const activities = WEATHER_IMPACT[mainWeather]?.activities || WEATHER_IMPACT.default.activities

    return {
      date: day.date,
      condition: mainWeather,
      impact: worstImpact,
      icon: icon,
      temperature: {
        min: Math.round(minTemp),
        max: Math.round(maxTemp),
      },
      windSpeed: maxWind,
      activities: activities,
    }
  })

  return processedForecast
}

// Generate schedule recommendations based on weather forecast
export function generateScheduleRecommendations(forecast, currentActivities) {
  if (!forecast || forecast.length === 0 || !currentActivities) {
    return []
  }

  const recommendations = []

  // Check each activity against the forecast
  for (const activity of currentActivities) {
    const activityName = activity.name
    const bestDays = []
    const worstDays = []

    // Find best and worst days for this activity
    forecast.forEach((day) => {
      const impact = day.activities[activityName]
      if (impact) {
        if (impact.status === "Optimal") {
          bestDays.push({
            date: day.date,
            condition: day.condition,
          })
        } else if (impact.status === "Halted" || impact.status === "Delayed") {
          worstDays.push({
            date: day.date,
            condition: day.condition,
            status: impact.status,
          })
        }
      }
    })

    // Generate recommendations
    if (bestDays.length > 0) {
      recommendations.push({
        activity: activityName,
        type: "optimal",
        message: `Schedule ${activityName} on ${bestDays.map((d) => formatDate(d.date)).join(", ")} for optimal conditions.`,
        days: bestDays,
      })
    }

    if (worstDays.length > 0) {
      recommendations.push({
        activity: activityName,
        type: "avoid",
        message: `Avoid ${activityName} on ${worstDays.map((d) => formatDate(d.date)).join(", ")} due to ${worstDays[0].condition.toLowerCase()} conditions.`,
        days: worstDays,
      })
    }
  }

  return recommendations
}

// Helper function to format date
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
}

// Add this new function to analyze if a specific date should be rescheduled
export function shouldRescheduleDate(date, forecastData) {
  if (!forecastData || !forecastData.length) return false

  // Convert date to string format for comparison
  const dateString = typeof date === "string" ? date : date.toISOString().split("T")[0]

  // Find forecast for this date
  const dayForecast = forecastData.find((day) => day.date === dateString)

  // If no forecast data available, don't reschedule
  if (!dayForecast) return false

  // Check if weather conditions warrant rescheduling
  const condition = dayForecast.condition
  const impact = dayForecast.impact

  // Weather conditions that require rescheduling
  return condition === "Rain" || condition === "Thunderstorm" || condition === "Snow" || impact === "High"
}

// Add this function to find the next suitable date
export function findNextSuitableDate(date, forecastData, daysToCheck = 14) {
  if (!forecastData || !forecastData.length) return new Date(date.getTime() + 86400000) // Default to next day

  // Start with the next day
  const checkDate = new Date(date)
  checkDate.setDate(checkDate.getDate() + 1)

  // Check up to daysToCheck days
  for (let i = 0; i < daysToCheck; i++) {
    const dateString = checkDate.toISOString().split("T")[0]

    // If this date is suitable (not requiring rescheduling), return it
    if (!shouldRescheduleDate(dateString, forecastData)) {
      return checkDate
    }

    // Otherwise check the next day
    checkDate.setDate(checkDate.getDate() + 1)
  }

  // If no suitable date found, return the last checked date
  return checkDate
}

// Add an improved function to handle automatic task rescheduling based on weather sensitivity

// At the end of the file, add this new function:
// Shift a task by a given number of days, adjusting start and end dates
export function shiftTaskByDays(task, days) {
  if (!task) return null

  const newStartDate = new Date(task.startDate || task.currentStartDate)
  newStartDate.setDate(newStartDate.getDate() + days)

  const newEndDate = new Date(task.endDate || task.currentEndDate)
  newEndDate.setDate(newEndDate.getDate() + days)

  return {
    ...task,
    currentStartDate: newStartDate,
    currentEndDate: newEndDate,
    rescheduled: true,
    status: "Rescheduled",
  }
}

// Function to maintain timeline sequence after task rescheduling
export function maintainProjectTimeline(tasks) {
  if (!tasks || tasks.length === 0) return []

  // Sort tasks by start date first
  const sortedTasks = [...tasks].sort(
    (a, b) => (a.currentStartDate || a.startDate) - (b.currentStartDate || b.startDate),
  )

  // Ensure each task starts after the previous one ends
  for (let i = 1; i < sortedTasks.length; i++) {
    const prevTask = sortedTasks[i - 1]
    const currentTask = sortedTasks[i]
    const prevEndDate = prevTask.currentEndDate || prevTask.endDate
    const currentStartDate = currentTask.currentStartDate || currentTask.startDate

    // If current task starts before previous task ends, adjust it
    if (currentStartDate < prevEndDate) {
      // Calculate task duration to maintain it
      const currentDuration =
        (currentTask.currentEndDate || currentTask.endDate) - (currentTask.currentStartDate || currentTask.startDate)

      // Set new start date to be right after previous task ends
      const newStartDate = new Date(prevEndDate)
      const newEndDate = new Date(newStartDate.getTime() + currentDuration)

      sortedTasks[i] = {
        ...currentTask,
        currentStartDate: newStartDate,
        currentEndDate: newEndDate,
        status: currentTask.weatherSensitive ? "Rescheduled" : "Adjusted",
      }
    }
  }

  return sortedTasks
}

// Add this function to analyze weather impact on labor requirements
export function analyzeLaborImpact(weatherData, laborRequirements, sensitivity = 0.5) {
  if (!weatherData || !laborRequirements) {
    return { labor: { ...laborRequirements }, impact: "None" }
  }

  // Clone labor requirements to avoid modifying the original
  const adjustedLabor = { ...laborRequirements }

  // Get weather condition and analyze impact
  const mainWeather = weatherData.weather?.[0]?.main || "Clear"
  let laborChangePercentage = 0
  let impact = "Low"

  // Determine labor change percentage based on weather condition
  switch (mainWeather) {
    case "Rain":
      laborChangePercentage = 0.3 * sensitivity // 30% increase in labor needed
      impact = "Moderate"
      break
    case "Thunderstorm":
      laborChangePercentage = 0.5 * sensitivity // 50% increase
      impact = "High"
      break
    case "Snow":
      laborChangePercentage = 0.4 * sensitivity // 40% increase
      impact = "High"
      break
    case "Clouds":
      laborChangePercentage = 0.1 * sensitivity // 10% increase
      impact = "Low"
      break
    case "Clear":
      laborChangePercentage = 0 // No change needed
      impact = "None"
      break
    default:
      laborChangePercentage = 0.1 * sensitivity // Default 10% increase
      impact = "Low"
  }

  // Adjust labor based on percentage
  if (laborChangePercentage > 0) {
    Object.keys(adjustedLabor).forEach((workerType) => {
      const currentCount = adjustedLabor[workerType]
      const additionalWorkers = Math.ceil(currentCount * laborChangePercentage)
      adjustedLabor[workerType] = currentCount + additionalWorkers
    })
  }

  return {
    labor: adjustedLabor,
    impact,
    changePercentage: laborChangePercentage,
  }
}

// Add this function to generate optimized labor plan based on weather forecast
export function generateOptimizedLaborPlan(projectData, weatherForecast) {
  if (!projectData || !weatherForecast) {
    return null
  }

  // Clone project data to avoid modifying the original
  const optimizedPlan = JSON.parse(JSON.stringify(projectData))

  // Process each phase and adjust labor based on weather forecast
  if (optimizedPlan.phases) {
    optimizedPlan.phases.forEach((phase) => {
      // Skip non-weather-sensitive phases
      if (!phase.weatherSensitive) {
        return
      }

      // Get relevant weather forecast for this phase
      const phaseStartDate = new Date(phase.startDate)
      const phaseEndDate = new Date(phase.endDate)

      const relevantForecast = weatherForecast.filter((day) => {
        const forecastDate = new Date(day.date)
        return forecastDate >= phaseStartDate && forecastDate <= phaseEndDate
      })

      // If we have weather data, calculate average impact
      if (relevantForecast.length > 0) {
        let totalImpact = 0
        let badWeatherDays = 0

        // Calculate total impact
        relevantForecast.forEach((day) => {
          const impact = day.impact === "High" ? 0.5 : day.impact === "Moderate" ? 0.3 : 0.1

          totalImpact += impact
          if (day.impact === "High" || day.impact === "Moderate") {
            badWeatherDays++
          }
        })

        // Calculate average impact
        const avgImpact = totalImpact / relevantForecast.length

        // Adjust labor if significant impact
        if (avgImpact > 0.2) {
          const laborChanges = {}

          // Apply impact to each worker type
          Object.keys(phase.labor).forEach((workerType) => {
            const currentCount = phase.labor[workerType]
            const additionalWorkers = Math.ceil(currentCount * avgImpact * phase.sensitivity)

            if (additionalWorkers > 0) {
              laborChanges[workerType] = additionalWorkers
              phase.labor[workerType] = currentCount + additionalWorkers
            }
          })

          // Store changes for reporting
          phase.laborChanges = laborChanges
          phase.weatherImpact = {
            avgImpact,
            badWeatherDays,
            description:
              badWeatherDays > 0 ? `${badWeatherDays} days of adverse weather expected` : "Minimal weather impact",
          }
        }
      }
    })
  }

  return optimizedPlan
}
