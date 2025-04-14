"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Wind,
  Sun,
  CloudRain,
  Truck,
  Users,
  Package,
  PenToolIcon as Tool,
  Layers,
} from "lucide-react"
import ResourcePredictionModel from "./resource-prediction-model"
import OptimizationEngine from "./optimization-engine"
import DataIntegrationService from "./data-integration-service"

const ResourceOptimizationDashboard = () => {
  const [resourceData, setResourceData] = useState(null)
  const [optimizationResults, setOptimizationResults] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState("project1")
  const [timeframe, setTimeframe] = useState("weekly")
  const [riskLevel, setRiskLevel] = useState("medium")

  // Sample projects for demonstration
  const projects = [
    { id: "project1", name: "Residential Complex" },
    { id: "project2", name: "Commercial Building" },
    { id: "project3", name: "Infrastructure Project" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch historical and real-time data
        const historicalData = await DataIntegrationService.fetchHistoricalData(selectedProject)
        const realTimeData = await DataIntegrationService.fetchRealTimeData(selectedProject)

        // Generate predictions using AI model
        const predictions = await ResourcePredictionModel.generatePredictions(historicalData, realTimeData, timeframe)

        // Run optimization algorithms
        const optimized = await OptimizationEngine.optimizeResources(predictions, {
          costPriority: 0.4,
          timePriority: 0.3,
          carbonPriority: 0.3,
        })

        setResourceData({
          historical: historicalData,
          realTime: realTimeData,
          predictions: predictions,
        })

        setOptimizationResults(optimized)
      } catch (error) {
        console.error("Error fetching resource data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedProject, timeframe])

  // Sample data for visualization
  const resourceUsageData = [
    { name: "Week 1", Predicted: 4000, Actual: 2400, Optimized: 3000 },
    { name: "Week 2", Predicted: 3000, Actual: 1398, Optimized: 2000 },
    { name: "Week 3", Predicted: 2000, Actual: 9800, Optimized: 2780 },
    { name: "Week 4", Predicted: 2780, Actual: 3908, Optimized: 1890 },
    { name: "Week 5", Predicted: 1890, Actual: 4800, Optimized: 2390 },
    { name: "Week 6", Predicted: 2390, Actual: 3800, Optimized: 3490 },
  ]

  const carbonFootprintData = [
    { name: "Concrete", value: 400, color: "#0088FE" },
    { name: "Steel", value: 300, color: "#00C49F" },
    { name: "Wood", value: 300, color: "#FFBB28" },
    { name: "Other", value: 200, color: "#FF8042" },
  ]

  const riskAssessmentData = [
    { name: "Weather Delays", probability: 0.3, impact: 0.8, score: 0.24 },
    { name: "Supply Chain Issues", probability: 0.5, impact: 0.7, score: 0.35 },
    { name: "Labor Shortages", probability: 0.4, impact: 0.6, score: 0.24 },
    { name: "Equipment Failure", probability: 0.2, impact: 0.9, score: 0.18 },
    { name: "Budget Overruns", probability: 0.6, impact: 0.5, score: 0.3 },
  ]

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resource Optimization Dashboard</h1>
        <div className="flex gap-4">
          <select
            className="border rounded p-2"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <select className="border rounded p-2" value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resource Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline mr-1 text-green-500" size={16} />
              +2.5% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,500</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline mr-1 text-green-500" size={16} />
              +15% from traditional planning
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Carbon Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.3 tons</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline mr-1 text-green-500" size={16} />
              -18% from baseline
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="resources" className="mb-6">
        <TabsList>
          <TabsTrigger value="resources">Resource Allocation</TabsTrigger>
          <TabsTrigger value="schedule">Dynamic Schedule</TabsTrigger>
          <TabsTrigger value="carbon">Carbon Footprint</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Resource Usage Prediction vs. Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resourceUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Predicted" fill="#8884d8" />
                    <Bar dataKey="Actual" fill="#82ca9d" />
                    <Bar dataKey="Optimized" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-2">
                  <Package size={20} />
                  <div>
                    <h3 className="font-medium">Materials</h3>
                    <p className="text-sm text-muted-foreground">Optimized by 23%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={20} />
                  <div>
                    <h3 className="font-medium">Labor</h3>
                    <p className="text-sm text-muted-foreground">Optimized by 15%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Tool size={20} />
                  <div>
                    <h3 className="font-medium">Equipment</h3>
                    <p className="text-sm text-muted-foreground">Optimized by 18%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Dynamic Project Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] overflow-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border p-2 text-left">Task</th>
                      <th className="border p-2 text-left">Start Date</th>
                      <th className="border p-2 text-left">End Date</th>
                      <th className="border p-2 text-left">Resources</th>
                      <th className="border p-2 text-left">Status</th>
                      <th className="border p-2 text-left">Weather Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Foundation Work</td>
                      <td className="border p-2">May 1, 2023</td>
                      <td className="border p-2">May 15, 2023</td>
                      <td className="border p-2">Concrete, Labor (5)</td>
                      <td className="border p-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                      </td>
                      <td className="border p-2">
                        <div className="flex items-center">
                          <Sun size={16} className="text-yellow-500 mr-1" />
                          <span className="text-xs">No impact</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">Framing</td>
                      <td className="border p-2">May 16, 2023</td>
                      <td className="border p-2">June 10, 2023</td>
                      <td className="border p-2">Wood, Steel, Labor (8)</td>
                      <td className="border p-2">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">In Progress</span>
                      </td>
                      <td className="border p-2">
                        <div className="flex items-center">
                          <Wind size={16} className="text-blue-500 mr-1" />
                          <span className="text-xs">Minor delay (1 day)</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">Roofing</td>
                      <td className="border p-2">June 11, 2023</td>
                      <td className="border p-2">June 25, 2023</td>
                      <td className="border p-2">Shingles, Labor (6)</td>
                      <td className="border p-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Scheduled</span>
                      </td>
                      <td className="border p-2">
                        <div className="flex items-center">
                          <CloudRain size={16} className="text-red-500 mr-1" />
                          <span className="text-xs">High risk (3-5 days)</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">Electrical</td>
                      <td className="border p-2">June 20, 2023</td>
                      <td className="border p-2">July 10, 2023</td>
                      <td className="border p-2">Wiring, Labor (4)</td>
                      <td className="border p-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Scheduled</span>
                      </td>
                      <td className="border p-2">
                        <div className="flex items-center">
                          <Sun size={16} className="text-yellow-500 mr-1" />
                          <span className="text-xs">No impact</span>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="border p-2">Plumbing</td>
                      <td className="border p-2">June 20, 2023</td>
                      <td className="border p-2">July 15, 2023</td>
                      <td className="border p-2">Pipes, Labor (3)</td>
                      <td className="border p-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Scheduled</span>
                      </td>
                      <td className="border p-2">
                        <div className="flex items-center">
                          <Sun size={16} className="text-yellow-500 mr-1" />
                          <span className="text-xs">No impact</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4">
                <Button variant="outline" className="mr-2">
                  <Calendar className="mr-2 h-4 w-4" /> View Gantt Chart
                </Button>
                <Button variant="outline">
                  <Clock className="mr-2 h-4 w-4" /> Optimize Schedule
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carbon">
          <Card>
            <CardHeader>
              <CardTitle>Carbon Footprint Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={carbonFootprintData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {carbonFootprintData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Sustainability Insights</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 bg-green-500 rounded-full p-1">
                        <TrendingDown className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">Material Substitution</h4>
                        <p className="text-sm text-muted-foreground">
                          Replacing traditional concrete with low-carbon alternatives could reduce carbon footprint by
                          18%.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 bg-green-500 rounded-full p-1">
                        <Truck className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">Optimized Logistics</h4>
                        <p className="text-sm text-muted-foreground">
                          Reducing transportation distances by sourcing locally saves 5.2 tons of CO2.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 bg-green-500 rounded-full p-1">
                        <Layers className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium">Waste Reduction</h4>
                        <p className="text-sm text-muted-foreground">
                          Precise resource allocation reduces waste by 22%, saving 3.1 tons of CO2.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks">
          <Card>
            <CardHeader>
              <CardTitle>Risk Assessment & Mitigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Risk Factors</h3>
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-muted">
                        <th className="p-2 text-left">Risk Factor</th>
                        <th className="p-2 text-left">Probability</th>
                        <th className="p-2 text-left">Impact</th>
                        <th className="p-2 text-left">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskAssessmentData.map((risk, index) => (
                        <tr key={index} className={risk.score > 0.3 ? "bg-red-50" : ""}>
                          <td className="p-2">{risk.name}</td>
                          <td className="p-2">{(risk.probability * 100).toFixed(0)}%</td>
                          <td className="p-2">{(risk.impact * 100).toFixed(0)}%</td>
                          <td className="p-2">
                            <div className="flex items-center">
                              <span className={`mr-2 ${risk.score > 0.3 ? "text-red-500 font-medium" : ""}`}>
                                {(risk.score * 100).toFixed(0)}%
                              </span>
                              {risk.score > 0.3 && <AlertTriangle size={16} className="text-red-500" />}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-4">Mitigation Strategies</h3>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-md">
                      <h4 className="font-medium">Weather Contingency Plan</h4>
                      <p className="text-sm text-muted-foreground">
                        Schedule critical outdoor activities during forecasted clear weather periods. Maintain a 3-day
                        buffer for weather-sensitive tasks.
                      </p>
                    </div>
                    <div className="p-3 border rounded-md">
                      <h4 className="font-medium">Supply Chain Redundancy</h4>
                      <p className="text-sm text-muted-foreground">
                        Identify alternative suppliers for critical materials. Pre-order high-risk items with longer
                        lead times.
                      </p>
                    </div>
                    <div className="p-3 border rounded-md">
                      <h4 className="font-medium">Labor Resource Pool</h4>
                      <p className="text-sm text-muted-foreground">
                        Maintain relationships with multiple subcontractors. Cross-train workers for flexibility during
                        shortages.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weather Impact Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <CloudRain size={24} className="text-blue-500" />
                  <div>
                    <h4 className="font-medium">Heavy Rain Expected</h4>
                    <p className="text-sm text-muted-foreground">June 12-14, 2023</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-red-500 font-medium">High Risk</span>
                  <p className="text-sm text-muted-foreground">Affects Roofing</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <Wind size={24} className="text-gray-500" />
                  <div>
                    <h4 className="font-medium">High Winds</h4>
                    <p className="text-sm text-muted-foreground">June 18, 2023</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-yellow-500 font-medium">Medium Risk</span>
                  <p className="text-sm text-muted-foreground">Affects Crane Operations</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div className="flex items-center gap-3">
                  <Sun size={24} className="text-yellow-500" />
                  <div>
                    <h4 className="font-medium">Extreme Heat</h4>
                    <p className="text-sm text-muted-foreground">July 5-8, 2023</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-yellow-500 font-medium">Medium Risk</span>
                  <p className="text-sm text-muted-foreground">Affects Concrete Curing</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resource Allocation Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-md bg-green-50">
                <h4 className="font-medium flex items-center">
                  <TrendingUp className="mr-2 text-green-500" size={18} />
                  Optimize Concrete Delivery Schedule
                </h4>
                <p className="text-sm text-muted-foreground">
                  Rescheduling concrete deliveries to avoid forecasted rain periods can save $3,200 and prevent 2-day
                  delay.
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  Apply Recommendation
                </Button>
              </div>
              <div className="p-3 border rounded-md bg-green-50">
                <h4 className="font-medium flex items-center">
                  <TrendingUp className="mr-2 text-green-500" size={18} />
                  Reallocate Labor Resources
                </h4>
                <p className="text-sm text-muted-foreground">
                  Shifting 3 workers from framing to electrical work during June 22-25 can accelerate schedule by 4
                  days.
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  Apply Recommendation
                </Button>
              </div>
              <div className="p-3 border rounded-md bg-green-50">
                <h4 className="font-medium flex items-center">
                  <TrendingUp className="mr-2 text-green-500" size={18} />
                  Substitute Materials
                </h4>
                <p className="text-sm text-muted-foreground">
                  Using locally sourced recycled steel can reduce carbon footprint by 4.2 tons and save $1,800 in
                  transportation costs.
                </p>
                <Button size="sm" variant="outline" className="mt-2">
                  Apply Recommendation
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ResourceOptimizationDashboard
