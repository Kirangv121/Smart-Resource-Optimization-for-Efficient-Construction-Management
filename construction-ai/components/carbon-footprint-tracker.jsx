"use client"

import { useState, useEffect } from "react"
import { getMaterialOptions, getFuelOptions } from "../utils/carbon-footprint-service"

export default function CarbonFootprintTracker({ projectMaterials, equipmentUsage }) {
  const [materialFootprint, setMaterialFootprint] = useState(null)
  const [fuelFootprint, setFuelFootprint] = useState(null)
  const [totalFootprint, setTotalFootprint] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedMaterial, setSelectedMaterial] = useState("concrete")
  const [materialQuantity, setMaterialQuantity] = useState(1)
  const [selectedFuel, setSelectedFuel] = useState("diesel")
  const [fuelQuantity, setFuelQuantity] = useState(1)

  const materialOptions = getMaterialOptions()
  const fuelOptions = getFuelOptions()

  // Calculate footprint for project materials if provided
  useEffect(() => {
    if (projectMaterials && projectMaterials.length > 0) {
      calculateProjectFootprint()
    }
  }, [projectMaterials])

  const calculateProjectFootprint = async () => {
    if (!projectMaterials || projectMaterials.length === 0) return

    setLoading(true)
    setError(null)

    try {
      // Mock calculation for demonstration
      // In a real app, you would use the actual API
      let totalCO2 = 0

      for (const material of projectMaterials) {
        // Simplified calculation based on material type and quantity
        const co2Factor = getSimplifiedCO2Factor(material.type)
        totalCO2 += material.quantity * co2Factor
      }

      for (const equipment of equipmentUsage || []) {
        const fuelFactor = getSimplifiedFuelFactor(equipment.fuelType)
        totalCO2 += equipment.fuelUsage * fuelFactor
      }

      setTotalFootprint(totalCO2)
    } catch (err) {
      console.error("Error calculating project footprint:", err)
      setError("Failed to calculate carbon footprint")
    } finally {
      setLoading(false)
    }
  }

  const getSimplifiedCO2Factor = (materialType) => {
    // Simplified CO2 factors for demonstration (kg CO2 per unit)
    const factors = {
      concrete: 100,
      steel: 1800,
      wood: 30,
      glass: 800,
      aluminum: 1500,
      plastic: 600,
      insulation: 100,
      brick: 200,
      asphalt: 90,
    }

    return factors[materialType] || 100
  }

  const getSimplifiedFuelFactor = (fuelType) => {
    // Simplified CO2 factors for demonstration (kg CO2 per gallon)
    const factors = {
      diesel: 10.2,
      gasoline: 8.9,
      natural_gas: 5.3,
      propane: 5.7,
    }

    return factors[fuelType] || 10
  }

  const handleCalculateMaterial = async () => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would call the actual API
      const co2Factor = getSimplifiedCO2Factor(selectedMaterial)
      const result = {
        data: {
          attributes: {
            carbon_kg: materialQuantity * co2Factor,
          },
        },
      }

      setMaterialFootprint(result)
      updateTotalFootprint(result.data.attributes.carbon_kg, fuelFootprint?.data?.attributes?.carbon_kg || 0)
    } catch (err) {
      console.error("Error calculating material footprint:", err)
      setError("Failed to calculate material carbon footprint")
    } finally {
      setLoading(false)
    }
  }

  const handleCalculateFuel = async () => {
    setLoading(true)
    setError(null)

    try {
      // In a real app, this would call the actual API
      const fuelFactor = getSimplifiedFuelFactor(selectedFuel)
      const result = {
        data: {
          attributes: {
            carbon_kg: fuelQuantity * fuelFactor,
          },
        },
      }

      setFuelFootprint(result)
      updateTotalFootprint(materialFootprint?.data?.attributes?.carbon_kg || 0, result.data.attributes.carbon_kg)
    } catch (err) {
      console.error("Error calculating fuel footprint:", err)
      setError("Failed to calculate fuel carbon footprint")
    } finally {
      setLoading(false)
    }
  }

  const updateTotalFootprint = (materialCO2, fuelCO2) => {
    setTotalFootprint(materialCO2 + fuelCO2)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Carbon Footprint Tracker</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-3">Material Carbon Impact</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Material Type</label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
              >
                {materialOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity (tons)</label>
              <input
                type="number"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={materialQuantity}
                onChange={(e) => setMaterialQuantity(Number(e.target.value))}
                min="0.1"
                step="0.1"
              />
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              onClick={handleCalculateMaterial}
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate Material Impact"}
            </button>

            {materialFootprint && (
              <div className="mt-3 p-3 bg-gray-100 rounded-md">
                <p className="font-medium">Carbon Footprint:</p>
                <p className="text-xl font-bold text-green-700">
                  {materialFootprint.data.attributes.carbon_kg.toFixed(2)} kg CO₂
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="border p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-3">Equipment Fuel Impact</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Fuel Type</label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
              >
                {fuelOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity (gallons)</label>
              <input
                type="number"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                value={fuelQuantity}
                onChange={(e) => setFuelQuantity(Number(e.target.value))}
                min="0.1"
                step="0.1"
              />
            </div>

            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              onClick={handleCalculateFuel}
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate Fuel Impact"}
            </button>

            {fuelFootprint && (
              <div className="mt-3 p-3 bg-gray-100 rounded-md">
                <p className="font-medium">Carbon Footprint:</p>
                <p className="text-xl font-bold text-green-700">
                  {fuelFootprint.data.attributes.carbon_kg.toFixed(2)} kg CO₂
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-md">
        <h3 className="text-lg font-semibold mb-2">Total Project Carbon Footprint</h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-green-700">{totalFootprint.toFixed(2)} kg CO₂</p>
            <p className="text-sm text-gray-600">
              Equivalent to {(totalFootprint / 4000).toFixed(2)} cars driven for one year
            </p>
          </div>
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-green-700 text-4xl font-bold">CO₂</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Sustainability Recommendations</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Consider using recycled steel to reduce carbon footprint by up to 60%</li>
          <li>Low-carbon concrete alternatives can reduce emissions by 30-50%</li>
          <li>Optimize equipment usage to minimize fuel consumption</li>
          <li>Use locally sourced materials to reduce transportation emissions</li>
          <li>Implement waste reduction strategies to minimize material usage</li>
        </ul>
      </div>
    </div>
  )
}
