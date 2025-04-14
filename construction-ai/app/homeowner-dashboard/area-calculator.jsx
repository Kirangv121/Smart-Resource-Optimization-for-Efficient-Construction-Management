"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Function to format numbers in Indian currency format (e.g., 1,23,456)
function formatIndianCurrency(num) {
  const numStr = num.toString()
  let result = ""

  // Handle the decimal part if exists
  const parts = numStr.split(".")
  const intPart = parts[0]
  const decimalPart = parts.length > 1 ? "." + parts[1] : ""

  // Format the integer part with commas (Indian format: 1,23,456)
  let i = intPart.length
  let count = 0

  while (i--) {
    result = intPart[i] + result
    count++
    if (count === 3 && i !== 0) {
      result = "," + result
      count = 0
    } else if (count === 2 && i !== 0 && result.indexOf(",") !== -1) {
      result = "," + result
      count = 0
    }
  }

  return result + decimalPart
}

export function AreaCalculator({ onCalculate, length, width }) {
  const [area, setArea] = useState(0)
  const [materialCost, setMaterialCost] = useState(0)
  const [laborCost, setLaborCost] = useState(0)
  const [equipmentCost, setEquipmentCost] = useState(0)
  const [overheadCost, setOverheadCost] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [rate, setRate] = useState("2000")
  const [budgetLimit, setBudgetLimit] = useState(1000000) // 10 lakhs default budget limit
  const [showBudgetAlert, setShowBudgetAlert] = useState(false)

  // Material details
  const [materials, setMaterials] = useState([
    { name: "Cement Bags", quantity: 100, unitCost: 350, totalCost: 35000 },
    { name: "Bricks", quantity: 5000, unitCost: 10, totalCost: 50000 },
    { name: "Steel Rods", quantity: 200, unitCost: 500, totalCost: 100000 },
  ])

  // Labor details
  const [labor, setLabor] = useState([
    { type: "Mason", workers: 10, hourlyWage: 500, hoursWorked: 8, totalCost: 40000 },
    { type: "Carpenter", workers: 5, hourlyWage: 600, hoursWorked: 8, totalCost: 24000 },
    { type: "Electrician", workers: 3, hourlyWage: 700, hoursWorked: 8, totalCost: 16800 },
  ])

  // Equipment details
  const [equipment, setEquipment] = useState([
    { name: "Crane", rentalCostPerHour: 2000, hoursUsed: 5, totalCost: 10000 },
    { name: "Excavator", rentalCostPerHour: 3000, hoursUsed: 4, totalCost: 12000 },
    { name: "Concrete Mixer", rentalCostPerHour: 1500, hoursUsed: 6, totalCost: 9000 },
  ])

  // Overhead details
  const [overhead, setOverhead] = useState([
    { name: "Office Rent", cost: 10000 },
    { name: "Permits & Licensing", cost: 5000 },
    { name: "Insurance", cost: 3000 },
    { name: "Utilities", cost: 7000 },
    { name: "Miscellaneous", cost: 5000 },
  ])

  // Calculate costs when dimensions change
  useEffect(() => {
    if (length && width) {
      const calculatedArea = Number.parseFloat(length) * Number.parseFloat(width)

      // Scale factor based on area (reference area is 1000 sq ft)
      const scaleFactor = calculatedArea / 1000

      // Update material quantities and costs based on area
      const updatedMaterials = materials.map((material) => {
        const scaledQuantity = Math.round(material.quantity * scaleFactor)
        const scaledCost = scaledQuantity * material.unitCost
        return {
          ...material,
          quantity: scaledQuantity,
          totalCost: scaledCost,
        }
      })

      // Update labor based on area
      const updatedLabor = labor.map((item) => {
        const scaledWorkers = Math.max(1, Math.round(item.workers * scaleFactor))
        const scaledCost = scaledWorkers * item.hourlyWage * item.hoursWorked
        return {
          ...item,
          workers: scaledWorkers,
          totalCost: scaledCost,
        }
      })

      // Update equipment based on area
      const updatedEquipment = equipment.map((item) => {
        const scaledHours = Math.max(1, Math.round(item.hoursUsed * scaleFactor))
        const scaledCost = item.rentalCostPerHour * scaledHours
        return {
          ...item,
          hoursUsed: scaledHours,
          totalCost: scaledCost,
        }
      })

      // Update overhead costs based on area
      const updatedOverhead = overhead.map((item) => {
        return {
          ...item,
          cost: Math.round(item.cost * scaleFactor),
        }
      })

      // Calculate total costs for each category
      const calculatedMaterialCost = updatedMaterials.reduce((sum, item) => sum + item.totalCost, 0)
      const calculatedLaborCost = updatedLabor.reduce((sum, item) => sum + item.totalCost, 0)
      const calculatedEquipmentCost = updatedEquipment.reduce((sum, item) => sum + item.totalCost, 0)
      const calculatedOverheadCost = updatedOverhead.reduce((sum, item) => sum + item.cost, 0)

      // Calculate total cost
      const calculatedTotalCost =
        calculatedMaterialCost + calculatedLaborCost + calculatedEquipmentCost + calculatedOverheadCost

      // Update state
      setArea(calculatedArea)
      setMaterials(updatedMaterials)
      setLabor(updatedLabor)
      setEquipment(updatedEquipment)
      setOverhead(updatedOverhead)
      setMaterialCost(calculatedMaterialCost)
      setLaborCost(calculatedLaborCost)
      setEquipmentCost(calculatedEquipmentCost)
      setOverheadCost(calculatedOverheadCost)
      setTotalCost(calculatedTotalCost)

      // Check if budget limit is exceeded
      setShowBudgetAlert(calculatedTotalCost > budgetLimit)

      // Pass data to parent component - but only once per calculation
      onCalculate(calculatedArea, calculatedTotalCost)
    }
  }, [length, width, budgetLimit]) // Remove rate, materials, labor, equipment, overhead, onCalculate from dependencies

  // Handle budget limit change
  const handleBudgetLimitChange = (e) => {
    const newLimit = Number.parseFloat(e.target.value) || 0
    setBudgetLimit(newLimit)
    setShowBudgetAlert(totalCost > newLimit)
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">Construction Cost Calculator</CardTitle>
        <Calculator className="h-5 w-5 text-blue-400" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="length" className="text-white">
                Length (ft)
              </Label>
              <div className="text-xl font-bold text-white">{length || "0"}</div>
            </div>
            <div>
              <Label htmlFor="width" className="text-white">
                Width (ft)
              </Label>
              <div className="text-xl font-bold text-white">{width || "0"}</div>
            </div>
            <div>
              <Label htmlFor="budget-limit" className="text-white">
                Budget Limit (₹)
              </Label>
              <Input
                id="budget-limit"
                value={budgetLimit}
                onChange={handleBudgetLimitChange}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          {showBudgetAlert && (
            <div className="bg-red-900/30 border border-red-500 p-4 rounded-lg flex items-center gap-2 text-white">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span>
                Budget limit exceeded! Current estimate is ₹{formatIndianCurrency(totalCost)}, which is ₹
                {formatIndianCurrency(totalCost - budgetLimit)} over your budget.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-gray-700 p-4 rounded-lg">
              <Label className="text-white mb-2 block">Total Area</Label>
              <div className="text-2xl font-bold text-white">{area.toLocaleString()} sq ft</div>
            </div>
            <div className="bg-blue-600/30 p-4 rounded-lg">
              <Label className="text-white mb-2 block">Estimated Total Cost</Label>
              <div className="text-2xl font-bold text-white">₹{formatIndianCurrency(totalCost)}</div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-white">
                  <span>Budget Utilization:</span>
                  <span>{Math.min(100, Math.round((totalCost / budgetLimit) * 100))}%</span>
                </div>
                <Progress value={Math.min(100, (totalCost / budgetLimit) * 100)} className="h-2 mt-1" />
              </div>
            </div>
          </div>

          <div className="bg-blue-600/20 p-4 rounded-lg mt-2">
            <h3 className="text-lg font-semibold text-white mb-4">Cost Breakdown</h3>

            <div className="space-y-6 text-white">
              {/* Material Cost Section */}
              <div>
                <h4 className="font-medium border-b border-blue-500/30 pb-1 mb-2">Material Cost</h4>
                <div className="space-y-1">
                  {materials.map((material, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {material.name} ({material.quantity} × ₹{formatIndianCurrency(material.unitCost)})
                      </span>
                      <span>₹{formatIndianCurrency(material.totalCost)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-medium pt-1">
                    <span>Total Material Cost:</span>
                    <span>₹{formatIndianCurrency(materialCost)}</span>
                  </div>
                </div>
              </div>

              {/* Labor Cost Section */}
              <div>
                <h4 className="font-medium border-b border-blue-500/30 pb-1 mb-2">Labor Cost</h4>
                <div className="space-y-1">
                  {labor.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.type} ({item.workers} workers × ₹{item.hourlyWage}/hr × {item.hoursWorked}hrs)
                      </span>
                      <span>₹{formatIndianCurrency(item.totalCost)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-medium pt-1">
                    <span>Total Labor Cost:</span>
                    <span>₹{formatIndianCurrency(laborCost)}</span>
                  </div>
                </div>
              </div>

              {/* Equipment Cost Section */}
              <div>
                <h4 className="font-medium border-b border-blue-500/30 pb-1 mb-2">Equipment Cost</h4>
                <div className="space-y-1">
                  {equipment.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.name} (₹{formatIndianCurrency(item.rentalCostPerHour)}/hr × {item.hoursUsed}hrs)
                      </span>
                      <span>₹{formatIndianCurrency(item.totalCost)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-medium pt-1">
                    <span>Total Equipment Cost:</span>
                    <span>₹{formatIndianCurrency(equipmentCost)}</span>
                  </div>
                </div>
              </div>

              {/* Overhead Costs Section */}
              <div>
                <h4 className="font-medium border-b border-blue-500/30 pb-1 mb-2">Overhead Costs</h4>
                <div className="space-y-1">
                  {overhead.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span>₹{formatIndianCurrency(item.cost)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-medium pt-1">
                    <span>Total Overhead Cost:</span>
                    <span>₹{formatIndianCurrency(overheadCost)}</span>
                  </div>
                </div>
              </div>

              {/* Final Total */}
              <div className="flex justify-between font-bold pt-2 border-t border-blue-600/30 text-lg">
                <span>Final Total Cost:</span>
                <span>₹{formatIndianCurrency(totalCost)}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.print()}>
              Generate Cost Report
            </Button>
            <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/20">
              Save Estimate
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
