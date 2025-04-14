"use client"

import { useState, useEffect } from "react"

export default function SustainabilityInsights({ projectData }) {
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedMaterial, setSelectedMaterial] = useState("concrete")
  const [comparisonData, setComparisonData] = useState(null)

  useEffect(() => {
    if (projectData) {
      generateInsights()
    } else {
      // Use mock data if no project data is provided
      generateMockInsights()
    }
  }, [projectData])

  const generateInsights = async () => {
    setLoading(true)

    try {
      // In a real app, this would use the actual project data
      // For demonstration, we'll use mock data
      generateMockInsights()
    } catch (error) {
      console.error("Error generating sustainability insights:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateMockInsights = () => {
    // Mock sustainability insights data
    const mockInsights = {
      totalCarbonFootprint: 125000, // kg CO2
      materialBreakdown: [
        { material: "Concrete", percentage: 45, carbonFootprint: 56250 },
        { material: "Steel", percentage: 30, carbonFootprint: 37500 },
        { material: "Wood", percentage: 10, carbonFootprint: 12500 },
        { material: "Glass", percentage: 5, carbonFootprint: 6250 },
        { material: "Other", percentage: 10, carbonFootprint: 12500 },
      ],
      recommendations: [
        {
          title: "Use Low-Carbon Concrete",
          description: "Switching to low-carbon concrete can reduce emissions by up to 50%",
          potentialSavings: 28125, // kg CO2
          costImplication: "+5%",
        },
        {
          title: "Recycled Steel",
          description: "Using recycled steel can reduce steel-related emissions by up to 60%",
          potentialSavings: 22500, // kg CO2
          costImplication: "+2%",
        },
        {
          title: "Optimize Material Usage",
          description: "Reducing material waste by 10% through better planning",
          potentialSavings: 12500, // kg CO2
          costImplication: "-3%",
        },
        {
          title: "Local Sourcing",
          description: "Sourcing materials locally to reduce transportation emissions",
          potentialSavings: 6250, // kg CO2
          costImplication: "Neutral",
        },
      ],
      benchmarks: {
        industry: 150000, // kg CO2
        bestPractice: 100000, // kg CO2
        yourProject: 125000, // kg CO2
      },
    }

    setInsights(mockInsights)
    setLoading(false)
  }

  const handleMaterialChange = (material) => {
    setSelectedMaterial(material)

    // Generate comparison data for the selected material
    const materialData = {
      concrete: {
        standard: { carbonFootprint: 100, cost: 100 },
        lowCarbon: { carbonFootprint: 50, cost: 105 },
        ultraLowCarbon: { carbonFootprint: 30, cost: 115 },
      },
      steel: {
        standard: { carbonFootprint: 100, cost: 100 },
        recycled: { carbonFootprint: 40, cost: 102 },
        highlyRecycled: { carbonFootprint: 25, cost: 105 },
      },
      wood: {
        standard: { carbonFootprint: 100, cost: 100 },
        certified: { carbonFootprint: 80, cost: 110 },
        engineered: { carbonFootprint: 60, cost: 120 },
      },
    }

    setComparisonData(materialData[material] || materialData.concrete)
  }

  if (loading) {
    return <div className="p-6 text-center">Loading sustainability insights...</div>
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Sustainability Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2">Total Carbon Footprint</h3>
          <p className="text-3xl font-bold text-green-700">{insights.totalCarbonFootprint.toLocaleString()} kg CO₂</p>
          <p className="text-sm text-gray-600 mt-1">
            {insights.benchmarks.yourProject < insights.benchmarks.industry
              ? `${Math.round((1 - insights.benchmarks.yourProject / insights.benchmarks.industry) * 100)}% below industry average`
              : `${Math.round((insights.benchmarks.yourProject / insights.benchmarks.industry - 1) * 100)}% above industry average`}
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2">Potential CO₂ Savings</h3>
          <p className="text-3xl font-bold text-blue-700">
            {insights.recommendations.reduce((sum, rec) => sum + rec.potentialSavings, 0).toLocaleString()} kg
          </p>
          <p className="text-sm text-gray-600 mt-1">By implementing all recommendations</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-md">
          <h3 className="font-semibold text-lg mb-2">Sustainability Score</h3>
          <p className="text-3xl font-bold text-purple-700">
            {Math.round(
              (1 -
                (insights.benchmarks.yourProject - insights.benchmarks.bestPractice) /
                  (insights.benchmarks.industry - insights.benchmarks.bestPractice)) *
                100,
            )}
            <span className="text-xl">/100</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">Based on industry benchmarks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold text-lg mb-3">Material Carbon Breakdown</h3>
          <div className="space-y-3">
            {insights.materialBreakdown.map((item) => (
              <div key={item.material}>
                <div className="flex justify-between mb-1">
                  <span>{item.material}</span>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                </div>
                <div className="text-sm text-gray-600 mt-1">{item.carbonFootprint.toLocaleString()} kg CO₂</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-3">Benchmark Comparison</h3>
          <div className="relative pt-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                  Best Practice
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-green-600">
                  {insights.benchmarks.bestPractice.toLocaleString()} kg CO₂
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full"
                style={{ width: `${(insights.benchmarks.bestPractice / insights.benchmarks.industry) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between mb-2 mt-4">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  Your Project
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {insights.benchmarks.yourProject.toLocaleString()} kg CO₂
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full"
                style={{ width: `${(insights.benchmarks.yourProject / insights.benchmarks.industry) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between mb-2 mt-4">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">
                  Industry Average
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-gray-600">
                  {insights.benchmarks.industry.toLocaleString()} kg CO₂
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-gray-600 h-3 rounded-full" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3">Sustainability Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.recommendations.map((rec, index) => (
            <div key={index} className="border rounded-md p-4">
              <h4 className="font-medium text-lg">{rec.title}</h4>
              <p className="text-gray-600 mb-2">{rec.description}</p>
              <div className="flex justify-between">
                <span className="text-green-700 font-medium">
                  Saves: {rec.potentialSavings.toLocaleString()} kg CO₂
                </span>
                <span
                  className={`font-medium ${
                    rec.costImplication.startsWith("+")
                      ? "text-red-600"
                      : rec.costImplication.startsWith("-")
                        ? "text-green-600"
                        : "text-gray-600"
                  }`}
                >
                  Cost: {rec.costImplication}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Material Alternatives Comparison</h3>
        <div className="mb-4">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md ${selectedMaterial === "concrete" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => handleMaterialChange("concrete")}
            >
              Concrete
            </button>
            <button
              className={`px-4 py-2 rounded-md ${selectedMaterial === "steel" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => handleMaterialChange("steel")}
            >
              Steel
            </button>
            <button
              className={`px-4 py-2 rounded-md ${selectedMaterial === "wood" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              onClick={() => handleMaterialChange("wood")}
            >
              Wood
            </button>
          </div>
        </div>

        {comparisonData && (
          <div className="border rounded-md p-4">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left py-2">Option</th>
                  <th className="text-left py-2">Carbon Footprint</th>
                  <th className="text-left py-2">Relative Cost</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(comparisonData).map(([key, data]) => (
                  <tr key={key} className="border-t">
                    <td className="py-2 capitalize">{key.replace(/([A-Z])/g, " $1")}</td>
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${data.carbonFootprint}%` }}
                          ></div>
                        </div>
                        <span>{data.carbonFootprint}%</span>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${data.cost}%` }}></div>
                        </div>
                        <span>{data.cost}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 text-sm text-gray-600">
              <p>* Carbon footprint values are relative to standard options (100%)</p>
              <p>* Cost values are relative to standard options (100%)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
