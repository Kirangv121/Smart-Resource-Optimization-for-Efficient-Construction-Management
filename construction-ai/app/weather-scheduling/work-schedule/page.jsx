import { WorkScheduleManager } from "../../../components/work-schedule-manager"

export default function WorkSchedulePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Weather-Based Work Schedule Management</h1>
          <p className="text-white mt-2">Dynamically adjust construction schedules based on real-time weather data</p>
        </header>

        <div className="space-y-6">
          <WorkScheduleManager />
        </div>
      </div>
    </div>
  )
}
