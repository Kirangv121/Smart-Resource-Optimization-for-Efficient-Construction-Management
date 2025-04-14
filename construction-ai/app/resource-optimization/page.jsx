"use client"

import { useState, useEffect } from "react"
import CarbonFootprintTracker from "../../components/carbon-footprint-tracker"

export default function ResourceOptimizationPage() {
  const [projectData, setProjectData] = useState(null)
  const [optimizationResults, setOptimizationResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [optimizing, setOptimizing] = useState(false)
  const [optimizationPriority, setOptimizationPriority] = useState("cost")

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
          { id: 1, name: "Concrete", quantity: 500, unit: "ton", unitCost: 120, totalCost: 60000 },
          { id: 2, name: "Steel", quantity: 200, unit: "ton", unitCost: 800, totalCost: 160000 },
          { id: 3, name: "Wood", quantity: 100, unit: "ton", unitCost: 300, totalCost: 30000 },
          { id: 4, name: "Glass", quantity: 50, unit: "ton", unitCost: 500, totalCost: 25000 },
        ],
        equipment: [
          { id: 1, name: "Excavator", quantity: 2, dailyCost: 500, totalCost: 10000 },
          { id: 2, name: "Crane", quantity: 1, dailyCost: 800, totalCost: 16000 },
          { id: 3, name: "Concrete Mixer", quantity: 3, dailyCost: 300, totalCost: 9000 },
        ],
        labor: [
          { id: 1, role: "Foreman", quantity: 2, hourlyRate: 45, totalCost: 18000 },
          { id: 2, role: "Skilled Labor", quantity: 10, hourlyRate: 35, totalCost: 70000 },
          { id: 3, role: "General Labor", quantity: 15, hourlyRate: 25, totalCost: 75000 },
        ],
        totalCost: 473000,
        duration: 60, // days
      }

      setProjectData(mockProjectData)
      setLoading(false)
    }, 1000)
  }

  const handleOptimize = async () => {
    setOptimizing(true)

    // In a real app, this would call your optimization API
    // For demonstration, we'll simulate an optimization process
    setTimeout(() => {
      const optimizedData = {
        materials: [
          { id: 1, name: "Concrete", quantity: 475, unit: "ton", unitCost: 120, totalCost: 57000, savings: 3000 },
          { id: 2, name: "Steel", quantity: 190, unit: "ton", unitCost: 800, totalCost: 152000, savings: 8000 },
          { id: 3, name: "Wood", quantity: 95, unit: "ton", unitCost: 300, totalCost: 28500, savings: 1500 },
          { id: 4, name: "Glass", quantity: 48, unit: "ton", unitCost: 500, totalCost: 24000, savings: 1000 },
        ],
        equipment: [
          { id: 1, name: "Excavator", quantity: 2, dailyCost: 500, totalCost: 9000, savings: 1000 },
          { id: 2, name: "Crane", quantity: 1, dailyCost: 800, totalCost: 14400, savings: 1600 },
          { id: 3, name: "Concrete Mixer", quantity: 2, dailyCost: 300, totalCost: 6000, savings: 3000 },
        ],
        labor: [
          { id: 1, role: "Foreman", quantity: 2, hourlyRate: 45, totalCost: 18000, savings: 0 },
          { id: 2, role: "Skilled Labor", quantity: 9, hourlyRate: 35, totalCost: 63000, savings: 7000 },
          { id: 3, role: "General Labor", quantity: 14, hourlyRate: 25, totalCost: 70000, savings: 5000 },
        ],
        totalCost: 441900,
        originalCost: 473000,
        totalSavings: 31100,
        savingsPercentage: 6.6,
        duration: 58, // days
        durationSavings: 2, // days
        carbonFootprint: {
          original: 125000, // kg CO2
          optimized: 118750, // kg CO2
          savings: 6250, // kg CO2
          savingsPercentage: 5,
        },
      }

      setOptimizationResults(optimizedData)
      setOptimizing(false)
    }, 2000)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Resource Optimization</h1>
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
          <p className="mt-2">Loading project data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Resource Optimization</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Optimization Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Optimization Priority</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="priority"
                  value="cost"
                  checked={optimizationPriority === "cost"}
                  onChange={() => setOptimizationPriority("cost")}
                />
                <span className="ml-2">Cost Reduction</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="priority"
                  value="time"
                  checked={optimizationPriority === "time"}
                  onChange={() => setOptimizationPriority("time")}
                />
                <span className="ml-2">Time Reduction</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio"
                  name="priority"
                  value="carbon"
                  checked={optimizationPriority === "carbon"}
                  onChange={() => setOptimizationPriority("carbon")}
                />
                <span className="ml-2">Carbon Reduction</span>
              </label>
            </div>
          </div>

          <div className="flex items-end">
            <button
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 w-full md:w-auto"
              onClick={handleOptimize}
              disabled={optimizing}
            >
              {optimizing ? "Optimizing..." : "Optimize Resources"}
            </button>
          </div>
        </div>
      </div>

      {optimizationResults ? (
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Optimization Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-2">Cost Savings</h3>
                <p className="text-3xl font-bold text-green-700">
                  ${optimizationResults.totalSavings.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">{optimizationResults.savingsPercentage}% reduction</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-2">Time Savings</h3>
                <p className="text-3xl font-bold text-blue-700">{optimizationResults.durationSavings} days</p>
                <p className="text-sm text-gray-600 mt-1">
                  {Math.round((optimizationResults.durationSavings / projectData.duration) * 100)}% reduction
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-md">
                <h3 className="font-semibold text-lg mb-2">Carbon Reduction</h3>
                <p className="text-3xl font-bold text-purple-700">
                  {optimizationResults.carbonFootprint.savings.toLocaleString()} kg
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {optimizationResults.carbonFootprint.savingsPercentage}% reduction
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Materials Optimization</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Material
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Original Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Optimized Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Original Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Optimized Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Savings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {optimizationResults.materials.map((material) => (
                      <tr key={material.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{material.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {projectData.materials.find((m) => m.id === material.id).quantity} {material.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {material.quantity} {material.unit}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">${material.unitCost}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${projectData.materials.find((m) => m.id === material.id).totalCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">${material.totalCost.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-600">
                          ${material.savings.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Equipment Optimization</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Equipment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Original Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Optimized Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Daily Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Original Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Optimized Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Savings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {optimizationResults.equipment.map((equipment) => (
                      <tr key={equipment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{equipment.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {projectData.equipment.find((e) => e.id === equipment.id).quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{equipment.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${equipment.dailyCost}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${projectData.equipment.find((e) => e.id === equipment.id).totalCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">${equipment.totalCost.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-600">
                          ${equipment.savings.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3">Labor Optimization</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Original Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Optimized Qty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hourly Rate
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Original Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Optimized Cost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Savings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {optimizationResults.labor.map((labor) => (
                      <tr key={labor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{labor.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {projectData.labor.find((l) => l.id === labor.id).quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{labor.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap">${labor.hourlyRate}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ${projectData.labor.find((l) => l.id === labor.id).totalCost.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">${labor.totalCost.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-green-600">
                          ${labor.savings.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <CarbonFootprintTracker
            projectMaterials={optimizationResults.materials.map((m) => ({
              type: m.name.toLowerCase(),
              quantity: m.quantity,
              unit: m.unit,
            }))}
            equipmentUsage={optimizationResults.equipment.map((e) => ({
              name: e.name,
              fuelType: "diesel", // Simplified for demo
              fuelUsage: e.quantity * 100, // Simplified for demo
            }))}
          />
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Current Resource Allocation</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-md">
              <h3 className="font-semibold text-lg mb-2">Total Cost</h3>
              <p className="text-3xl font-bold text-blue-700">${projectData.totalCost.toLocaleString()}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-md">
              <h3 className="font-semibold text-lg mb-2">Project Duration</h3>
              <p className="text-3xl font-bold text-green-700">{projectData.duration} days</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-md">
              <h3 className="font-semibold text-lg mb-2">Resource Types</h3>
              <p className="text-3xl font-bold text-purple-700">
                {projectData.materials.length + projectData.equipment.length + projectData.labor.length}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Materials</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Material
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projectData.materials.map((material) => (
                    <tr key={material.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{material.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{material.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{material.unit}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${material.unitCost}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${material.totalCost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Equipment</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Daily Cost
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projectData.equipment.map((equipment) => (
                    <tr key={equipment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{equipment.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{equipment.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${equipment.dailyCost}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${equipment.totalCost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-3">Labor</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hourly Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projectData.labor.map((labor) => (
                    <tr key={labor.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{labor.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{labor.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${labor.hourlyRate}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${labor.totalCost.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-gray-600 mb-4">
              Click the "Optimize Resources" button above to generate an optimized resource allocation plan that can
              help reduce costs, time, and carbon footprint.
            </p>

            <CarbonFootprintTracker
              projectMaterials={projectData.materials.map((m) => ({
                type: m.name.toLowerCase(),
                quantity: m.quantity,
                unit: m.unit,
              }))}
              equipmentUsage={projectData.equipment.map((e) => ({
                name: e.name,
                fuelType: "diesel", // Simplified for demo
                fuelUsage: e.quantity * 100, // Simplified for demo
              }))}
            />
          </div>
        </div>
      )}
    </div>
  )
}
