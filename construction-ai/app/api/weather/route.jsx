import { NextResponse } from "next/server"

// Fallback weather data in case the API call fails
const FALLBACK_WEATHER_DATA = {
  coord: { lon: 72.8479, lat: 19.0144 },
  weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
  base: "stations",
  main: {
    temp: 32.5,
    feels_like: 34.2,
    temp_min: 32.0,
    temp_max: 33.0,
    pressure: 1010,
    humidity: 65,
  },
  visibility: 6000,
  wind: { speed: 3.6, deg: 260 },
  clouds: { all: 5 },
  dt: Date.now() / 1000,
  sys: {
    type: 1,
    id: 9052,
    country: "IN",
    sunrise: Date.now() / 1000 - 21600,
    sunset: Date.now() / 1000 + 21600,
  },
  timezone: 19800,
  id: 1275339,
  name: "Mumbai",
  cod: 200,
}

// OpenWeatherMap API key
const API_KEY = process.env.OPEN_WEATHER_API_KEY

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  let location = searchParams.get("location")

  // Ensure location is a valid string
  if (!location || typeof location === "object") {
    location = "Mumbai" // Default to Mumbai if location is invalid
  }

  try {
    console.log("Fetching real weather data for location:", location)

    // Call the OpenWeatherMap API with the provided API key
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`,
      { next: { revalidate: 1800 } }, // Cache for 30 minutes
    )

    if (!response.ok) {
      throw new Error(`Weather API returned ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Successfully fetched weather data for:", location)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in weather API route:", error.message)

    // Return fallback data instead of an error
    console.log("Using fallback weather data for:", location)

    // Customize the fallback data with the requested location
    const fallbackData = {
      ...FALLBACK_WEATHER_DATA,
      name: location,
    }

    return NextResponse.json(fallbackData)
  }
}
