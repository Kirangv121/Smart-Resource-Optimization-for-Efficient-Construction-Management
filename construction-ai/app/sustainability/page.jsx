"use client"

import { useState, useEffect } from "react"
import CarbonFootprintTracker from "../../components/carbon-footprint-tracker"
import SustainabilityInsights from "../../components/sustainability-insights"

export default function SustainabilityPage() {
  const [projectData, setProjectData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch project data
    fetchProjectData()
  }, [])

  const fetchProjectData = async () => {
    // In a real app, this would fetch from your API
    // For demonstration, we'll use mock data
    setTimeout(() => {
      const mockProjectData = {
        materials: [
          { type: "concrete", quantity: 500, unit: "ton" },
          { type: "steel", quantity: 200, unit: "ton" },
          { type: "wood", quantity: 100, unit: "ton" },
          { type: "glass", quantity: 50, unit: "ton" },
        ],
        equipmentUsage: [
          { name: "Excavator", fuelType: "diesel", fuelUsage: 500 },
          { name: "Crane", fuelType: "diesel", fuelUsage: 300 },
          { name: "Generator", fuelType: "gasoline", fuelUsage: 200 },
        ],
      }

      setProjectData(mockProjectData)
      setLoading(false)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Sustainability Dashboard</h1>
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading sustainability data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Sustainability Dashboard</h1>

      <div className="grid grid-cols-1 gap-8">
        <CarbonFootprintTracker projectMaterials={projectData.materials} equipmentUsage={projectData.equipmentUsage} />

        <SustainabilityInsights projectData={projectData} />
      </div>
    </div>
  )
}
