"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  CloudRain,
  Construction,
  DollarSign,
  Home,
  Loader2,
  LogOut,
  Menu,
  Package,
  School,
  ShoppingBag,
  User,
  Users,
  Warehouse,
  MapPin,
  Clock,
  Briefcase,
  Award,
  Truck,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useState, useCallback, useRef } from "react"
import { AreaCalculator } from "./area-calculator"
import { CostComparisonChart } from "./cost-comparison-chart"
import { LiveCostTracker } from "./live-cost-tracker"
import { Progress } from "@/components/ui/progress"
import { WeatherSchedulingContent } from "@/components/weather-scheduling-content"
import { Badge } from "@/components/ui/badge"

// Function to format numbers in Indian currency format
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

// Dummy data for project estimation
const projectEstimations = {
  house: {
    "1BHK": {
      materials: [
        { name: "Cement", quantity: "50 bags", cost: 17500 },
        { name: "Steel", quantity: "2 tons", cost: 120000 },
        { name: "Bricks", quantity: "5000 pieces", cost: 50000 },
        { name: "Sand", quantity: "30 cubic meters", cost: 45000 },
      ],
      labor: [
        { type: "Mason", count: 4, cost: 80000 },
        { type: "Helper", count: 8, cost: 96000 },
        { type: "Carpenter", count: 2, cost: 48000 },
        { type: "Electrician", count: 1, cost: 30000 },
      ],
      equipment: [
        { name: "Concrete Mixer", hours: 48, cost: 24000 },
        { name: "Scaffolding", days: 30, cost: 15000 },
        { name: "Power Tools", days: 30, cost: 9000 },
      ],
      overhead: [
        { name: "Permits & Licensing", cost: 25000 },
        { name: "Site Management", cost: 35000 },
        { name: "Utilities", cost: 15000 },
      ],
      totalCost: 609500,
      duration: "3 months",
    },
    "2BHK": {
      materials: [
        { name: "Cement", quantity: "80 bags", cost: 28000 },
        { name: "Steel", quantity: "3.5 tons", cost: 210000 },
        { name: "Bricks", quantity: "8000 pieces", cost: 80000 },
        { name: "Sand", quantity: "45 cubic meters", cost: 67500 },
      ],
      labor: [
        { type: "Mason", count: 6, cost: 120000 },
        { type: "Helper", count: 12, cost: 144000 },
        { type: "Carpenter", count: 3, cost: 72000 },
        { type: "Electrician", count: 2, cost: 60000 },
      ],
      equipment: [
        { name: "Concrete Mixer", hours: 72, cost: 36000 },
        { name: "Scaffolding", days: 45, cost: 22500 },
        { name: "Power Tools", days: 45, cost: 13500 },
      ],
      overhead: [
        { name: "Permits & Licensing", cost: 35000 },
        { name: "Site Management", cost: 50000 },
        { name: "Utilities", cost: 25000 },
      ],
      totalCost: 963500,
      duration: "5 months",
    },
    "3BHK": {
      materials: [
        { name: "Cement", quantity: "120 bags", cost: 42000 },
        { name: "Steel", quantity: "5 tons", cost: 300000 },
        { name: "Bricks", quantity: "12000 pieces", cost: 120000 },
        { name: "Sand", quantity: "60 cubic meters", cost: 90000 },
      ],
      labor: [
        { type: "Mason", count: 8, cost: 160000 },
        { type: "Helper", count: 16, cost: 192000 },
        { type: "Carpenter", count: 4, cost: 96000 },
        { type: "Electrician", count: 2, cost: 60000 },
      ],
      equipment: [
        { name: "Concrete Mixer", hours: 96, cost: 48000 },
        { name: "Scaffolding", days: 60, cost: 30000 },
        { name: "Power Tools", days: 60, cost: 18000 },
      ],
      overhead: [
        { name: "Permits & Licensing", cost: 50000 },
        { name: "Site Management", cost: 75000 },
        { name: "Utilities", cost: 35000 },
      ],
      totalCost: 1316000,
      duration: "7 months",
    },
  },
  building: {
    "4-Story": {
      materials: [
        { name: "Cement", quantity: "500 bags", cost: 175000 },
        { name: "Steel", quantity: "25 tons", cost: 1500000 },
        { name: "Bricks", quantity: "50000 pieces", cost: 500000 },
        { name: "Sand", quantity: "200 cubic meters", cost: 300000 },
      ],
      labor: [
        { type: "Mason", count: 20, cost: 400000 },
        { type: "Helper", count: 40, cost: 480000 },
        { type: "Carpenter", count: 10, cost: 240000 },
        { type: "Electrician", count: 5, cost: 150000 },
      ],
      equipment: [
        { name: "Crane", days: 30, cost: 300000 },
        { name: "Concrete Mixer", hours: 240, cost: 120000 },
        { name: "Scaffolding", days: 120, cost: 60000 },
      ],
      overhead: [
        { name: "Permits & Licensing", cost: 200000 },
        { name: "Site Management", cost: 300000 },
        { name: "Utilities", cost: 150000 },
      ],
      totalCost: 4875000,
      duration: "12 months",
    },
    "8-Story": {
      materials: [
        { name: "Cement", quantity: "1000 bags", cost: 350000 },
        { name: "Steel", quantity: "50 tons", cost: 3000000 },
        { name: "Bricks", quantity: "100000 pieces", cost: 1000000 },
        { name: "Sand", quantity: "400 cubic meters", cost: 600000 },
      ],
      labor: [
        { type: "Mason", count: 30, cost: 600000 },
        { type: "Helper", count: 60, cost: 720000 },
        { type: "Carpenter", count: 15, cost: 360000 },
        { type: "Electrician", count: 8, cost: 240000 },
      ],
      equipment: [
        { name: "Crane", days: 60, cost: 600000 },
        { name: "Concrete Mixer", hours: 480, cost: 240000 },
        { name: "Scaffolding", days: 240, cost: 120000 },
      ],
      overhead: [
        { name: "Permits & Licensing", cost: 400000 },
        { name: "Site Management", cost: 600000 },
        { name: "Utilities", cost: 300000 },
      ],
      totalCost: 9130000,
      duration: "24 months",
    },
  },
}

// Sample projects data for My Projects tab
const myProjects = [
  {
    id: 1,
    name: "Dream Home Construction",
    type: "3BHK",
    location: "Mumbai",
    progress: 35,
    startDate: "2023-05-15",
    endDate: "2023-12-20",
    budget: 1500000,
    spent: 525000,
  },
  {
    id: 2,
    name: "Vacation Villa",
    type: "Villa",
    location: "Goa",
    progress: 10,
    startDate: "2023-08-10",
    endDate: "2024-06-30",
    budget: 3500000,
    spent: 350000,
  },
]

// Sample materials data for Materials tab
const materialsList = [
  { id: 1, name: "Cement", quantity: "120 bags", unitPrice: 350, totalPrice: 42000, status: "Delivered" },
  { id: 2, name: "Steel", quantity: "5 tons", unitPrice: 60000, totalPrice: 300000, status: "Partially Delivered" },
  { id: 3, name: "Bricks", quantity: "12000 pieces", unitPrice: 10, totalPrice: 120000, status: "Ordered" },
  { id: 4, name: "Sand", quantity: "60 cubic meters", unitPrice: 1500, totalPrice: 90000, status: "Delivered" },
  { id: 5, name: "Tiles", quantity: "1500 sq ft", unitPrice: 80, totalPrice: 120000, status: "Not Ordered" },
]

// Sample expenses data for Expenses tab
const expensesList = [
  { id: 1, date: "2023-05-20", category: "Materials", description: "Initial cement purchase", amount: 42000 },
  { id: 2, date: "2023-06-05", category: "Labor", description: "Foundation work", amount: 85000 },
  { id: 3, date: "2023-06-15", category: "Equipment", description: "Concrete mixer rental", amount: 15000 },
  { id: 4, date: "2023-07-01", category: "Materials", description: "Steel purchase", amount: 150000 },
  { id: 5, date: "2023-07-10", category: "Overhead", description: "Permits and licenses", amount: 25000 },
]

