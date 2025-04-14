"use client"

import { CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Construction,
  DollarSign,
  FileText,
  Home,
  LogOut,
  Menu,
  Package,
  Plus,
  ShoppingBag,
  User,
  Users,
  X,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
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

// Dummy data for projects
const projects = [
  {
    id: 1,
    name: "Modern Villa Construction",
    client: "John Smith",
    type: "Villa",
    location: "123 Main St, Anytown",
    progress: 35,
    startDate: "2023-05-15",
    endDate: "2023-12-20",
    budget: 4500000,
    spent: 1575000,
    status: "In Progress",
    materials: [
      { name: "Cement", required: "120 bags", delivered: "50 bags", status: "Partial" },
      { name: "Steel", required: "5 tons", delivered: "2 tons", status: "Partial" },
      { name: "Bricks", required: "12000 pieces", delivered: "5000 pieces", status: "Partial" },
      { name: "Sand", required: "60 cubic meters", delivered: "25 cubic meters", status: "Partial" },
    ],
    labor: [
      { type: "Mason", assigned: 6, present: 5 },
      { type: "Helper", assigned: 12, present: 10 },
      { type: "Carpenter", assigned: 3, present: 3 },
      { type: "Electrician", assigned: 1, present: 1 },
    ],
    tasks: [
      { name: "Foundation Work", status: "Completed", dueDate: "2023-06-15" },
      { name: "Wall Construction", status: "In Progress", dueDate: "2023-08-30" },
      { name: "Electrical Wiring", status: "Not Started", dueDate: "2023-09-15" },
      { name: "Plumbing", status: "Not Started", dueDate: "2023-09-30" },
    ],
  },
  {
    id: 2,
    name: "Commercial Office Building",
    client: "ABC Corporation",
    type: "Commercial Office",
    location: "456 Business Park, Anytown",
    progress: 65,
    startDate: "2023-02-10",
    endDate: "2023-11-30",
    budget: 12000000,
    spent: 7800000,
    status: "In Progress",
    materials: [
      { name: "Cement", required: "500 bags", delivered: "400 bags", status: "Partial" },
      { name: "Steel", required: "25 tons", delivered: "20 tons", status: "Partial" },
      { name: "Glass", required: "200 panels", delivered: "150 panels", status: "Partial" },
      { name: "Aluminum", required: "3 tons", delivered: "2 tons", status: "Partial" },
    ],
    labor: [
      { type: "Mason", assigned: 15, present: 12 },
      { type: "Helper", assigned: 30, present: 25 },
      { type: "Carpenter", assigned: 8, present: 7 },
      { type: "Electrician", assigned: 5, present: 4 },
    ],
    tasks: [
      { name: "Foundation Work", status: "Completed", dueDate: "2023-03-15" },
      { name: "Structure Construction", status: "Completed", dueDate: "2023-06-30" },
      { name: "Interior Work", status: "In Progress", dueDate: "2023-09-15" },
      { name: "Finishing", status: "Not Started", dueDate: "2023-10-30" },
    ],
  },
]

// Dummy data for labor pool
const laborPool = [
  {
    id: 1,
    name: "Rajesh Kumar",
    type: "Mason",
    experience: "5 years",
    dailyWage: 800,
    rating: 4.5,
    availability: "Available",
  },
  {
    id: 2,
    name: "Sunil Sharma",
    type: "Mason",
    experience: "8 years",
    dailyWage: 900,
    rating: 4.8,
    availability: "Assigned",
  },
  {
    id: 3,
    name: "Amit Singh",
    type: "Helper",
    experience: "2 years",
    dailyWage: 500,
    rating: 4.0,
    availability: "Available",
  },
  {
    id: 4,
    name: "Vijay Patel",
    type: "Carpenter",
    experience: "6 years",
    dailyWage: 850,
    rating: 4.6,
    availability: "Assigned",
  },
  {
    id: 5,
    name: "Ravi Verma",
    type: "Electrician",
    experience: "7 years",
    dailyWage: 950,
    rating: 4.7,
    availability: "Available",
  },
  {
    id: 6,
    name: "Sanjay Gupta",
    type: "Plumber",
    experience: "4 years",
    dailyWage: 800,
    rating: 4.2,
    availability: "Available",
  },
  {
    id: 7,
    name: "Manoj Tiwari",
    type: "Painter",
    experience: "5 years",
    dailyWage: 750,
    rating: 4.3,
    availability: "Assigned",
  },
  {
    id: 8,
    name: "Dinesh Yadav",
    type: "Helper",
    experience: "1 year",
    dailyWage: 450,
    rating: 3.8,
    availability: "Available",
  },
]

// Dummy data for material inventory
const materialInventory = [
  {
    id: 1,
    name: "Cement (OPC 53 Grade)",
    unit: "Bag",
    unitWeight: "50 kg",
    stock: 120,
    reorderLevel: 50,
    lastPurchasePrice: 350,
  },
  {
    id: 2,
    name: "Steel Reinforcement",
    unit: "Ton",
    unitWeight: "1000 kg",
    stock: 5,
    reorderLevel: 2,
    lastPurchasePrice: 65000,
  },
  {
    id: 3,
    name: "Bricks (Red Clay)",
    unit: "Piece",
    unitWeight: "3.5 kg",
    stock: 8000,
    reorderLevel: 2000,
    lastPurchasePrice: 8,
  },
  {
    id: 4,
    name: "Sand (River)",
    unit: "Cubic Meter",
    unitWeight: "1600 kg",
    stock: 30,
    reorderLevel: 10,
    lastPurchasePrice: 1800,
  },
  {
    id: 5,
    name: "Aggregate (20mm)",
    unit: "Cubic Meter",
    unitWeight: "1450 kg",
    stock: 25,
    reorderLevel: 8,
    lastPurchasePrice: 1600,
  },
  {
    id: 6,
    name: "Plywood (18mm)",
    unit: "Sheet",
    unitWeight: "12 kg",
    stock: 40,
    reorderLevel: 15,
    lastPurchasePrice: 1200,
  },
  {
    id: 7,
    name: "PVC Pipes (4 inch)",
    unit: "Length",
    unitWeight: "2.5 kg",
    stock: 60,
    reorderLevel: 20,
    lastPurchasePrice: 350,
  },
  {
    id: 8,
    name: "Electrical Wire (1.5 sq mm)",
    unit: "Coil",
    unitWeight: "5 kg",
    stock: 15,
    reorderLevel: 5,
    lastPurchasePrice: 1800,
  },
]

// Dummy data for financial transactions
const financialTransactions = [
  {
    id: 1,
    date: "2023-05-15",
    type: "Expense",
    category: "Material Purchase",
    description: "Cement - 50 bags",
    amount: 17500,
    project: "Modern Villa Construction",
  },
  {
    id: 2,
    date: "2023-05-18",
    type: "Expense",
    category: "Labor Payment",
    description: "Weekly wages for 20 workers",
    amount: 84000,
    project: "Modern Villa Construction",
  },
  {
    id: 3,
    date: "2023-05-20",
    type: "Income",
    category: "Client Payment",
    description: "First installment",
    amount: 1000000,
    project: "Modern Villa Construction",
  },
  {
    id: 4,
    date: "2023-05-25",
    type: "Expense",
    category: "Equipment Rental",
    description: "Concrete mixer - 1 week",
    amount: 15000,
    project: "Modern Villa Construction",
  },
  {
    id: 5,
    date: "2023-05-28",
    type: "Expense",
    category: "Material Purchase",
    description: "Steel - 2 tons",
    amount: 130000,
    project: "Modern Villa Construction",
  },
  {
    id: 6,
    date: "2023-06-01",
    type: "Expense",
    category: "Labor Payment",
    description: "Weekly wages for 22 workers",
    amount: 92400,
    project: "Modern Villa Construction",
  },
  {
    id: 7,
    date: "2023-06-05",
    type: "Expense",
    category: "Transportation",
    description: "Material transport charges",
    amount: 12000,
    project: "Modern Villa Construction",
  },
  {
    id: 8,
    date: "2023-06-10",
    type: "Income",
    category: "Client Payment",
    description: "Second installment",
    amount: 1500000,
    project: "Modern Villa Construction",
  },
]

// Dummy data for schedule
const scheduleData = [
  {
    id: 1,
    task: "Foundation Work",
    project: "Modern Villa Construction",
    startDate: "2023-05-15",
    endDate: "2023-06-15",
    status: "Completed",
    assignedTo: "Rajesh Kumar (Team Lead)",
    dependencies: [],
  },
  {
    id: 2,
    task: "Wall Construction",
    project: "Modern Villa Construction",
    startDate: "2023-06-16",
    endDate: "2023-08-30",
    status: "In Progress",
    assignedTo: "Sunil Sharma (Team Lead)",
    dependencies: [1],
  },
  {
    id: 3,
    task: "Electrical Wiring",
    project: "Modern Villa Construction",
    startDate: "2023-09-01",
    endDate: "2023-09-15",
    status: "Not Started",
    assignedTo: "Ravi Verma (Team Lead)",
    dependencies: [2],
  },
  {
    id: 4,
    task: "Plumbing",
    project: "Modern Villa Construction",
    startDate: "2023-09-01",
    endDate: "2023-09-30",
    status: "Not Started",
    assignedTo: "Sanjay Gupta (Team Lead)",
    dependencies: [2],
  },
  {
    id: 5,
    task: "Flooring",
    project: "Modern Villa Construction",
    startDate: "2023-10-01",
    endDate: "2023-10-30",
    status: "Not Started",
    assignedTo: "Vijay Patel (Team Lead)",
    dependencies: [3, 4],
  },
  {
    id: 6,
    task: "Painting",
    project: "Modern Villa Construction",
    startDate: "2023-11-01",
    endDate: "2023-11-30",
    status: "Not Started",
    assignedTo: "Manoj Tiwari (Team Lead)",
    dependencies: [5],
  },
  {
    id: 7,
    task: "Final Finishing",
    project: "Modern Villa Construction",
    startDate: "2023-12-01",
    endDate: "2023-12-20",
    status: "Not Started",
    assignedTo: "Project Team",
    dependencies: [6],
  },
]

export default function ContractorDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(projects[0])
  const [activeTab, setActiveTab] = useState("dashboard")
  const [riskAlerts, setRiskAlerts] = useState([
    { id: 1, type: "Material Delay", message: "Steel delivery delayed by 2 weeks", severity: "High" },
    { id: 2, type: "Labor Shortage", message: "Electricians unavailable next week", severity: "Medium" },
    { id: 3, type: "Budget Overrun", message: "Project budget exceeded by 5%", severity: "High" },
    { id: 4, type: "Weather Alert", message: "Heavy rain forecast for next 3 days", severity: "Medium" },
  ])

  // State for material form
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    quantity: "",
    unit: "",
    project: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  // State for labor form
  const [newLabor, setNewLabor] = useState({
    name: "",
    type: "",
    project: "",
    workHours: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  })

  // State for task form
  const [newTask, setNewTask] = useState({
    name: "",
    project: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    assignedTo: "",
    description: "",
  })

  // Handle material form submission
  const handleMaterialSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would save to a database
    alert(
      `Material usage recorded: ${newMaterial.quantity} ${newMaterial.unit} of ${newMaterial.name} for ${newMaterial.project}`,
    )
    setNewMaterial({
      name: "",
      quantity: "",
      unit: "",
      project: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    })
  }

  // Handle labor form submission
  const handleLaborSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would save to a database
    alert(
      `Labor assignment recorded: ${newLabor.name} (${newLabor.type}) for ${newLabor.project} - ${newLabor.workHours} hours`,
    )
    setNewLabor({
      name: "",
      type: "",
      project: "",
      workHours: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    })
  }

  // Handle task form submission
  const handleTaskSubmit = (e) => {
    e.preventDefault()
    // In a real app, this would save to a database
    alert(`Task scheduled: ${newTask.name} for ${newTask.project} assigned to ${newTask.assignedTo}`)
    setNewTask({
      name: "",
      project: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      assignedTo: "",
      description: "",
    })
  }

  // Function to dismiss risk alert
  const dismissAlert = (id) => {
    setRiskAlerts(riskAlerts.filter((alert) => alert.id !== id))
  }

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
              onClick={() => setActiveTab("dashboard")}
            >
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "projects" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "projects" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("projects")}
            >
              <Package className="mr-2 h-5 w-5" />
              Projects
            </Button>
            <Button
              variant={activeTab === "labor" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "labor" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("labor")}
            >
              <Users className="mr-2 h-5 w-5" />
              Labor Management
            </Button>
            <Button
              variant={activeTab === "materials" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "materials" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("materials")}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Materials
            </Button>
            <Button
              variant={activeTab === "schedule" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "schedule" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("schedule")}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Schedule
            </Button>
            <Button
              variant={activeTab === "finances" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "finances" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("finances")}
            >
              <DollarSign className="mr-2 h-5 w-5" />
              Finances
            </Button>
            <Button
              variant={activeTab === "profile" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "profile" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="mr-2 h-5 w-5" />
              Profile
            </Button>
            <Button
              variant={activeTab === "risk-alerts" ? "default" : "ghost"}
              className={`w-full justify-start ${activeTab === "risk-alerts" ? "bg-blue-600 text-white" : "text-white hover:bg-gray-700 hover:text-white"}`}
              onClick={() => setActiveTab("risk-alerts")}
            >
              <AlertCircle className="mr-2 h-5 w-5" />
              Risk Alerts
              {riskAlerts.length > 0 && <Badge className="ml-auto bg-red-600">{riskAlerts.length}</Badge>}
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
          <h1 className="text-3xl font-bold text-white">Contractor Dashboard</h1>
          <p className="text-white">Manage your construction projects efficiently</p>
        </header>

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <div className="grid gap-6">
            {/* Project Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Active Projects</CardDescription>
                  <CardTitle className="text-2xl text-white">5</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-400 flex items-center">
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
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                    <span>2 new this month</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Labor Assigned</CardDescription>
                  <CardTitle className="text-2xl text-white">87</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-amber-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>12 absent today</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Material Requests</CardDescription>
                  <CardTitle className="text-2xl text-white">24</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-blue-400 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>8 pending approval</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Tasks Due This Week</CardDescription>
                  <CardTitle className="text-2xl text-white">12</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-red-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>3 overdue</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Selection */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Project Management</CardTitle>
                <CardDescription className="text-white">
                  Select a project to view details and manage resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <Card
                      key={project.id}
                      className={`bg-gray-700 border-gray-600 cursor-pointer transition-all hover:bg-gray-600 ${
                        selectedProject.id === project.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-white">{project.name}</CardTitle>
                        <CardDescription className="text-white">Client: {project.client}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-white">Progress:</span>
                            <span className="text-white">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2 bg-gray-600" />
                          <div className="flex justify-between text-sm">
                            <span className="text-white">Budget Spent:</span>
                            <span className="text-white">
                              ₹{formatIndianCurrency(project.spent)} / ₹{formatIndianCurrency(project.budget)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Details */}
            {selectedProject && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{selectedProject.name}</CardTitle>
                  <CardDescription className="text-white">
                    {selectedProject.type} at {selectedProject.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview">
                    <TabsList className="bg-gray-700">
                      <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 text-white">
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="labor" className="data-[state=active]:bg-blue-600 text-white">
                        Labor Management
                      </TabsTrigger>
                      <TabsTrigger value="materials" className="data-[state=active]:bg-blue-600 text-white">
                        Materials
                      </TabsTrigger>
                      <TabsTrigger value="tasks" className="data-[state=active]:bg-blue-600 text-white">
                        Tasks
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-gray-700 border-gray-600">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-white">Timeline</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-white">Start Date:</span>
                                <span className="text-white">{selectedProject.startDate}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white">End Date:</span>
                                <span className="text-white">{selectedProject.endDate}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white">Status:</span>
                                <span className="text-green-400">{selectedProject.status}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-700 border-gray-600">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-white">Budget</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-white">Total Budget:</span>
                                <span className="text-white">₹{formatIndianCurrency(selectedProject.budget)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white">Spent:</span>
                                <span className="text-white">₹{formatIndianCurrency(selectedProject.spent)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white">Remaining:</span>
                                <span className="text-green-400">
                                  ₹{formatIndianCurrency(selectedProject.budget - selectedProject.spent)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-gray-700 border-gray-600">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-white">Progress</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-center">
                                <div className="relative h-24 w-24 flex items-center justify-center">
                                  <svg className="h-full w-full" viewBox="0 0 100 100">
                                    <circle
                                      className="text-gray-600"
                                      strokeWidth="8"
                                      stroke="currentColor"
                                      fill="transparent"
                                      r="40"
                                      cx="50"
                                      cy="50"
                                    />
                                    <circle
                                      className="text-blue-500"
                                      strokeWidth="8"
                                      strokeDasharray={`${selectedProject.progress * 2.51} 251`}
                                      strokeLinecap="round"
                                      stroke="currentColor"
                                      fill="transparent"
                                      r="40"
                                      cx="50"
                                      cy="50"
                                    />
                                  </svg>
                                  <span className="absolute text-xl font-bold text-white">
                                    {selectedProject.progress}%
                                  </span>
                                </div>
                              </div>
                              <div className="text-center text-sm text-white">
                                Project is on track with the timeline
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                        <h3 className="text-lg font-semibold mb-2 text-white">AI Performance Insights</h3>
                        <ul className="space-y-2 text-white">
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-green-600/30 p-1 mt-0.5">
                              <CheckCircle2 className="h-4 w-4 text-green-400" />
                            </div>
                            <span>Material usage efficiency is 15% better than industry average</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-amber-600/30 p-1 mt-0.5">
                              <AlertCircle className="h-4 w-4 text-amber-400" />
                            </div>
                            <span>Labor productivity could be improved by optimizing task assignments</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                              <FileText className="h-4 w-4 text-blue-400" />
                            </div>
                            <span>Consider ordering next batch of materials by next week to avoid delays</span>
                          </li>
                        </ul>
                      </div>
                    </TabsContent>

                    <TabsContent value="labor" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-white">Labor Assignment</h3>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Assign Workers</Button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 text-white">Worker Type</th>
                                <th className="text-left py-3 px-4 text-white">Assigned</th>
                                <th className="text-left py-3 px-4 text-white">Present Today</th>
                                <th className="text-left py-3 px-4 text-white">Attendance</th>
                                <th className="text-left py-3 px-4 text-white">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedProject.labor.map((labor, index) => (
                                <tr key={index} className="border-b border-gray-700">
                                  <td className="py-3 px-4 text-white">{labor.type}</td>
                                  <td className="py-3 px-4 text-white">{labor.assigned}</td>
                                  <td className="py-3 px-4 text-white">{labor.present}</td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <Progress
                                        value={(labor.present / labor.assigned) * 100}
                                        className="h-2 w-24 bg-gray-600"
                                      />
                                      <span className="ml-2 text-white">
                                        {Math.round((labor.present / labor.assigned) * 100)}%
                                      </span>
                                    </div>
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

                        <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                          <h3 className="text-lg font-semibold mb-2 text-white">AI Labor Optimization</h3>
                          <ul className="space-y-2 text-white">
                            <li className="flex items-start gap-2">
                              <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                                <Users className="h-4 w-4 text-blue-400" />
                              </div>
                              <span>Consider adding 2 more carpenters next week for upcoming interior work</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                                <Users className="h-4 w-4 text-blue-400" />
                              </div>
                              <span>Mason productivity is 20% higher than average - consider performance bonuses</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="materials" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-white">Material Requests</h3>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Request Materials</Button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 text-white">Material</th>
                                <th className="text-left py-3 px-4 text-white">Required</th>
                                <th className="text-left py-3 px-4 text-white">Delivered</th>
                                <th className="text-left py-3 px-4 text-white">Status</th>
                                <th className="text-left py-3 px-4 text-white">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedProject.materials.map((material, index) => (
                                <tr key={index} className="border-b border-gray-700">
                                  <td className="py-3 px-4 text-white">{material.name}</td>
                                  <td className="py-3 px-4 text-white">{material.required}</td>
                                  <td className="py-3 px-4 text-white">{material.delivered}</td>
                                  <td className="py-3 px-4">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        material.status === "Complete"
                                          ? "bg-green-500/20 text-green-400"
                                          : material.status === "Partial"
                                            ? "bg-amber-500/20 text-amber-400"
                                            : "bg-red-500/20 text-red-400"
                                      }`}
                                    >
                                      {material.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-400">
                                      Track
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                          <h3 className="text-lg font-semibold mb-2 text-white">AI Material Insights</h3>
                          <ul className="space-y-2 text-white">
                            <li className="flex items-start gap-2">
                              <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                                <ShoppingBag className="h-4 w-4 text-blue-400" />
                              </div>
                              <span>Current cement usage is 5% higher than estimated - review application methods</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                                <ShoppingBag className="h-4 w-4 text-blue-400" />
                              </div>
                              <span>Steel prices expected to increase by 3% next month - consider ordering now</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="tasks" className="mt-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-white">Task Scheduling</h3>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Task</Button>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 text-white">Task Name</th>
                                <th className="text-left py-3 px-4 text-white">Status</th>
                                <th className="text-left py-3 px-4 text-white">Due Date</th>
                                <th className="text-left py-3 px-4 text-white">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedProject.tasks.map((task, index) => (
                                <tr key={index} className="border-b border-gray-700">
                                  <td className="py-3 px-4 text-white">{task.name}</td>
                                  <td className="py-3 px-4">
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        task.status === "Completed"
                                          ? "bg-green-500/20 text-green-400"
                                          : task.status === "In Progress"
                                            ? "bg-amber-500/20 text-amber-400"
                                            : "bg-blue-500/20 text-blue-400"
                                      }`}
                                    >
                                      {task.status}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-white">{task.dueDate}</td>
                                  <td className="py-3 px-4">
                                    <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-400">
                                      Update
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                          <h3 className="text-lg font-semibold mb-2 text-white">AI Task Optimization</h3>
                          <ul className="space-y-2 text-white">
                            <li className="flex items-start gap-2">
                              <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                                <Calendar className="h-4 w-4 text-blue-400" />
                              </div>
                              <span>Schedule electrical wiring to start 1 week earlier to avoid bottlenecks</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                                <Calendar className="h-4 w-4 text-blue-400" />
                              </div>
                              <span>Consider parallel execution of plumbing and electrical work to save time</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4">
                  <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">Generate Report</Button>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-blue-600 text-blue-400 hover:bg-blue-600/20"
                  >
                    Contact Client
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        )}

        {/* Projects Section */}
        {activeTab === "projects" && (
          <div className="grid gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">All Projects</CardTitle>
                    <CardDescription className="text-white">
                      Manage and monitor all your construction projects
                    </CardDescription>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> New Project
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {projects.map((project) => (
                    <Card key={project.id} className="bg-gray-700 border-gray-600 hover:bg-gray-600 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-white">{project.name}</CardTitle>
                            <CardDescription className="text-white">
                              Client: {project.client} | Type: {project.type}
                            </CardDescription>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              project.status === "Completed"
                                ? "bg-green-500/20 text-green-400"
                                : project.status === "In Progress"
                                  ? "bg-amber-500/20 text-amber-400"
                                  : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {project.status}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-white">Timeline</div>
                            <div className="text-sm text-white">
                              {project.startDate} to {project.endDate}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium text-white">Budget</div>
                            <div className="text-sm text-white">
                              ₹{formatIndianCurrency(project.spent)} / ₹{formatIndianCurrency(project.budget)}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium text-white">Progress:</span>
                              <span className="text-white">{project.progress}%</span>
                            </div>
                            <Progress value={project.progress} className="h-2 bg-gray-600" />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
                          onClick={() => {
                            setSelectedProject(project)
                            setActiveTab("dashboard")
                          }}
                        >
                          View Details
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          Edit Project
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Labor Management Section */}
        {activeTab === "labor" && (
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Labor Pool</CardTitle>
                  <CardDescription className="text-white">
                    Manage your workforce and assign workers to projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 text-white">Name</th>
                          <th className="text-left py-3 px-4 text-white">Type</th>
                          <th className="text-left py-3 px-4 text-white">Experience</th>
                          <th className="text-left py-3 px-4 text-white">Daily Wage</th>
                          <th className="text-left py-3 px-4 text-white">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {laborPool.map((worker) => (
                          <tr key={worker.id} className="border-b border-gray-700">
                            <td className="py-3 px-4 text-white">{worker.name}</td>
                            <td className="py-3 px-4 text-white">{worker.type}</td>
                            <td className="py-3 px-4 text-white">{worker.experience}</td>
                            <td className="py-3 px-4 text-white">₹{worker.dailyWage}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  worker.availability === "Available"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-amber-500/20 text-amber-400"
                                }`}
                              >
                                {worker.availability}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="mr-2 h-4 w-4" /> Add Worker
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Record Labor Work</CardTitle>
                  <CardDescription className="text-white">
                    Track labor hours and assignments for your projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLaborSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="labor-name" className="text-white">
                          Worker Name
                        </Label>
                        <Select
                          value={newLabor.name}
                          onValueChange={(value) => setNewLabor({ ...newLabor, name: value })}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select worker" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600 text-white">
                            {laborPool.map((worker) => (
                              <SelectItem key={worker.id} value={worker.name}>
                                {worker.name} ({worker.type})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="labor-type" className="text-white">
                          Worker Type
                        </Label>
                        <Select
                          value={newLabor.type}
                          onValueChange={(value) => setNewLabor({ ...newLabor, type: value })}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600 text-white">
                            <SelectItem value="Mason">Mason</SelectItem>
                            <SelectItem value="Helper">Helper</SelectItem>
                            <SelectItem value="Carpenter">Carpenter</SelectItem>
                            <SelectItem value="Electrician">Electrician</SelectItem>
                            <SelectItem value="Plumber">Plumber</SelectItem>
                            <SelectItem value="Painter">Painter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="labor-project" className="text-white">
                          Project
                        </Label>
                        <Select
                          value={newLabor.project}
                          onValueChange={(value) => setNewLabor({ ...newLabor, project: value })}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600 text-white">
                            {projects.map((project) => (
                              <SelectItem key={project.id} value={project.name}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="labor-hours" className="text-white">
                          Work Hours
                        </Label>
                        <Input
                          id="labor-hours"
                          type="number"
                          placeholder="Enter hours worked"
                          className="bg-gray-700 border-gray-600 text-white"
                          value={newLabor.workHours}
                          onChange={(e) => setNewLabor({ ...newLabor, workHours: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="labor-date" className="text-white">
                          Date
                        </Label>
                        <Input
                          id="labor-date"
                          type="date"
                          className="bg-gray-700 border-gray-600 text-white"
                          value={newLabor.date}
                          onChange={(e) => setNewLabor({ ...newLabor, date: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="labor-notes" className="text-white">
                          Notes
                        </Label>
                        <Textarea
                          id="labor-notes"
                          placeholder="Enter any additional notes"
                          className="bg-gray-700 border-gray-600 text-white"
                          value={newLabor.notes}
                          onChange={(e) => setNewLabor({ ...newLabor, notes: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Record Labor Work
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Labor Analytics</CardTitle>
                <CardDescription className="text-white">
                  Insights and optimization suggestions for your workforce
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                  <h3 className="text-lg font-semibold mb-4 text-white">AI Labor Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-white">Productivity Analysis</h4>
                      <ul className="space-y-2 text-white">
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-green-600/30 p-1 mt-0.5">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          </div>
                          <span>Mason team productivity is 20% above average</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-amber-600/30 p-1 mt-0.5">
                            <AlertCircle className="h-4 w-4 text-amber-400" />
                          </div>
                          <span>Carpenter team productivity is 5% below average</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-white">Optimization Suggestions</h4>
                      <ul className="space-y-2 text-white">
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                            <Users className="h-4 w-4 text-blue-400" />
                          </div>
                          <span>Reassign 2 helpers from Project A to Project B to balance workload</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                            <Users className="h-4 w-4 text-blue-400" />
                          </div>
                          <span>Consider hiring 3 more electricians for upcoming projects</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Materials Management Section */}
        {activeTab === "materials" && (
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Material Inventory</CardTitle>
                  <CardDescription className="text-white">
                    Track your construction materials and stock levels
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 text-white">Material</th>
                          <th className="text-left py-3 px-4 text-white">Unit</th>
                          <th className="text-left py-3 px-4 text-white">Stock</th>
                          <th className="text-left py-3 px-4 text-white">Reorder Level</th>
                          <th className="text-left py-3 px-4 text-white">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materialInventory.map((material) => (
                          <tr key={material.id} className="border-b border-gray-700">
                            <td className="py-3 px-4 text-white">{material.name}</td>
                            <td className="py-3 px-4 text-white">{material.unit}</td>
                            <td className="py-3 px-4 text-white">{material.stock}</td>
                            <td className="py-3 px-4 text-white">{material.reorderLevel}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  material.stock > material.reorderLevel
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {material.stock > material.reorderLevel ? "In Stock" : "Low Stock"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="mr-2 h-4 w-4" /> Add Material
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Record Material Usage</CardTitle>
                  <CardDescription className="text-white">
                    Track materials used in your construction projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleMaterialSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="material-name" className="text-white">
                          Material
                        </Label>
                        <Select
                          value={newMaterial.name}
                          onValueChange={(value) => setNewMaterial({ ...newMaterial, name: value })}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600 text-white">
                            {materialInventory.map((material) => (
                              <SelectItem key={material.id} value={material.name}>
                                {material.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="material-quantity" className="text-white">
                          Quantity
                        </Label>
                        <Input
                          id="material-quantity"
                          type="number"
                          placeholder="Enter quantity used"
                          className="bg-gray-700 border-gray-600 text-white"
                          value={newMaterial.quantity}
                          onChange={(e) => setNewMaterial({ ...newMaterial, quantity: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="material-unit" className="text-white">
                          Unit
                        </Label>
                        <Select
                          value={newMaterial.unit}
                          onValueChange={(value) => setNewMaterial({ ...newMaterial, unit: value })}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600 text-white">
                            <SelectItem value="Bag">Bag</SelectItem>
                            <SelectItem value="Ton">Ton</SelectItem>
                            <SelectItem value="Piece">Piece</SelectItem>
                            <SelectItem value="Cubic Meter">Cubic Meter</SelectItem>
                            <SelectItem value="Sheet">Sheet</SelectItem>
                            <SelectItem value="Length">Length</SelectItem>
                            <SelectItem value="Coil">Coil</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="material-project" className="text-white">
                          Project
                        </Label>
                        <Select
                          value={newMaterial.project}
                          onValueChange={(value) => setNewMaterial({ ...newMaterial, project: value })}
                        >
                          <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                            <SelectValue placeholder="Select project" />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-700 border-gray-600 text-white">
                            {projects.map((project) => (
                              <SelectItem key={project.id} value={project.name}>
                                {project.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="material-date" className="text-white">
                          Date
                        </Label>
                        <Input
                          id="material-date"
                          type="date"
                          className="bg-gray-700 border-gray-600 text-white"
                          value={newMaterial.date}
                          onChange={(e) => setNewMaterial({ ...newMaterial, date: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="material-notes" className="text-white">
                          Notes
                        </Label>
                        <Textarea
                          id="material-notes"
                          placeholder="Enter any additional notes"
                          className="bg-gray-700 border-gray-600 text-white"
                          value={newMaterial.notes}
                          onChange={(e) => setNewMaterial({ ...newMaterial, notes: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Record Material Usage
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Material Analytics</CardTitle>
                <CardDescription className="text-white">
                  Insights and optimization suggestions for your materials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                  <h3 className="text-lg font-semibold mb-4 text-white">AI Material Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-white">Usage Analysis</h4>
                      <ul className="space-y-2 text-white">
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-green-600/30 p-1 mt-0.5">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          </div>
                          <span>Cement usage efficiency is 10% better than industry average</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-amber-600/30 p-1 mt-0.5">
                            <AlertCircle className="h-4 w-4 text-amber-400" />
                          </div>
                          <span>Steel wastage is 3% higher than optimal levels</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-white">Procurement Suggestions</h4>
                      <ul className="space-y-2 text-white">
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                            <ShoppingBag className="h-4 w-4 text-blue-400" />
                          </div>
                          <span>Order 50 more bags of cement by next week to avoid delays</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                            <ShoppingBag className="h-4 w-4 text-blue-400" />
                          </div>
                          <span>Consider bulk purchase of bricks to get 8% discount from supplier</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Schedule Section */}
        {activeTab === "schedule" && (
          <div className="grid gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Project Schedule</CardTitle>
                    <CardDescription className="text-white">
                      Manage and track your construction timeline
                    </CardDescription>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add Task
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-white">Task</th>
                        <th className="text-left py-3 px-4 text-white">Project</th>
                        <th className="text-left py-3 px-4 text-white">Start Date</th>
                        <th className="text-left py-3 px-4 text-white">End Date</th>
                        <th className="text-left py-3 px-4 text-white">Status</th>
                        <th className="text-left py-3 px-4 text-white">Assigned To</th>
                        <th className="text-left py-3 px-4 text-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleData.map((task) => (
                        <tr key={task.id} className="border-b border-gray-700">
                          <td className="py-3 px-4 text-white">{task.task}</td>
                          <td className="py-3 px-4 text-white">{task.project}</td>
                          <td className="py-3 px-4 text-white">{task.startDate}</td>
                          <td className="py-3 px-4 text-white">{task.endDate}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                task.status === "Completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : task.status === "In Progress"
                                    ? "bg-amber-500/20 text-amber-400"
                                    : "bg-blue-500/20 text-blue-400"
                              }`}
                            >
                              {task.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-white">{task.assignedTo}</td>
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
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Schedule New Task</CardTitle>
                <CardDescription className="text-white">Add a new task to your project schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTaskSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="task-name" className="text-white">
                        Task Name
                      </Label>
                      <Input
                        id="task-name"
                        placeholder="Enter task name"
                        className="bg-gray-700 border-gray-600 text-white"
                        value={newTask.name}
                        onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task-project" className="text-white">
                        Project
                      </Label>
                      <Select
                        value={newTask.project}
                        onValueChange={(value) => setNewTask({ ...newTask, project: value })}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600 text-white">
                          {projects.map((project) => (
                            <SelectItem key={project.id} value={project.name}>
                              {project.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task-start-date" className="text-white">
                        Start Date
                      </Label>
                      <Input
                        id="task-start-date"
                        type="date"
                        className="bg-gray-700 border-gray-600 text-white"
                        value={newTask.startDate}
                        onChange={(e) => setNewTask({ ...newTask, startDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task-end-date" className="text-white">
                        End Date
                      </Label>
                      <Input
                        id="task-end-date"
                        type="date"
                        className="bg-gray-700 border-gray-600 text-white"
                        value={newTask.endDate}
                        onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task-assigned" className="text-white">
                        Assigned To
                      </Label>
                      <Input
                        id="task-assigned"
                        placeholder="Enter assignee name"
                        className="bg-gray-700 border-gray-600 text-white"
                        value={newTask.assignedTo}
                        onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="task-description" className="text-white">
                        Description
                      </Label>
                      <Textarea
                        id="task-description"
                        placeholder="Enter task description"
                        className="bg-gray-700 border-gray-600 text-white"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Schedule Task
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Finances Section */}
        {activeTab === "finances" && (
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Total Revenue</CardDescription>
                  <CardTitle className="text-2xl text-white">₹{formatIndianCurrency(2500000)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-400 flex items-center">
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
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                    <span>15% increase this month</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Total Expenses</CardDescription>
                  <CardTitle className="text-2xl text-white">₹{formatIndianCurrency(1850000)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-amber-400 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    <span>8% increase this month</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Net Profit</CardDescription>
                  <CardTitle className="text-2xl text-white">₹{formatIndianCurrency(650000)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-green-400 flex items-center">
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
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                      <polyline points="16 7 22 7 22 13"></polyline>
                    </svg>
                    <span>12% increase this month</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white">Financial Transactions</CardTitle>
                    <CardDescription className="text-white">
                      Track income and expenses for your projects
                    </CardDescription>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add Transaction
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4 text-white">Date</th>
                        <th className="text-left py-3 px-4 text-white">Description</th>
                        <th className="text-left py-3 px-4 text-white">Category</th>
                        <th className="text-left py-3 px-4 text-white">Project</th>
                        <th className="text-left py-3 px-4 text-white">Amount</th>
                        <th className="text-left py-3 px-4 text-white">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financialTransactions.map((transaction) => (
                        <tr key={transaction.id} className="border-b border-gray-700">
                          <td className="py-3 px-4 text-white">{transaction.date}</td>
                          <td className="py-3 px-4 text-white">{transaction.description}</td>
                          <td className="py-3 px-4 text-white">{transaction.category}</td>
                          <td className="py-3 px-4 text-white">{transaction.project}</td>
                          <td className="py-3 px-4 text-white">₹{formatIndianCurrency(transaction.amount)}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                transaction.type === "Income"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {transaction.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Financial Analytics</CardTitle>
                <CardDescription className="text-white">
                  Insights and optimization suggestions for your finances
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                  <h3 className="text-lg font-semibold mb-4 text-white">AI Financial Insights</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-white">Budget Analysis</h4>
                      <ul className="space-y-2 text-white">
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-green-600/30 p-1 mt-0.5">
                            <CheckCircle2 className="h-4 w-4 text-green-400" />
                          </div>
                          <span>Modern Villa project is 5% under budget</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-amber-600/30 p-1 mt-0.5">
                            <AlertCircle className="h-4 w-4 text-amber-400" />
                          </div>
                          <span>Commercial Office project is 3% over budget</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-white">Cost Optimization</h4>
                      <ul className="space-y-2 text-white">
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                            <DollarSign className="h-4 w-4 text-blue-400" />
                          </div>
                          <span>Potential savings of ₹50,000 by optimizing material procurement</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                            <DollarSign className="h-4 w-4 text-blue-400" />
                          </div>
                          <span>Consider renegotiating equipment rental rates to save 8%</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Profile Section */}
        {activeTab === "profile" && (
          <div className="grid gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Contractor Profile</CardTitle>
                <CardDescription className="text-white">Manage your personal and company information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-1 flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                      <User className="h-16 w-16 text-gray-500" />
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Change Photo</Button>
                  </div>
                  <div className="col-span-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          defaultValue="Rajesh Contractor"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-white">
                          Company Name
                        </Label>
                        <Input
                          id="company"
                          defaultValue="BuildSmart Construction"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          defaultValue="rajesh@buildsmart.com"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white">
                          Phone
                        </Label>
                        <Input
                          id="phone"
                          defaultValue="+91 9876543210"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license" className="text-white">
                          License Number
                        </Label>
                        <Input
                          id="license"
                          defaultValue="CONT-12345-MH"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-white">
                          Years of Experience
                        </Label>
                        <Input
                          id="experience"
                          type="number"
                          defaultValue="15"
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white">
                        Address
                      </Label>
                      <Textarea
                        id="address"
                        defaultValue="123 Construction Lane, Builder's Colony, Mumbai - 400001"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-white">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        defaultValue="Experienced contractor with 15 years of expertise in residential and commercial construction projects. Specializing in modern architectural designs with focus on quality and timely delivery."
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Risk Alerts Section */}
        {activeTab === "risk-alerts" && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Project Risk Alerts</CardTitle>
              <CardDescription className="text-white">
                Manage and mitigate potential risks to your projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {riskAlerts.length === 0 ? (
                <div className="text-white">No active risk alerts</div>
              ) : (
                riskAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg ${
                      alert.severity === "High"
                        ? "bg-red-900/30 border border-red-500"
                        : alert.severity === "Medium"
                          ? "bg-amber-900/30 border border-amber-500"
                          : "bg-green-900/30 border border-green-500"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                        <div>
                          <div className="text-white font-medium">{alert.type}</div>
                          <div className="text-white/70 text-sm">{alert.message}</div>
                          <div className="mt-1 text-xs text-white/50">Severity: {alert.severity}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-gray-700"
                        onClick={() => dismissAlert(alert.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Dismiss</span>
                      </Button>
                    </div>
                    <div className="mt-3 flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
                      >
                        View Details
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Take Action
                      </Button>
                    </div>
                  </div>
                ))
              )}

              <div className="p-4 bg-blue-600/20 rounded-lg border border-blue-600/30">
                <h3 className="text-lg font-semibold mb-2 text-white">AI Risk Management</h3>
                <p className="text-white mb-4">
                  Our AI system continuously monitors your projects for potential risks and provides mitigation
                  strategies.
                </p>
                <ul className="space-y-2 text-white">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-blue-400" />
                    </div>
                    <span>Weather forecasts are automatically analyzed to predict potential delays</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-blue-400" />
                    </div>
                    <span>Material delivery schedules are monitored to prevent shortages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-blue-600/30 p-1 mt-0.5">
                      <CheckCircle2 className="h-4 w-4 text-blue-400" />
                    </div>
                    <span>Budget trends are analyzed to identify potential overruns early</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
