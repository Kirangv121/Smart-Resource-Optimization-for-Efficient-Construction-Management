import { WeatherAdjustedLaborPlanner } from "@/components/weather-adjusted-labor-planner"

export default function LaborPlanningPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">AI-Powered Labor Planning</h1>
          <p className="text-white mt-2">
            Optimize labor resources and adjust staffing based on weather forecasts and project needs
          </p>
        </header>

        <div className="space-y-6">
          <WeatherAdjustedLaborPlanner />
        </div>
      </div>
    </div>
  )
}