// Sample profile data for Profile tab
const profileData = {
  name: "Rahul Sharma",
  email: "rahul.sharma@example.com",
  phone: "+91 98765 43210",
  address: "456 Park Avenue, Mumbai, Maharashtra",
  projects: 2,
  joinDate: "January 15, 2023",
}

// Add this mock data for labor teams after the other sample data (after profileData)
// Sample labor teams data
const laborTeamsData = [
  {
    id: 1,
    name: "Premier Construction Crew",
    type: "General Construction",
    members: 12,
    rating: 4.8,
    distance: 3.2,
    availability: "Immediate",
    skills: ["Masonry", "Carpentry", "Plumbing", "Electrical"],
    completedProjects: 87,
    hourlyRate: 450,
    contactPerson: "Rajesh Kumar",
    phone: "+91 98765 43210",
    location: "Andheri East, Mumbai",
  },
  {
    id: 2,
    name: "Elite Finishing Team",
    type: "Interior Finishing",
    members: 8,
    rating: 4.9,
    distance: 5.7,
    availability: "In 3 days",
    skills: ["Painting", "Tiling", "Woodwork", "False Ceiling"],
    completedProjects: 64,
    hourlyRate: 520,
    contactPerson: "Sunil Sharma",
    phone: "+91 87654 32109",
    location: "Bandra West, Mumbai",
  },
  {
    id: 3,
    name: "Foundation Specialists",
    type: "Foundation & Structural",
    members: 15,
    rating: 4.7,
    distance: 7.1,
    availability: "In 1 week",
    skills: ["Excavation", "Concrete Work", "Steel Fixing", "Waterproofing"],
    completedProjects: 42,
    hourlyRate: 580,
    contactPerson: "Amit Patel",
    phone: "+91 76543 21098",
    location: "Worli, Mumbai",
  },
  {
    id: 4,
    name: "Electrical Experts",
    type: "Electrical",
    members: 6,
    rating: 4.9,
    distance: 4.3,
    availability: "In 2 days",
    skills: ["Wiring", "Panel Installation", "Lighting", "Troubleshooting"],
    completedProjects: 93,
    hourlyRate: 490,
    contactPerson: "Vikram Singh",
    phone: "+91 65432 10987",
    location: "Powai, Mumbai",
  },
  {
    id: 5,
    name: "Plumbing Solutions",
    type: "Plumbing",
    members: 7,
    rating: 4.6,
    distance: 6.8,
    availability: "Immediate",
    skills: ["Pipe Fitting", "Drainage", "Fixture Installation", "Water Heaters"],
    completedProjects: 78,
    hourlyRate: 460,
    contactPerson: "Deepak Verma",
    phone: "+91 54321 09876",
    location: "Chembur, Mumbai",
  },
  {
    id: 6,
    name: "Roofing Masters",
    type: "Roofing",
    members: 9,
    rating: 4.7,
    distance: 8.5,
    availability: "In 5 days",
    skills: ["Shingle Roofing", "Metal Roofing", "Waterproofing", "Repairs"],
    completedProjects: 56,
    hourlyRate: 510,
    contactPerson: "Prakash Joshi",
    phone: "+91 43210 98765",
    location: "Thane, Mumbai",
  },
  {
    id: 7,
    name: "Concrete Specialists",
    type: "Concrete Work",
    members: 11,
    rating: 4.8,
    distance: 5.2,
    availability: "In 2 days",
    skills: ["Concrete Pouring", "Stamping", "Polishing", "Repairs"],
    completedProjects: 68,
    hourlyRate: 530,
    contactPerson: "Manoj Tiwari",
    phone: "+91 32109 87654",
    location: "Malad, Mumbai",
  },
  {
    id: 8,
    name: "Painting Professionals",
    type: "Painting",
    members: 8,
    rating: 4.9,
    distance: 4.8,
    availability: "Immediate",
    skills: ["Interior Painting", "Exterior Painting", "Texturing", "Wallpaper"],
    completedProjects: 112,
    hourlyRate: 420,
    contactPerson: "Sanjay Gupta",
    phone: "+91 21098 76543",
    location: "Juhu, Mumbai",
  },
]

// Define location factors
const LOCATION_FACTORS = {
  Mumbai: 1.2,
  Delhi: 1.1,
  Bangalore: 1.3,
  Chennai: 1.0,
  Kolkata: 0.9,
  Hyderabad: 1.15,
  Pune: 1.25,
  Ahmedabad: 0.95,
  Jaipur: 0.85,
  Lucknow: 0.8,
  Mangalore: 1.05,
}

