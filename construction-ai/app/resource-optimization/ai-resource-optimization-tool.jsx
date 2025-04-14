"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, CloudRain, Sun, Wind, AlertTriangle, Loader2 } from "lucide-react"

export function AIResourceOptimizationTool() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [activeTab, setActiveTab] = useState("materials")

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setResults({
        materials: {
          recommendations: [
            {
              id: 1,
              title: "Eco-friendly concrete alternative",
              description:
                "Replace 30% of traditional concrete with fly ash concrete to reduce carbon footprint by 25%.",
              impact: "High",
              costSavings: "₹45,000",
              sustainabilityScore: 85,
            },
            {
              id: 2,
              title: "Local sourcing of timber",
              description:
                "Source timber from sustainable forests within 100km radius to reduce transportation emissions.",
              impact: "Medium",
              costSavings: "₹12,000",
              sustainabilityScore: 78,
            },
            {
              id: 3,
              title: "Recycled steel reinforcement",
              description: "Use recycled steel for 50% of reinforcement needs.",
              impact: "Medium",
              costSavings: "₹28,000",
              sustainabilityScore: 72,
            },
          ],
          optimizedSchedule: {
            timeline: "Reduced by 5 days",
            costImpact: "Savings of ₹65,000",
            riskFactors: "Low weather dependency",
          },
        },
        labor: {
          recommendations: [
            {
              id: 1,
              title: "Skill-based team allocation",
              description: "Reorganize teams based on specialized skills to improve efficiency by 15%.",
              impact: "High",
              costSavings: "₹38,000",
              efficiencyScore: 92,
            },
            {
              id: 2,
              title: "Staggered shift scheduling",
              description: "Implement staggered shifts to maximize equipment utilization and reduce idle time.",
              impact: "Medium",
              costSavings: "₹22,000",
              efficiencyScore: 84,
            },
          ],
          weatherAdjustments: {
            rainyDays: "Allocate indoor tasks",
            extremeHeat: "Early morning scheduling",
            windyConditions: "Postpone height-related work",
          },
        },
        equipment: {
          recommendations: [
            {
              id: 1,
              title: "Equipment sharing schedule",
              description: "Implement shared usage of heavy machinery with nearby construction sites.",
              impact: "High",
              costSavings: "₹78,000",
              efficiencyScore: 88,
            },
            {
              id: 2,
              title: "Electric alternatives",
              description: "Replace 40% of diesel equipment with electric alternatives.",
              impact: "Medium",
              costSavings: "₹32,000",
              sustainabilityScore: 90,
            },
          ],
          maintenanceSchedule: {
            frequency: "Optimized preventive maintenance",
            downtime: "Reduced by 30%",
            lifespan: "Extended by 15%",
          },
        },
      })
      setLoading(false)
    }, 2000)
  }

  const getImpactColor = (impact) => {
    switch (impact) {
      case "High":
        return "bg-green-100 text-green-800 border-green-300"
      case "Medium":
        return "bg-blue-100 text-blue-800 border-blue-300"
      case "Low":
        return "bg-amber-100 text-amber-800 border-amber-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Resource Optimization Tool</CardTitle>
          <CardDescription>
            Optimize your construction resources with AI-powered recommendations for materials, labor, and equipment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!results ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-type">Project Type</Label>
                    <Select defaultValue="residential">
                      <SelectTrigger id="project-type">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential Building</SelectItem>
                        <SelectItem value="commercial">Commercial Complex</SelectItem>
                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="industrial">Industrial Facility</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-size">Project Size (sq. ft.)</Label>
                    <Input id="project-size" type="number" placeholder="e.g., 5000" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Project Location</Label>
                    <Input id="location" placeholder="e.g., Mumbai, Maharashtra" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Project Duration (months)</Label>
                    <Input id="duration" type="number" placeholder="e.g., 12" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (₹)</Label>
                  <Input id="budget" type="number" placeholder="e.g., 10000000" />
                </div>

                <div className="space-y-2">
                  <Label>Sustainability Priority</Label>
                  <Slider defaultValue={[50]} max={100} step={1} />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Cost-focused</span>
                    <span>Balanced</span>
                    <span>Eco-focused</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="constraints">Special Constraints or Requirements</Label>
                  <Textarea
                    id="constraints"
                    placeholder="Enter any special requirements, constraints, or preferences for your project..."
                    rows={3}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Resources...
                  </>
                ) : (
                  "Generate Optimization Recommendations"
                )}
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="labor">Labor</TabsTrigger>
                  <TabsTrigger value="equipment">Equipment</TabsTrigger>
                </TabsList>
                <TabsContent value="materials" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Material Recommendations</h3>
                    {results.materials.recommendations.map((rec) => (
                      <Card key={rec.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{rec.title}</CardTitle>
                            <Badge className={getImpactColor(rec.impact)}>{rec.impact} Impact</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-600">{rec.description}</p>
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm font-medium">Cost Savings: {rec.costSavings}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${rec.sustainabilityScore}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs">{rec.sustainabilityScore}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Optimized Schedule Impact</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm">{results.materials.optimizedSchedule.timeline}</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">{results.materials.optimizedSchedule.costImpact}</span>
                        </div>
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                          <span className="text-sm">{results.materials.optimizedSchedule.riskFactors}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="labor" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Labor Optimization</h3>
                    {results.labor.recommendations.map((rec) => (
                      <Card key={rec.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{rec.title}</CardTitle>
                            <Badge className={getImpactColor(rec.impact)}>{rec.impact} Impact</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-600">{rec.description}</p>
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm font-medium">Cost Savings: {rec.costSavings}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${rec.efficiencyScore}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs">{rec.efficiencyScore}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Weather-Adjusted Labor Planning</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <CloudRain className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm">{results.labor.weatherAdjustments.rainyDays}</span>
                        </div>
                        <div className="flex items-center">
                          <Sun className="h-4 w-4 text-amber-500 mr-2" />
                          <span className="text-sm">{results.labor.weatherAdjustments.extremeHeat}</span>
                        </div>
                        <div className="flex items-center">
                          <Wind className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">{results.labor.weatherAdjustments.windyConditions}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="equipment" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Equipment Optimization</h3>
                    {results.equipment.recommendations.map((rec) => (
                      <Card key={rec.id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{rec.title}</CardTitle>
                            <Badge className={getImpactColor(rec.impact)}>{rec.impact} Impact</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <p className="text-sm text-gray-600">{rec.description}</p>
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-sm font-medium">Cost Savings: {rec.costSavings}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${rec.sustainabilityScore || rec.efficiencyScore}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs">{rec.sustainabilityScore || rec.efficiencyScore}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Maintenance Optimization</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-blue-500 mr-2" />
                          <span className="text-sm">{results.equipment.maintenanceSchedule.frequency}</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span className="text-sm">{results.equipment.maintenanceSchedule.downtime}</span>
                        </div>
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                          <span className="text-sm">{results.equipment.maintenanceSchedule.lifespan}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {results && (
            <>
              <Button variant="outline" onClick={() => setResults(null)}>
                Start New Analysis
              </Button>
              <Button>Save Recommendations</Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