export default function HomeownerDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [siteDimensions, setSiteDimensions] = useState({ length: "", width: "" })
  const [constructionType, setConstructionType] = useState("")
  const [subType, setSubType] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [estimationResult, setEstimationResult] = useState(null)
  const [area, setArea] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [materialCost, setMaterialCost] = useState(0)
  const [laborCost, setLaborCost] = useState(0)
  const [equipmentCost, setEquipmentCost] = useState(0)
  const [overheadCost, setOverheadCost] = useState(0)
  const [budgetLimit, setBudgetLimit] = useState(1000000) // 10 lakhs default
  const [activeTab, setActiveTab] = useState("dashboard")
  const [selectedLocation, setSelectedLocation] = useState("Mumbai")
  const [navigationHistory, setNavigationHistory] = useState(["dashboard"])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("All")
  const [sortBy, setSortBy] = useState("distance")
  const [teamHiredStates, setTeamHiredStates] = useState({})

  // Use refs to track previous values and prevent unnecessary updates
  const prevAreaRef = useRef(area)
  const prevTotalCostRef = useRef(totalCost)

  // Memoize the handleAreaCalculation function to prevent it from changing on every render
  const handleAreaCalculation = useCallback((calculatedArea, calculatedCost) => {
    // Only update if values have actually changed
    if (calculatedArea !== prevAreaRef.current || calculatedCost !== prevTotalCostRef.current) {
      setArea(calculatedArea)
      setTotalCost(calculatedCost)
      prevAreaRef.current = calculatedArea
      prevTotalCostRef.current = calculatedCost
    }
  }, [])

  const handleEstimation = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      let result
      if (constructionType === "house" && subType) {
        result = JSON.parse(JSON.stringify(projectEstimations.house[subType]))

        // Scale costs based on actual area vs reference area
        const referenceArea = subType === "1BHK" ? 600 : subType === "2BHK" ? 900 : 1200
        const scaleFactor = area / referenceArea

        // Apply location factor
        const locationFactor = LOCATION_FACTORS[selectedLocation] || 1.0

        // Adjust material quantities and costs
        result.materials = result.materials.map((material) => {
          const originalQuantity = material.quantity.split(" ")
          const newQuantity = Math.round(Number.parseFloat(originalQuantity[0]) * scaleFactor)
          return {
            ...material,
            quantity: `${newQuantity} ${originalQuantity.slice(1).join(" ")}`,
            cost: Math.round(material.cost * scaleFactor * locationFactor),
          }
        })

        // Adjust labor costs
        result.labor = result.labor.map((labor) => {
          return {
            ...labor,
            count: Math.max(1, Math.round(labor.count * scaleFactor)),
            cost: Math.round(labor.cost * scaleFactor * locationFactor),
          }
        })

        // Adjust equipment costs
        result.equipment = result.equipment.map((equipment) => {
          return {
            ...equipment,
            hours: equipment.hours ? Math.round(equipment.hours * scaleFactor) : undefined,
            days: equipment.days ? Math.round(equipment.days * scaleFactor) : undefined,
            cost: Math.round(equipment.cost * scaleFactor * locationFactor),
          }
        })

        // Adjust overhead costs
        result.overhead = result.overhead.map((overhead) => {
          return {
            ...overhead,
            cost: Math.round(overhead.cost * scaleFactor * locationFactor),
          }
        })

        // Calculate new total cost
        const calculatedMaterialCost = result.materials.reduce((sum, item) => sum + item.cost, 0)
        const calculatedLaborCost = result.labor.reduce((sum, item) => sum + item.cost, 0)
        const calculatedEquipmentCost = result.equipment.reduce((sum, item) => sum + item.cost, 0)
        const calculatedOverheadCost = result.overhead.reduce((sum, item) => sum + item.cost, 0)

        result.totalCost =
          calculatedMaterialCost + calculatedLaborCost + calculatedEquipmentCost + calculatedOverheadCost

        // Update state with calculated costs
        setMaterialCost(calculatedMaterialCost)
        setLaborCost(calculatedLaborCost)
        setEquipmentCost(calculatedEquipmentCost)
        setOverheadCost(calculatedOverheadCost)
        setTotalCost(result.totalCost)

        // No need to update selectedLocation here as it's already a state variable set by the user
      } else if (constructionType === "building" && subType) {
        result = JSON.parse(JSON.stringify(projectEstimations.building[subType]))

        // Apply similar scaling logic as for houses
        const referenceArea = subType === "4-Story" ? 5000 : 10000
        const scaleFactor = area / referenceArea

        // Apply location factor
        const locationFactor = LOCATION_FACTORS[selectedLocation] || 1.0

        // Scale all costs
        result.materials = result.materials.map((material) => {
          const originalQuantity = material.quantity.split(" ")
          const newQuantity = Math.round(Number.parseFloat(originalQuantity[0]) * scaleFactor)
          return {
            ...material,
            quantity: `${newQuantity} ${originalQuantity.slice(1).join(" ")}`,
            cost: Math.round(material.cost * scaleFactor * locationFactor),
          }
        })

        result.labor = result.labor.map((labor) => {
          return {
            ...labor,
            count: Math.max(1, Math.round(labor.count * scaleFactor)),
            cost: Math.round(labor.cost * scaleFactor * locationFactor),
          }
        })

        result.equipment = result.equipment.map((equipment) => {
          return {
            ...equipment,
            hours: equipment.hours ? Math.round(equipment.hours * scaleFactor) : undefined,
            days: equipment.days ? Math.round(equipment.days * scaleFactor) : undefined,
            cost: Math.round(equipment.cost * scaleFactor * locationFactor),
          }
        })

        result.overhead = result.overhead.map((overhead) => {
          return {
            ...overhead,
            cost: Math.round(overhead.cost * scaleFactor * locationFactor),
          }
        })

        // Calculate new total cost
        const calculatedMaterialCost = result.materials.reduce((sum, item) => sum + item.cost, 0)
        const calculatedLaborCost = result.labor.reduce((sum, item) => sum + item.cost, 0)
        const calculatedEquipmentCost = result.equipment.reduce((sum, item) => sum + item.cost, 0)
        const calculatedOverheadCost = result.overhead.reduce((sum, item) => sum + item.cost, 0)

        result.totalCost =
          calculatedMaterialCost + calculatedLaborCost + calculatedEquipmentCost + calculatedOverheadCost

        // Update state with calculated costs
        setMaterialCost(calculatedMaterialCost)
        setLaborCost(calculatedLaborCost)
        setEquipmentCost(calculatedEquipmentCost)
        setOverheadCost(calculatedOverheadCost)
        setTotalCost(result.totalCost)

        // No need to update selectedLocation here as it's already a state variable set by the user
      } else {
        // Default to 3BHK if no valid selection
        result = JSON.parse(JSON.stringify(projectEstimations.house["3BHK"]))
        // Apply scaling as above
      }

      setEstimationResult(result)
      setIsLoading(false)
    }, 2000)
  }

  const navigateTo = (tab) => {
    // Don't add duplicate consecutive entries
    if (tab !== activeTab) {
      setNavigationHistory((prev) => [...prev, tab])
      setActiveTab(tab)
    }
  }

  const goBack = () => {
    if (navigationHistory.length > 1) {
      // Create a copy of the history
      const newHistory = [...navigationHistory]
      // Remove the current page from history
      newHistory.pop()
      // Get the previous page
      const previousTab = newHistory[newHistory.length - 1]
      // Update state
      setNavigationHistory(newHistory)
      setActiveTab(previousTab)
    }
  }

  // Risk Alerts tab content
  const renderRiskAlertsContent = () => {
    return (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-white">Project Risk Alerts</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-gray-600 hover:bg-gray-700"
                onClick={goBack}
              >
                Back to Dashboard
              </Button>
            </div>
            <CardDescription className="text-white">
              AI-powered risk detection and mitigation recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* High Priority Risks */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">High Priority Risks</h3>
              <div className="space-y-3">
                <div className="p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-600/30 p-2 rounded-full">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Budget Overrun Risk</h4>
                      <p className="text-white/80 mt-1">
                        Current spending trajectory indicates a potential 15% budget overrun by project completion.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/20">
                          Mitigation Plan
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-600/30 p-2 rounded-full">
                      <CloudRain className="h-5 w-5 text-red-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Severe Weather Alert</h4>
                      <p className="text-white/80 mt-1">
                        Heavy rainfall predicted for the next 7 days may cause significant delays to foundation work.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          View Forecast
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/20">
                          Adjust Schedule
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Medium Priority Risks */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Medium Priority Risks</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-amber-600/20 border border-amber-600/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-600/30 p-2 rounded-full">
                        <Package className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Material Shortage</h4>
                        <p className="text-white/80 mt-1">
                          Steel delivery may be delayed by 2 weeks due to supply chain disruptions.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                            Alternative Suppliers
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-amber-600/20 border border-amber-600/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-amber-600/30 p-2 rounded-full">
                        <Users className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Labor Availability</h4>
                        <p className="text-white/80 mt-1">
                          Skilled electrician shortage predicted during weeks 8-10 of the project.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                            Workforce Planning
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Low Priority Risks */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Low Priority Risks</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="bg-blue-600/30 p-2 rounded-full">
                        <DollarSign className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-white">Price Fluctuation</h4>
                        <p className="text-white/80 mt-1">
                          Cement prices expected to increase by 3-5% in the next month.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Procurement Strategy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Risk Mitigation Recommendations</CardTitle>
              <CardDescription className="text-white">
                AI-generated strategies to address identified project risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Budget Management Plan</h4>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span>
                        Review material specifications to identify cost-saving alternatives without compromising quality
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Implement weekly budget tracking meetings to identify and address overruns early</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Consider phasing non-critical work to distribute costs over a longer period</span>
                    </li>
                  </ul>
                  <Button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white">Generate Detailed Plan</Button>
                </div>

                <div className="p-4 bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-white mb-2">Weather Contingency Strategy</h4>
                  <ul className="space-y-2 text-white/80">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Rent temporary weather protection structures for critical foundation work</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Reschedule exterior work to later phases when weather conditions improve</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span>Accelerate interior work during rainy periods to maintain overall progress</span>
                    </li>
                  </ul>
                  <Button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                    View Weather-Optimized Schedule
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Risk Monitoring Dashboard</CardTitle>
              <CardDescription className="text-white">Real-time tracking of project risk indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-white">Budget Risk</h4>
                    <span className="px-2 py-1 bg-red-600/30 text-red-400 rounded-full text-xs font-medium">High</span>
                  </div>
                  <Progress value={75} className="h-2 mb-2" />
                  <p className="text-xs text-white/70">15% over budget projection</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-white">Schedule Risk</h4>
                    <span className="px-2 py-1 bg-amber-600/30 text-amber-400 rounded-full text-xs font-medium">
                      Medium
                    </span>
                  </div>
                  <Progress value={45} className="h-2 mb-2" />
                  <p className="text-xs text-white/70">7 days behind schedule</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-white">Quality Risk</h4>
                    <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded-full text-xs font-medium">Low</span>
                  </div>
                  <Progress value={15} className="h-2 mb-2" />
                  <p className="text-xs text-white/70">All inspections passed</p>
                </div>
              </div>

              <div className="bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-3">Risk Trend Analysis</h4>
                <div className="h-48 relative">
                  {/* Simple line chart visualization */}
                  <div className="absolute inset-0 flex items-end">
                    <div className="h-[15%] w-[8.33%] bg-blue-500 opacity-70"></div>
                    <div className="h-[25%] w-[8.33%] bg-blue-500 opacity-70"></div>
                    <div className="h-[40%] w-[8.33%] bg-blue-500 opacity-70"></div>
                    <div className="h-[35%] w-[8.33%] bg-blue-500 opacity-70"></div>
                    <div className="h-[45%] w-[8.33%] bg-blue-500 opacity-70"></div>
                    <div className="h-[60%] w-[8.33%] bg-blue-500 opacity-70"></div>
                    <div className="h-[75%] w-[8.33%] bg-blue-500 opacity-70"></div>
                    <div className="h-[65%] w-[8.33%] bg-blue-500 opacity-70"></div>
                    <div className="h-[70%] w-[8.33%] bg-blue-500 opacity-70"></div>
                    <div className="h-[60%] w-[8.33%] bg-blue-500 opacity-70"></div>
                    <div className="h-[50%] w-[8.33%] bg-blue-500 opacity-70"></div>
                    <div className="h-[40%] w-[8.33%] bg-blue-500 opacity-70"></div>
                  </div>

                  {/* Overlay grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                    <div className="border-b border-gray-600 h-1/4"></div>
                    <div className="border-b border-gray-600 h-1/4"></div>
                    <div className="border-b border-gray-600 h-1/4"></div>
                    <div className="border-b border-gray-600 h-1/4"></div>
                  </div>

                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-white/70 pointer-events-none">
                    <div>High</div>
                    <div>Medium</div>
                    <div>Low</div>
                    <div>None</div>
                  </div>

                  {/* X-axis labels */}
                  <div className="absolute left-12 right-0 bottom-0 translate-y-6 flex justify-between text-xs text-white/70 pointer-events-none">
                    <div>Jan</div>
                    <div>Feb</div>
                    <div>Mar</div>
                    <div>Apr</div>
                    <div>May</div>
                    <div>Jun</div>
                    <div>Jul</div>
                    <div>Aug</div>
                    <div>Sep</div>
                    <div>Oct</div>
                    <div>Nov</div>
                    <div>Dec</div>
                  </div>
                </div>
                <p className="text-sm text-white/70 mt-8">
                  Risk levels have been increasing since May, primarily due to weather and supply chain factors.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

  // Render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardContent()
      case "projects":
        return renderProjectsContent()
      case "materials":
        return renderMaterialsContent()
      case "expenses":
        return renderExpensesContent()
      case "weather-scheduling":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Weather Scheduling</h2>
              <div className="w-64">
                <Label htmlFor="weather-location" className="text-white mb-2 block">
                  Location
                </Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger id="weather-location" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Kolkata">Kolkata</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Mangalore">Mangalore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <WeatherSchedulingContent location={selectedLocation} />
          </div>
        )
      case "carbon-footprint":
        return renderCarbonFootprintContent()
      case "risk-alerts":
        return renderRiskAlertsContent()
      case "profile":
        return renderProfileContent()
      default:
        return renderDashboardContent()
    }
  }

  // Carbon Footprint tab content
  const renderCarbonFootprintContent = () => {
    return (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-white">Carbon Footprint Analysis</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-gray-600 hover:bg-gray-700"
                onClick={goBack}
              >
                Back to Dashboard
              </Button>
            </div>
            <CardDescription className="text-white">
              Track and optimize the environmental impact of your construction project
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project Carbon Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Total Carbon Footprint</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-white">24.8</p>
                    <p className="text-lg text-white">tonnes CO₂e</p>
                  </div>
                  <p className="text-sm text-white/70 mt-1">Based on current materials and methods</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Sustainability Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold text-white">7.2</p>
                    <p className="text-lg text-white">/10</p>
                  </div>
                  <p className="text-sm text-white/70 mt-1">15% better than industry average</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-white">Potential Reduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold text-green-400">-18%</p>
                  </div>
                  <p className="text-sm text-white/70 mt-1">With recommended optimizations</p>
                </CardContent>
              </Card>
            </div>

            {/* Materials Carbon Breakdown */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Materials Carbon Breakdown</h3>
              <div className="space-y-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <h4 className="font-medium text-white">Concrete</h4>
                    </div>
                    <span className="text-white">12.4 tonnes CO₂e</span>
                  </div>
                  <Progress value={50} className="h-2 mb-1" />
                  <p className="text-xs text-white/70">50% of total emissions</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <h4 className="font-medium text-white">Steel</h4>
                    </div>
                    <span className="text-white">7.4 tonnes CO₂e</span>
                  </div>
                  <Progress value={30} className="h-2 mb-1" />
                  <p className="text-xs text-white/70">30% of total emissions</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <h4 className="font-medium text-white">Wood</h4>
                    </div>
                    <span className="text-white">2.5 tonnes CO₂e</span>
                  </div>
                  <Progress value={10} className="h-2 mb-1" />
                  <p className="text-xs text-white/70">10% of total emissions</p>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <h4 className="font-medium text-white">Other Materials</h4>
                    </div>
                    <span className="text-white">2.5 tonnes CO₂e</span>
                  </div>
                  <Progress value={10} className="h-2 mb-1" />
                  <p className="text-xs text-white/70">10% of total emissions</p>
                </div>
              </div>
            </div>

            {/* Sustainability Recommendations */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Sustainability Recommendations</h3>
              <div className="space-y-3">
                <div className="p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-600/30 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-400"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Use Low-Carbon Concrete</h4>
                      <p className="text-white/80 mt-1">
                        Switching to low-carbon concrete can reduce your concrete emissions by up to 30%.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          View Suppliers
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-600 text-green-400 hover:bg-green-600/20"
                        >
                          Calculate Savings
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-600/30 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-400"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Optimize Steel Usage</h4>
                      <p className="text-white/80 mt-1">
                        Advanced structural analysis shows you can reduce steel by 15% without compromising integrity.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          View Analysis
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-600/30 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-green-400"
                      >
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Increase Recycled Content</h4>
                      <p className="text-white/80 mt-1">
                        Using materials with higher recycled content can reduce your overall carbon footprint.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                          Find Materials
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Carbon Offset Options */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Carbon Offset Options</h3>
              <Card className="bg-gray-700 border-gray-600">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-blue-400"
                        >
                          <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"></path>
                        </svg>
                        <div>
                          <h4 className="font-medium text-white">Renewable Energy Projects</h4>
                          <p className="text-sm text-white/70">Support wind and solar energy development</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
                      >
                        Select
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-green-400"
                        >
                          <path d="M17 14V2"></path>
                          <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"></path>
                        </svg>
                        <div>
                          <h4 className="font-medium text-white">Reforestation Programs</h4>
                          <p className="text-sm text-white/70">Plant trees to absorb carbon dioxide</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
                      >
                        Select
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-amber-400"
                        >
                          <rect width="20" height="14" x="2" y="3" rx="2"></rect>
                          <line x1="8" x2="16" y1="21" y2="21"></line>
                          <line x1="12" x2="12" y1="17" y2="21"></line>
                        </svg>
                        <div>
                          <h4 className="font-medium text-white">Community Projects</h4>
                          <p className="text-sm text-white/70">Support sustainable development in communities</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
                      >
                        Select
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-600/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-white">Total Offset Cost</h4>
                      <span className="text-white font-bold">₹124,000</span>
                    </div>
                    <p className="text-sm text-white/70 mb-4">For 24.8 tonnes CO₂e at ₹5,000 per tonne</p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Purchase Carbon Offsets</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Carbon Footprint Certification */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Carbon Footprint Certification</CardTitle>
            <CardDescription className="text-white">
              Get your project certified for its environmental performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-400"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                  <h4 className="font-medium text-white">IGBC Green Homes Certification</h4>
                </div>
                <p className="text-white/80 mb-3">
                  The Indian Green Building Council certification recognizes environmentally responsible buildings.
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Apply for Certification</Button>
              </div>

              <div className="p-4 bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-400"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                  <h4 className="font-medium text-white">GRIHA Rating</h4>
                </div>
                <p className="text-white/80 mb-3">
                  Green Rating for Integrated Habitat Assessment is India's national rating system for green buildings.
                </p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Check Eligibility</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Dashboard tab content
  const renderDashboardContent = () => {
    return (
      <>
        {/* Site Dimensions Input */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Enter Site Dimensions</CardTitle>
            <CardDescription className="text-white">Provide the dimensions of your construction site</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="length" className="text-white">
                  Length (in feet)
                </Label>
                <Input
                  id="length"
                  placeholder="e.g., 100"
                  value={siteDimensions.length}
                  onChange={(e) => setSiteDimensions({ ...siteDimensions, length: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="width" className="text-white">
                  Width (in feet)
                </Label>
                <Input
                  id="width"
                  placeholder="e.g., 50"
                  value={siteDimensions.width}
                  onChange={(e) => setSiteDimensions({ ...siteDimensions, width: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Area Calculator */}
        {siteDimensions.length && siteDimensions.width && (
          <AreaCalculator
            onCalculate={handleAreaCalculation}
            length={siteDimensions.length}
            width={siteDimensions.width}
          />
        )}

        {siteDimensions.length && siteDimensions.width && (
          <div className="mt-4 p-4 bg-blue-600/20 rounded-lg">
            <h3 className="text-lg font-semibold mb-2 text-white">Area Calculation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-white">
                  Site Dimensions: {siteDimensions.length} ft × {siteDimensions.width} ft
                </p>
                <p className="text-white">
                  Total Area: {Number.parseFloat(siteDimensions.length) * Number.parseFloat(siteDimensions.width)} sq ft
                </p>
              </div>
              <div>
                <p className="text-white">Base Construction Rate: ₹2,000 per sq ft</p>
                <p className="text-white font-bold">
                  Estimated Base Cost: ₹
                  {formatIndianCurrency(
                    Number.parseFloat(siteDimensions.length) * Number.parseFloat(siteDimensions.width) * 2000,
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Construction Type Selection */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Select Construction Type</CardTitle>
            <CardDescription className="text-white">Choose the type of construction project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Construction Type Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div
                  className={`bg-gray-700 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${constructionType === "house" ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setConstructionType("house")}
                >
                  <div className="h-36 bg-gray-600 relative">
                    <img
                      src="/placeholder.svg?height=144&width=250"
                      alt="House"
                      className="w-full h-full object-cover"
                      style={{
                        backgroundImage:
                          "url(https://images.unsplash.com/photo-1576941089067-2de3c901e126?q=80&w=2940&auto=format&fit=crop)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <Home className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-lg font-medium text-white">House</h3>
                    <p className="text-sm text-white/70">Residential projects</p>
                  </div>
                </div>

                <div
                  className={`bg-gray-700 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${constructionType === "building" ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setConstructionType("building")}
                >
                  <div className="h-36 bg-gray-600 relative">
                    <img
                      src="/placeholder.svg?height=144&width=250"
                      alt="Building"
                      className="w-full h-full object-cover"
                      style={{
                        backgroundImage:
                          "url(https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2940&auto=format&fit=crop)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <Building2 className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-lg font-medium text-white">Building</h3>
                    <p className="text-sm text-white/70">Multi-story structures</p>
                  </div>
                </div>

                <div
                  className={`bg-gray-700 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${constructionType === "school" ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setConstructionType("school")}
                >
                  <div className="h-36 bg-gray-600 relative">
                    <img
                      src="/placeholder.svg?height=144&width=250"
                      alt="School"
                      className="w-full h-full object-cover"
                      style={{
                        backgroundImage:
                          "url(https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?q=80&w=2960&auto=format&fit=crop)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <School className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-lg font-medium text-white">School</h3>
                    <p className="text-sm text-white/70">Educational facilities</p>
                  </div>
                </div>

                <div
                  className={`bg-gray-700 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${constructionType === "commercial" ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setConstructionType("commercial")}
                >
                  <div className="h-36 bg-gray-600 relative">
                    <img
                      src="/placeholder.svg?height=144&width=250"
                      alt="Commercial"
                      className="w-full h-full object-cover"
                      style={{
                        backgroundImage:
                          "url(https://images.unsplash.com/photo-1555952517-2e8e729e0b44?q=80&w=2064&auto=format&fit=crop)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-lg font-medium text-white">Commercial</h3>
                    <p className="text-sm text-white/70">Retail & office spaces</p>
                  </div>
                </div>

                <div
                  className={`bg-gray-700 rounded-lg overflow-hidden cursor-pointer transition-all hover:scale-105 ${constructionType === "warehouse" ? "ring-2 ring-blue-500" : ""}`}
                  onClick={() => setConstructionType("warehouse")}
                >
                  <div className="h-36 bg-gray-600 relative">
                    <img
                      src="/placeholder.svg?height=144&width=250"
                      alt="Warehouse"
                      className="w-full h-full object-cover"
                      style={{
                        backgroundImage:
                          "url(https://images.unsplash.com/photo-1568992687947-868a62a9f521?q=80&w=2832&auto=format&fit=crop)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <Warehouse className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="text-lg font-medium text-white">Warehouse</h3>
                    <p className="text-sm text-white/70">Industrial storage</p>
                  </div>
                </div>
              </div>

              {/* Conditional subtype selection based on selected construction type */}
              {constructionType && (
                <div className="bg-gray-700 p-4 rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">
                      {constructionType === "house"
                        ? "House Type"
                        : constructionType === "building"
                          ? "Building Type"
                          : constructionType === "school"
                            ? "School Type"
                            : constructionType === "commercial"
                              ? "Commercial Type"
                              : "Warehouse Type"}
                    </h3>
                    {constructionType && subType && <Badge className="bg-blue-600">{subType}</Badge>}
                  </div>

                  <Select onValueChange={setSubType} value={subType}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue placeholder={`Select ${constructionType} type`} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600 text-white">
                      {constructionType === "house" && (
                        <>
                          <SelectItem value="1BHK">1BHK</SelectItem>
                          <SelectItem value="2BHK">2BHK</SelectItem>
                          <SelectItem value="3BHK">3BHK</SelectItem>
                          <SelectItem value="Duplex">Duplex</SelectItem>
                          <SelectItem value="Villa">Villa</SelectItem>
                        </>
                      )}
                      {constructionType === "building" && (
                        <>
                          <SelectItem value="4-Story">4-Story</SelectItem>
                          <SelectItem value="8-Story">8-Story</SelectItem>
                          <SelectItem value="Skyscraper">Skyscraper</SelectItem>
                          <SelectItem value="Commercial Office">Commercial Office</SelectItem>
                        </>
                      )}
                      {constructionType === "school" && (
                        <>
                          <SelectItem value="Primary">Primary</SelectItem>
                          <SelectItem value="High School">High School</SelectItem>
                          <SelectItem value="University">University</SelectItem>
                          <SelectItem value="Auditorium">Auditorium</SelectItem>
                        </>
                      )}
                      {constructionType === "commercial" && (
                        <>
                          <SelectItem value="Retail">Retail</SelectItem>
                          <SelectItem value="Mall">Mall</SelectItem>
                          <SelectItem value="Corporate">Corporate</SelectItem>
                          <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                        </>
                      )}
                      {constructionType === "warehouse" && (
                        <>
                          <SelectItem value="Storage Unit">Storage Unit</SelectItem>
                          <SelectItem value="Distribution Center">Distribution Center</SelectItem>
                          <SelectItem value="Industrial">Industrial</SelectItem>
                          <SelectItem value="Cold Storage">Cold Storage</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-4">
                <Label className="text-white">Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Kolkata">Kolkata</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Ahmedabad">Ahmedabad</SelectItem>
                    <SelectItem value="Jaipur">Jaipur</SelectItem>
                    <SelectItem value="Lucknow">Lucknow</SelectItem>
                    <SelectItem value="Mangalore">Mangalore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleEstimation}
              disabled={isLoading || !constructionType || !subType || !siteDimensions.length || !siteDimensions.width}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Estimation...
                </>
              ) : (
                "Generate AI-Powered Estimation"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Live Cost Tracker */}
        {estimationResult && <LiveCostTracker totalCost={totalCost} budgetLimit={budgetLimit} />}

        {/* Cost Comparison Chart */}
        {estimationResult && (
          <CostComparisonChart
            materialCost={materialCost}
            laborCost={laborCost}
            equipmentCost={equipmentCost}
            overheadCost={overheadCost}
            totalCost={totalCost}
            location={selectedLocation}
          />
        )}

        {/* Estimation Results */}
        {estimationResult && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Project Estimation Results</CardTitle>
              <CardDescription className="text-white">
                AI-generated estimation for your {subType} {constructionType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Material Requirements</h3>
                  <div className="space-y-4">
                    {estimationResult.materials.map((material, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-white">{material.name}</p>
                          <p className="text-sm text-white">{material.quantity}</p>
                        </div>
                        <p className="font-semibold text-white">₹{formatIndianCurrency(material.cost)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Labor Estimation</h3>
                  <div className="space-y-4">
                    {estimationResult.labor.map((labor, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-white">{labor.type}</p>
                          <p className="text-sm text-white">{labor.count} workers</p>
                        </div>
                        <p className="font-semibold text-white">₹{formatIndianCurrency(labor.cost)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-gray-700" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Equipment Costs</h3>
                  <div className="space-y-4">
                    {estimationResult.equipment.map((equipment, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-white">{equipment.name}</p>
                          <p className="text-sm text-white">
                            {equipment.hours
                              ? `${equipment.hours} hours`
                              : equipment.days
                                ? `${equipment.days} days`
                                : ""}
                          </p>
                        </div>
                        <p className="font-semibold text-white">₹{formatIndianCurrency(equipment.cost)}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-white">Overhead Costs</h3>
                  <div className="space-y-4">
                    {estimationResult.overhead.map((overhead, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-white">{overhead.name}</p>
                        </div>
                        <p className="font-semibold text-white">₹{formatIndianCurrency(overhead.cost)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator className="my-6 bg-gray-700" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Total Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-white">₹{formatIndianCurrency(estimationResult.totalCost)}</p>
                    <p className="text-white text-sm">Based on {area.toLocaleString()} sq ft</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Project Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-white">{estimationResult.duration}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-white">Sustainability Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-white">7.5/10</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                <h3 className="text-lg font-semibold mb-2 text-white">AI Resource Optimization Suggestions</h3>
                <ul className="space-y-2 text-white">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Consider using prefabricated components to reduce labor costs by 15%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Opt for fly ash bricks instead of clay bricks for better sustainability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-400"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Schedule concrete pouring during cooler hours to improve quality</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">Save Estimation</Button>
              <Button variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-400 hover:bg-blue-600/20">
                Request Material Quotes
              </Button>
            </CardFooter>
          </Card>
        )}
      </>
    )
  }

  // Projects tab content
  const renderProjectsContent = () => {
    return (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-white">My Projects</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-gray-600 hover:bg-gray-700"
                onClick={goBack}
              >
                Back to Dashboard
              </Button>
            </div>
            <CardDescription className="text-white">Manage your ongoing construction projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myProjects.map((project) => (
                <Card key={project.id} className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-white">{project.name}</CardTitle>
                    <CardDescription className="text-white">
                      {project.type} at {project.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Progress:</span>
                      <span className="text-white">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2 bg-gray-600" />
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Budget:</span>
                      <span className="text-white">₹{formatIndianCurrency(project.budget)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Spent:</span>
                      <span className="text-white">₹{formatIndianCurrency(project.spent)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white">Timeline:</span>
                      <span className="text-white">
                        {project.startDate} to {project.endDate}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Start New Project</CardTitle>
            <CardDescription className="text-white">Begin planning your next construction project</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Create New Project</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Materials tab content
  const renderMaterialsContent = () => {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-white">Materials Management</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-gray-600 hover:bg-gray-700"
              onClick={goBack}
            >
              Back to Dashboard
            </Button>
          </div>
          <CardDescription className="text-white">Track and manage your construction materials</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-white">Material</th>
                  <th className="text-left py-3 px-4 text-white">Quantity</th>
                  <th className="text-left py-3 px-4 text-white">Unit Price</th>
                  <th className="text-left py-3 px-4 text-white">Total Price</th>
                  <th className="text-left py-3 px-4 text-white">Status</th>
                  <th className="text-left py-3 px-4 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {materialsList.map((material) => (
                  <tr key={material.id} className="border-b border-gray-700">
                    <td className="py-3 px-4 text-white">{material.name}</td>
                    <td className="py-3 px-4 text-white">{material.quantity}</td>
                    <td className="py-3 px-4 text-white">₹{formatIndianCurrency(material.unitPrice)}</td>
                    <td className="py-3 px-4 text-white">₹{formatIndianCurrency(material.totalPrice)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          material.status === "Delivered"
                            ? "bg-green-500/20 text-green-400"
                            : material.status === "Partially Delivered"
                              ? "bg-amber-500/20 text-amber-400"
                              : material.status === "Ordered"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {material.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-400">
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Material</Button>
            <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/20">
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Expenses tab content
  const renderExpensesContent = () => {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-white">Expense Tracking</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-gray-600 hover:bg-gray-700"
              onClick={goBack}
            >
              Back to Dashboard
            </Button>
          </div>
          <CardDescription className="text-white">Monitor and manage your construction expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-white">Date</th>
                  <th className="text-left py-3 px-4 text-white">Category</th>
                  <th className="text-left py-3 px-4 text-white">Description</th>
                  <th className="text-left py-3 px-4 text-white">Amount</th>
                  <th className="text-left py-3 px-4 text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expensesList.map((expense) => (
                  <tr key={expense.id} className="border-b border-gray-700">
                    <td className="py-3 px-4 text-white">{expense.date}</td>
                    <td className="py-3 px-4 text-white">{expense.category}</td>
                    <td className="py-3 px-4 text-white">{expense.description}</td>
                    <td className="py-3 px-4 text-white">₹{formatIndianCurrency(expense.amount)}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-400">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Expense</Button>
            <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/20">
              Export Expenses
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Profile tab content
  const renderProfileContent = () => {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <CardTitle className="text-white">User Profile</CardTitle>
            <Button
              variant="outline"
              size="sm"
              className="text-white border-gray-600 hover:bg-gray-700"
              onClick={goBack}
            >
              Back to Dashboard
            </Button>
          </div>
          <CardDescription className="text-white">Manage your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-white">Full Name</Label>
                <div className="text-lg font-medium text-white">{profileData.name}</div>
              </div>
              <div>
                <Label className="text-white">Email Address</Label>
                <div className="text-lg font-medium text-white">{profileData.email}</div>
              </div>
              <div>
                <Label className="text-white">Phone Number</Label>
                <div className="text-lg font-medium text-white">{profileData.phone}</div>
              </div>
              <div>
                <Label className="text-white">Address</Label>
                <div className="text-lg font-medium text-white">{profileData.address}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Active Projects</Label>
                <div className="text-lg font-medium text-white">{profileData.projects}</div>
              </div>
              <div>
                <Label className="text-white">Member Since</Label>
                <div className="text-lg font-medium text-white">{profileData.joinDate}</div>
              </div>
              <div className="pt-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Edit Profile</Button>
              </div>
              <div>
                <Button variant="outline" className="w-full border-blue-600 text-blue-400 hover:bg-blue-600/20">
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Add this function to render the Labor Availability content after the renderCarbonFootprintContent function
  // Labor Availability tab content
  const renderLaborAvailabilityContent = () => {
    // Filter and sort labor teams
    const filteredTeams = laborTeamsData
      .filter((team) => {
        const matchesSearch =
          team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          team.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
          team.type.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = filterType === "All" || team.type === filterType

        return matchesSearch && matchesType
      })
      .sort((a, b) => {
        if (sortBy === "distance") return a.distance - b.distance
        if (sortBy === "rating") return b.rating - a.rating
        if (sortBy === "availability") {
          if (a.availability === "Immediate" && b.availability !== "Immediate") return -1
          if (a.availability !== "Immediate" && b.availability === "Immediate") return 1
          return a.availability.localeCompare(b.availability)
        }
        return 0
      })

    // Get unique labor types for filter
    const laborTypes = ["All", ...new Set(laborTeamsData.map((team) => team.type))]

    const handleHireTeam = (teamId) => {
      // Simulate sending a Twilio message
      console.log(`Sending Twilio message to team ${teamId}...`)
      // In a real application, you would use the Twilio API to send the message
      // For example:
      // twilioClient.messages
      //   .create({
      //     body: 'You have been hired for a project!',
      //     to: '+1234567890', // Replace with the team's phone number
      //     from: '+11234567890', // Replace with your Twilio phone number
      //   })
      //   .then((message) => console.sid));

      // Update the teamHiredStates state
      setTeamHiredStates((prev) => ({ ...prev, [teamId]: true }))
    }

    return (
      <div className="space-y-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-white">Labor Team Availability</CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="text-white border-gray-600 hover:bg-gray-700"
                onClick={goBack}
              >
                Back to Dashboard
              </Button>
            </div>
            <CardDescription className="text-white">
              Find and hire skilled labor teams near your construction site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="search-labor" className="text-white mb-2 block">
                  Search Teams
                </Label>
                <div className="relative">
                  <Input
                    id="search-labor"
                    placeholder="Search by name, skills, or type..."
                    className="bg-gray-700 border-gray-600 text-white pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                </div>
              </div>

              <div>
                <Label htmlFor="filter-type" className="text-white mb-2 block">
                  Filter by Type
                </Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger id="filter-type" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    {laborTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort-by" className="text-white mb-2 block">
                  Sort by
                </Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sort-by" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    <SelectItem value="distance">Nearest First</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="availability">Earliest Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Labor Teams Map Visualization */}
            <div className="bg-gray-700 rounded-lg p-4 h-64 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full relative">
                  {/* Simple map visualization */}
                  <div className="absolute inset-0 bg-gray-800 opacity-50"></div>

                  {/* Center point (homeowner location) */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center">
                      <Home className="w-3 h-3 text-white" />
                    </div>
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                      Your Location
                    </div>
                  </div>

                  {/* Labor team markers */}
                  {filteredTeams.slice(0, 5).map((team, index) => {
                    // Calculate position based on distance and a random angle
                    const angle = (index / 5) * Math.PI * 2
                    const distance = team.distance * 10 // Scale for visualization
                    const maxDistance = 100 // Maximum distance in pixels
                    const scaledDistance = Math.min(distance, maxDistance)
                    const x = 50 + ((Math.cos(angle) * scaledDistance) / maxDistance) * 40
                    const y = 50 + ((Math.sin(angle) * scaledDistance) / maxDistance) * 40

                    return (
                      <div
                        key={team.id}
                        className="absolute w-5 h-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center"
                        style={{ left: `${x}%`, top: `${y}%` }}
                      >
                        <Users className="w-3 h-3 text-white" />
                        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
                          {team.name} ({team.distance} km)
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-80 p-2 rounded text-xs text-white">
                Showing labor teams within 10km of your location
              </div>
            </div>

            {/* Labor Teams List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Available Labor Teams</h3>

              {filteredTeams.length === 0 ? (
                <div className="bg-gray-700 rounded-lg p-6 text-center text-white">
                  No labor teams found matching your criteria. Try adjusting your filters.
                </div>
              ) : (
                filteredTeams.map((team) => (
                  <Card key={team.id} className="bg-gray-700 border-gray-600">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-400" />
                            <h4 className="font-semibold text-white text-lg">{team.name}</h4>
                          </div>
                          <div className="flex items-center gap-1 text-amber-400">
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <svg
                                  key={i}
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill={i < Math.floor(team.rating) ? "currentColor" : "none"}
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                </svg>
                              ))}
                            <span className="ml-1 text-sm">{team.rating}/5</span>
                          </div>
                          <p className="text-white/80 text-sm">
                            {team.type} • {team.members} members
                          </p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {team.skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-600 rounded-full text-xs text-white">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2 md:text-right">
                          <div className="flex items-center gap-2 md:justify-end">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-white/80 text-sm">
                              {team.distance} km away • {team.location}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 md:justify-end">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span
                              className={`text-sm ${team.availability === "Immediate" ? "text-green-400" : "text-white/80"}`}
                            >
                              {team.availability}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 md:justify-end">
                            <Briefcase className="h-4 w-4 text-gray-400" />
                            <span className="text-white/80 text-sm">{team.completedProjects} projects completed</span>
                          </div>
                          <div className="flex items-center gap-2 md:justify-end">
                            <DollarSign className="h-4 w-4 text-gray-400" />
                            <span className="text-white/80 text-sm">₹{team.hourlyRate}/hour</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-600 flex flex-col sm:flex-row justify-between gap-3">
                        <div className="text-white/80 text-sm">
                          Contact: {team.contactPerson} • {team.phone}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleHireTeam(team.id)}
                            disabled={teamHiredStates[team.id]}
                          >
                            {teamHiredStates[team.id] ? "Hired" : "Hire Now"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
                            onClick={() => navigateTo(`/team/${team.id}`)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Labor Demand Analytics */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Labor Demand Analytics</CardTitle>
                <CardDescription className="text-white">Current labor market trends in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-white">General Labor</h4>
                      <span className="px-2 py-1 bg-green-600/30 text-green-400 rounded-full text-xs font-medium">
                        High Availability
                      </span>
                    </div>
                    <Progress value={75} className="h-2 mb-2" />
                    <p className="text-xs text-white/70">75% of teams available</p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-white">Skilled Electricians</h4>
                      <span className="px-2 py-1 bg-amber-600/30 text-amber-400 rounded-full text-xs font-medium">
                        Medium Availability
                      </span>
                    </div>
                    <Progress value={45} className="h-2 mb-2" />
                    <p className="text-xs text-white/70">45% of teams available</p>
                  </div>

                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-white">Specialized Masons</h4>
                      <span className="px-2 py-1 bg-red-600/30 text-red-400 rounded-full text-xs font-medium">
                        Low Availability
                      </span>
                    </div>
                    <Progress value={15} className="h-2 mb-2" />
                    <p className="text-xs text-white/70">15% of teams available</p>
                  </div>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-white mb-3">Weekly Labor Rate Trends</h4>
                  <div className="h-48 relative">
                    {/* Simple line chart visualization */}
                    <div className="absolute inset-0 flex items-end">
                      <div className="h-[35%] w-[8.33%] bg-blue-500 opacity-70"></div>
                      <div className="h-[40%] w-[8.33%] bg-blue-500 opacity-70"></div>
                      <div className="h-[45%] w-[8.33%] bg-blue-500 opacity-70"></div>
                      <div className="h-[50%] w-[8.33%] bg-blue-500 opacity-70"></div>
                      <div className="h-[55%] w-[8.33%] bg-blue-500 opacity-70"></div>
                      <div className="h-[60%] w-[8.33%] bg-blue-500 opacity-70"></div>
                      <div className="h-[65%] w-[8.33%] bg-blue-500 opacity-70"></div>
                      <div className="h-[60%] w-[8.33%] bg-blue-500 opacity-70"></div>
                      <div className="h-[55%] w-[8.33%] bg-blue-500 opacity-70"></div>
                      <div className="h-[50%] w-[8.33%] bg-blue-500 opacity-70"></div>
                      <div className="h-[45%] w-[8.33%] bg-blue-500 opacity-70"></div>
                      <div className="h-[40%] w-[8.33%] bg-blue-500 opacity-70"></div>
                    </div>

                    {/* Overlay grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                      <div className="border-b border-gray-600 h-1/4"></div>
                      <div className="border-b border-gray-600 h-1/4"></div>
                      <div className="border-b border-gray-600 h-1/4"></div>
                      <div className="border-b border-gray-600 h-1/4"></div>
                    </div>

                    {/* Y-axis labels */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-white/70 pointer-events-none">
                      <div>₹600</div>
                      <div>₹500</div>
                      <div>₹400</div>
                      <div>₹300</div>
                    </div>

                    {/* X-axis labels */}
                    <div className="absolute left-12 right-0 bottom-0 translate-y-6 flex justify-between text-xs text-white/70 pointer-events-none">
                      <div>Jan</div>
                      <div>Feb</div>
                      <div>Mar</div>
                      <div>Apr</div>
                      <div>May</div>
                      <div>Jun</div>
                      <div>Jul</div>
                      <div>Aug</div>
                      <div>Sep</div>
                      <div>Oct</div>
                      <div>Nov</div>
                      <div>Dec</div>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 mt-8">
                    Labor rates have been increasing since May due to high demand in the construction sector.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* ETL Data Import Section */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Labor Data Management</CardTitle>
                <CardDescription className="text-white">
                  Import and manage labor team data via ETL pipelines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="h-5 w-5 text-blue-400" />
                      <h4 className="font-medium text-white">Import Labor Team Data</h4>
                    </div>
                    <p className="text-white/80 mb-3">
                      Upload CSV files with labor team information to update the database. The ETL pipeline will
                      automatically process and validate the data.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                        <Truck className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-white/80 mb-2">Drag and drop your CSV file here</p>
                        <p className="text-xs text-white/60">or</p>
                        <Button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">Browse Files</Button>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-white">labor_teams_2023.csv</span>
                          </div>
                          <span className="text-xs text-green-400">Imported</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-white">skilled_workers_q2.csv</span>
                          </div>
                          <span className="text-xs text-green-400">Imported</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-600 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-400" />
                            <span className="text-sm text-white">contractor_database.csv</span>
                          </div>
                          <span className="text-xs text-amber-400">Processing</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="h-5 w-5 text-green-400" />
                      <h4 className="font-medium text-white">ETL Pipeline Status</h4>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Last data refresh:</span>
                        <span className="text-white">Today, 09:45</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Records processed:</span>
                        <span className="text-white">1,248</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Data sources:</span>
                        <span className="text-white">3 active sources</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/80">Next scheduled update:</span>
                        <span className="text-white">Tomorrow, 06:00</span>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-600/20">
                        View ETL Logs
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Update the renderTabContent function to include the new labor-availability tab
  // In the renderTabContent function, add a new case for "labor-availability"
  const renderTabContentImpl = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboardContent()
      case "projects":
        return renderProjectsContent()
      case "materials":
        return renderMaterialsContent()
      case "expenses":
        return renderExpensesContent()
      case "weather-scheduling":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Weather Scheduling</h2>
              <div className="w-64">
                <Label htmlFor="weather-location" className="text-white mb-2 block">
                  Location
                </Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger id="weather-location" className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600 text-white">
                    <SelectItem value="Mumbai">Mumbai</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Bangalore">Bangalore</SelectItem>
                    <SelectItem value="Chennai">Chennai</SelectItem>
                    <SelectItem value="Kolkata">Kolkata</SelectItem>
                    <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="Pune">Pune</SelectItem>
                    <SelectItem value="Mangalore">Mangalore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <WeatherSchedulingContent location={selectedLocation} />
          </div>
        )
      case "carbon-footprint":
        return renderCarbonFootprintContent()
      case "labor-availability":
        return renderLaborAvailabilityContent()
      case "risk-alerts":
        return renderRiskAlertsContent()
      case "profile":
        return renderProfileContent()
      default:
        return renderDashboardContent()
    }
  }

  // Update the sidebar navigation to include the new labor-availability item
  // In the return statement, find the sidebar navigation section and add the new button after the Carbon Footprint button
  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-6 w-6 text-white" />
      </button>

      {/* Sidebar Navigation */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Construction className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold text-white">BuildSmart AI</h1>
          </div>

          <div className="space-y-1">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "dashboard" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => navigateTo("dashboard")}
            >
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "weather-scheduling" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "weather-scheduling" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => navigateTo("weather-scheduling")}
            >
              <CloudRain className="mr-2 h-5 w-5" />
              Weather Scheduling
            </Button>
            <Button
              variant={activeTab === "carbon-footprint" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "carbon-footprint" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => navigateTo("carbon-footprint")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M2 22a10 10 0 1 1 20 0"></path>
                <path d="M16 8a4 4 0 1 0-8 0"></path>
                <path d="M12 11v11"></path>
              </svg>
              Carbon Footprint
            </Button>
            <Button
              variant={activeTab === "labor-availability" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "labor-availability" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => navigateTo("labor-availability")}
            >
              <Users className="mr-2 h-5 w-5" />
              Labor Availability
            </Button>
            <Button
              variant={activeTab === "risk-alerts" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "risk-alerts" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => navigateTo("risk-alerts")}
            >
              <AlertCircle className="mr-2 h-5 w-5" />
              Risk Alerts
            </Button>
            <Button
              variant={activeTab === "projects" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "projects" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => navigateTo("projects")}
            >
              <Package className="mr-2 h-5 w-5" />
              My Projects
            </Button>
            <Button
              variant={activeTab === "materials" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "materials" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => navigateTo("materials")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Materials
            </Button>
            <Button
              variant={activeTab === "expenses" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "expenses" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => navigateTo("expenses")}
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Expenses
            </Button>
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "profile" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => navigateTo("profile")}
            >
              <User className="mr-2 h-5 w-5" />
              Profile
            </Button>
          </div>

          <Separator className="my-6 bg-gray-700" />

          <Link href="/">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-700 hover:text-white">
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-4 md:p-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {activeTab !== "dashboard" && (
              <Button
                variant="outline"
                size="sm"
                className="text-white border-gray-600 hover:bg-gray-700"
                onClick={goBack}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </Button>
            )}
            <h1 className="text-3xl font-bold text-white">
              {activeTab === "dashboard"
                ? "Homeowner Dashboard"
                : activeTab === "projects"
                  ? "My Projects"
                  : activeTab === "materials"
                    ? "Materials Management"
                    : activeTab === "expenses"
                      ? "Expense Tracking"
                      : activeTab === "weather-scheduling"
                        ? "Weather Scheduling"
                        : activeTab === "carbon-footprint"
                          ? "Carbon Footprint Sustainability"
                          : activeTab === "profile"
                            ? "User Profile"
                            : activeTab === "labor-availability"
                              ? "Labor Availability"
                              : "Risk Alerts"}
            </h1>
          </div>
          <p className="text-white">
            {activeTab === "dashboard"
              ? "Plan and manage your construction projects with AI-powered insights"
              : activeTab === "projects"
                ? "Track the progress of your ongoing construction projects"
                : activeTab === "materials"
                  ? "Manage your construction materials and track their status"
                : activeTab === "expenses"
                  ? "Monitor and manage your construction expenses"
                : activeTab === "weather-scheduling"
                  ? "Optimize your construction schedule based on weather forecasts"
                : activeTab === "carbon-footprint"
                  ? "Analyze and reduce the carbon footprint of your construction project"
                : activeTab === "profile"
                  ? "Manage your account information and preferences"
                : activeTab === "labor-availability"
                  ? "Find and hire skilled labor teams near your construction site"
                  : "Manage project risks and implement mitigation strategies"}
          </p>
        </header>

        {renderTabContentImpl()}
      </div>
    </div>
  )
}
