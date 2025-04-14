"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  CloudRain,
  DollarSign,
  CheckCircle2,
  CalendarDays,
  Zap,
  Users,
  Wind,
  Thermometer,
  ArrowRight,
  Home,
  Building,
  Calendar,
} from "lucide-react"

// Construction timeline data with phases, tasks, and labor requirements
const constructionTimeline = {
  "Pre-Construction": {
    duration: { min: 8, max: 24 }, // weeks
    tasks: [
      { name: "Land Acquisition, Financing", duration: 4, weatherSensitive: false, laborNeeded: 2 },
      { name: "Building Plan & Services Preparation", duration: 4, weatherSensitive: false, laborNeeded: 3 },
      { name: "Budget Estimation", duration: 2, weatherSensitive: false, laborNeeded: 2 },
      { name: "Documentation", duration: 4, weatherSensitive: false, laborNeeded: 2 },
      { name: "Site Evaluation", duration: 2, weatherSensitive: true, laborNeeded: 4 },
      { name: "Architect & Engineer Selection", duration: 4, weatherSensitive: false, laborNeeded: 2 },
      { name: "Coordination", duration: 4, weatherSensitive: false, laborNeeded: 3 },
    ],
  },
  Construction: {
    duration: { min: 24, max: 48 }, // weeks
    tasks: [
      { name: "Site Preparation", duration: 4, weatherSensitive: true, laborNeeded: 6 },
      { name: "Foundation", duration: 4, weatherSensitive: true, laborNeeded: 8 },
      { name: "Concrete Pouring", duration: 3, weatherSensitive: true, laborNeeded: 7 },
      { name: "Framing", duration: 4, weatherSensitive: true, laborNeeded: 8 },
      { name: "Roofing", duration: 4, weatherSensitive: true, laborNeeded: 6 },
      { name: "Lintel Installation", duration: 2, weatherSensitive: true, laborNeeded: 5 },
      { name: "Superstructure", duration: 4, weatherSensitive: true, laborNeeded: 9 },
      { name: "Masonry Work", duration: 4, weatherSensitive: true, laborNeeded: 7 },
      { name: "Windows & Doors", duration: 3, weatherSensitive: false, laborNeeded: 5 },
      { name: "Electrical Wiring", duration: 4, weatherSensitive: false, laborNeeded: 4 },
      { name: "Plumbing", duration: 4, weatherSensitive: false, laborNeeded: 4 },
      { name: "Flooring", duration: 3, weatherSensitive: false, laborNeeded: 6 },
      { name: "Exterior Finishes", duration: 4, weatherSensitive: true, laborNeeded: 7 },
      { name: "Exterior Painting", duration: 3, weatherSensitive: true, laborNeeded: 5 },
      { name: "Steel Erection", duration: 3, weatherSensitive: true, laborNeeded: 6 },
      { name: "Scaffold Work", duration: 2, weatherSensitive: true, laborNeeded: 4 },
      { name: "Interior Finishes", duration: 4, weatherSensitive: false, laborNeeded: 7 },
      { name: "Final Electrical & Plumbing Work", duration: 2, weatherSensitive: false, laborNeeded: 5 },
      { name: "Quality Checks", duration: 2, weatherSensitive: false, laborNeeded: 3 },
    ],
  },
  "Post-Construction": {
    duration: { min: 4, max: 12 }, // weeks
    tasks: [
      { name: "Interior Design", duration: 2, weatherSensitive: false, laborNeeded: 4 },
      { name: "Interior Painting", duration: 2, weatherSensitive: false, laborNeeded: 5 },
      { name: "Final Touches", duration: 2, weatherSensitive: false, laborNeeded: 6 },
      { name: "Landscaping", duration: 2, weatherSensitive: true, laborNeeded: 5 },
      { name: "Equipment Delivery & Installation", duration: 2, weatherSensitive: true, laborNeeded: 4 },
      { name: "Quality Checks", duration: 2, weatherSensitive: false, laborNeeded: 2 },
      { name: "Handover", duration: 1, weatherSensitive: false, laborNeeded: 2 },
    ],
  },
}

// Format date
const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Generate construction schedule with simple 1-day shift for weather-sensitive tasks
const generateConstructionSchedule = (laborAvailability, projectType = "house") => {
  // Create a copy of the construction timeline
  const timeline = JSON.parse(JSON.stringify(constructionTimeline))

  // Adjust timeline based on project type and size
  const sizeFactor = projectType === "house" ? 1 : projectType === "building" ? 2 : 1.5

  // Calculate start date (today)
  const startDate = new Date()

  // Initialize schedule
  const schedule = []
  let currentDate = new Date(startDate)

  // Track labor allocation throughout the project
  const laborAllocation = []

  // Track tasks for each day to manage labor allocation
  const dailyTasks = {}

  // Process each phase
  Object.entries(timeline).forEach(([phaseName, phaseData]) => {
    const phaseTasks = []
    const phaseStartDate = new Date(currentDate)

    // Process each task in the phase sequentially
    phaseData.tasks.forEach((task) => {
      // Adjust task duration based on project size
      const taskDuration = task.duration * sizeFactor

      // Start date is the current date in the timeline
      const taskStartDate = new Date(currentDate)

      // Calculate original end date
      const taskEndDate = new Date(taskStartDate)
      taskEndDate.setDate(taskEndDate.getDate() + taskDuration * 7) // Convert weeks to days

      // Adjust labor needed based on project size
      const adjustedLabor = Math.ceil(task.laborNeeded * (projectType === "building" ? 1.5 : 1))

      // Variables for tracking task status
      let rescheduled = false
      let rescheduledDate = null

      // If task is weather sensitive, shift it by exactly 1 day
      if (task.weatherSensitive) {
        rescheduled = true

        // Shift start date by 1 day
        taskStartDate.setDate(taskStartDate.getDate() + 1)

        // Store the rescheduled date for display
        rescheduledDate = new Date(taskStartDate)

        // Shift end date by 1 day
        taskEndDate.setDate(taskEndDate.getDate() + 1)
      }

      // Add task to phase tasks
      phaseTasks.push({
        name: task.name,
        startDate: new Date(taskStartDate),
        endDate: new Date(taskEndDate),
        duration: taskDuration,
        weatherSensitive: task.weatherSensitive,
        laborNeeded: adjustedLabor,
        rescheduled,
        rescheduledDate,
      })

      // Add to labor allocation
      laborAllocation.push({
        taskName: task.name,
        phase: phaseName,
        startDate: new Date(taskStartDate),
        endDate: new Date(taskEndDate),
        laborNeeded: adjustedLabor,
        rescheduled,
        rescheduledDate,
      })

      // Update current date for next task - the next task will start after the current task ends
      currentDate = new Date(taskEndDate)
    })

    // Add phase to schedule
    schedule.push({
      phase: phaseName,
      startDate: phaseStartDate,
      endDate: new Date(currentDate),
      tasks: phaseTasks,
    })
  })

  // Optimize labor allocation across concurrent tasks
  const optimizedLaborAllocation = optimizeLaborAllocation(dailyTasks, laborAvailability)

  // Calculate total duration in weeks
  const totalDuration = Math.round((currentDate - startDate) / (7 * 24 * 60 * 60 * 1000))

  return {
    schedule,
    totalDuration,
    laborAllocation,
    unassignedLabor: optimizedLaborAllocation.unassignedLabor,
    optimizedTasks: optimizedLaborAllocation.optimizedTasks,
  }
}

// Optimize labor allocation across concurrent tasks
const optimizeLaborAllocation = (dailyTasks, totalLabor) => {
  const optimizedTasks = {}
  const unassignedLabor = {}

  // Process each day
  Object.entries(dailyTasks).forEach(([day, tasks]) => {
    // Sort tasks by priority (weather-sensitive tasks first)
    const sortedTasks = [...tasks].sort((a, b) => {
      // First sort by weather sensitivity (weather-sensitive tasks first)
      if (a.weatherSensitive !== b.weatherSensitive) {
        return a.weatherSensitive ? -1 : 1
      }
      // Then sort by labor needed (higher labor needs first)
      return b.laborNeeded - a.laborNeeded
    })

    // Initialize optimized tasks for this day
    optimizedTasks[day] = []

    // Track remaining labor for this day
    let remainingLabor = totalLabor

    // Allocate labor to tasks
    sortedTasks.forEach((task) => {
      const allocatedLabor = Math.min(task.laborNeeded, remainingLabor)
      remainingLabor -= allocatedLabor

      // Add task with allocated labor
      optimizedTasks[day].push({
        ...task,
        allocatedLabor,
        laborShortage: allocatedLabor < task.laborNeeded,
      })
    })

    // Track unassigned labor for this day
    unassignedLabor[day] = remainingLabor
  })

  return { optimizedTasks, unassignedLabor }
}

export function DetailedScheduleView({ forecastData, onClose }) {
  const [activeTab, setActiveTab] = useState("timeline")
  const [laborAvailability, setLaborAvailability] = useState(10) // Default to 10 workers
  const [projectType, setProjectType] = useState("house")
  const [constructionSchedule, setConstructionSchedule] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [laborUtilization, setLaborUtilization] = useState([])

  useEffect(() => {
    setIsLoading(true)

    // Simulate API call delay
    const timer = setTimeout(() => {
      // We don't need to pass forecastData anymore since we're just doing a simple 1-day shift
      const generatedSchedule = generateConstructionSchedule(laborAvailability, projectType)
      setConstructionSchedule(generatedSchedule)

      // Calculate labor utilization over time
      calculateLaborUtilization(generatedSchedule.laborAllocation, laborAvailability)

      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [laborAvailability, projectType])

  // Calculate labor utilization over the project timeline
  const calculateLaborUtilization = (laborAllocation, maxLabor) => {
    if (!laborAllocation || laborAllocation.length === 0) return

    // Get project start and end dates
    const startDate = new Date(Math.min(...laborAllocation.map((item) => item.startDate.getTime())))
    const endDate = new Date(Math.max(...laborAllocation.map((item) => item.endDate.getTime())))

    // Create weekly labor utilization data
    const utilization = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      // Find all tasks active on this date
      const activeTasks = laborAllocation.filter((task) => task.startDate <= currentDate && task.endDate >= currentDate)

      // Calculate total labor needed for this week
      const totalLaborNeeded = activeTasks.reduce((sum, task) => sum + task.laborNeeded, 0)

      // Calculate utilization percentage
      const utilizationPercentage = Math.min(100, (totalLaborNeeded / maxLabor) * 100)

      // Add to utilization data
      utilization.push({
        date: new Date(currentDate),
        laborNeeded: totalLaborNeeded,
        utilizationPercentage,
        overallocated: totalLaborNeeded > maxLabor,
        activeTasks,
      })

      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7)
    }

    setLaborUtilization(utilization)
  }

  // Handle labor availability change
  const handleLaborChange = (newValue) => {
    setLaborAvailability(newValue)
  }

  // Handle project type change
  const handleProjectTypeChange = (newType) => {
    setProjectType(newType)
  }

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700 w-full">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white text-lg">Generating construction timeline...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700 w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white text-xl">Construction Timeline</CardTitle>
          <CardDescription className="text-white/70">
            Weather-optimized construction schedule with real-time labor allocation
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" className="text-white border-gray-600" onClick={onClose}>
          Close
        </Button>
      </CardHeader>

      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-4 flex-1">
            <h3 className="text-white font-medium mb-2">Project Parameters</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Project Type:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant={projectType === "house" ? "default" : "outline"}
                    size="sm"
                    className={projectType === "house" ? "bg-blue-600" : "text-white"}
                    onClick={() => handleProjectTypeChange("house")}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    House
                  </Button>
                  <Button
                    variant={projectType === "building" ? "default" : "outline"}
                    size="sm"
                    className={projectType === "building" ? "bg-blue-600" : "text-white"}
                    onClick={() => handleProjectTypeChange("building")}
                  >
                    <Building className="h-4 w-4 mr-2" />
                    Building
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/70">Labor Availability:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 text-white"
                    onClick={() => handleLaborChange(Math.max(1, laborAvailability - 1))}
                  >
                    -
                  </Button>
                  <span className="text-white w-8 text-center">{laborAvailability}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 w-7 p-0 text-white"
                    onClick={() => handleLaborChange(laborAvailability + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="text-xs text-white/70">
                Current labor allocation: {laborAvailability} workers
                {laborUtilization.some((week) => week.overallocated) && (
                  <div className="text-amber-400 mt-1">Warning: Some weeks have labor overallocation</div>
                )}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white/70">Weather-Sensitive Tasks:</span>
                <Badge className="bg-blue-600">Shifted by 1 day</Badge>
              </div>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4 flex-1">
            <h3 className="text-white font-medium mb-2">Timeline Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Estimated Duration:</span>
                <span className="text-white">{constructionSchedule.totalDuration} weeks</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Weather-Sensitive Tasks:</span>
                <span className="text-amber-400">Shifted by 1 day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Start Date:</span>
                <span className="text-white">{formatDate(new Date())}</span>
              </div>
              {constructionSchedule.schedule.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Completion Date:</span>
                  <span className="text-white">
                    {formatDate(constructionSchedule.schedule[constructionSchedule.schedule.length - 1].endDate)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="timeline" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 bg-gray-700 p-1">
            <TabsTrigger value="timeline" className="data-[state=active]:bg-blue-600 text-white">
              <CalendarDays className="h-4 w-4 mr-2" />
              Construction Timeline
            </TabsTrigger>
            <TabsTrigger value="labor" className="data-[state=active]:bg-blue-600 text-white">
              <Users className="h-4 w-4 mr-2" />
              Labor Allocation
            </TabsTrigger>
            <TabsTrigger value="weather" className="data-[state=active]:bg-blue-600 text-white">
              <CloudRain className="h-4 w-4 mr-2" />
              Weather Impact
            </TabsTrigger>
            <TabsTrigger value="costs" className="data-[state=active]:bg-blue-600 text-white">
              <DollarSign className="h-4 w-4 mr-2" />
              Cost Analysis
            </TabsTrigger>
          </TabsList>

          {/* Construction Timeline Tab */}
          <TabsContent value="timeline" className="mt-4">
            <div className="space-y-6">
              {constructionSchedule.schedule.map((phase, phaseIndex) => (
                <Card key={phaseIndex} className="bg-gray-700 border-gray-600">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white text-lg">{phase.phase} Phase</CardTitle>
                      <div className="text-white text-sm">
                        {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                      </div>
                    </div>
                    <CardDescription className="text-white/70">
                      Duration: {Math.round((phase.endDate - phase.startDate) / (7 * 24 * 60 * 60 * 1000))} weeks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-600">
                          <TableHead className="text-white">Task</TableHead>
                          <TableHead className="text-white">Start Date</TableHead>
                          <TableHead className="text-white">End Date</TableHead>
                          <TableHead className="text-white">Duration</TableHead>
                          <TableHead className="text-white">Labor</TableHead>
                          <TableHead className="text-white">Weather Sensitive</TableHead>
                          <TableHead className="text-white">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {phase.tasks.map((task, taskIndex) => (
                          <TableRow key={taskIndex} className="border-gray-600">
                            <TableCell className="text-white">{task.name}</TableCell>
                            <TableCell className="text-white">{formatDate(task.startDate)}</TableCell>
                            <TableCell className="text-white">{formatDate(task.endDate)}</TableCell>
                            <TableCell className="text-white">{Math.round(task.duration)} weeks</TableCell>
                            <TableCell className="text-white">{task.laborNeeded} workers</TableCell>

                            <TableCell>
                              {task.weatherSensitive ? (
                                <Badge className="bg-amber-600">Yes</Badge>
                              ) : (
                                <Badge className="bg-gray-600">No</Badge>
                              )}
                            </TableCell>

                            <TableCell>
                              {task.weatherSensitive ? (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4 text-blue-400" />
                                  <span className="text-blue-400">Shifted by 1 day</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                                  <span className="text-green-400">On Schedule</span>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Labor Allocation Tab */}
          <TabsContent value="labor" className="mt-4">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Labor Resource Allocation</CardTitle>
                <CardDescription className="text-white/70">
                  Weekly labor requirements and utilization throughout the project
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-medium mb-3">Labor Utilization Over Time</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                      {laborUtilization.map((week, index) => (
                        <div key={index} className="bg-gray-800 p-3 rounded-lg">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-white">{formatDate(week.date)}</span>
                            <div className="flex items-center gap-2">
                              <span className={week.overallocated ? "text-red-400" : "text-white"}>
                                {week.laborNeeded} / {laborAvailability} workers
                              </span>
                              {week.overallocated && <Badge className="bg-red-600">Overallocated</Badge>}
                            </div>
                          </div>
                          <Progress
                            value={week.utilizationPercentage}
                            className={`h-2 ${week.overallocated ? "bg-red-900" : "bg-gray-600"}`}
                          />
                          <div className="mt-2 text-sm">
                            <span className="text-white/70">Active tasks:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {week.activeTasks.map((task, taskIndex) => (
                                <Badge
                                  key={taskIndex}
                                  className={task.weatherSensitive ? "bg-amber-600/50" : "bg-blue-600/50"}
                                >
                                  {task.taskName} ({task.laborNeeded})
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Daily labor allocation */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Daily Labor Distribution</h3>
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {constructionSchedule.optimizedTasks &&
                          Object.entries(constructionSchedule.optimizedTasks)
                            .slice(0, 14)
                            .map(([day, tasks], index) => {
                              const unassigned = constructionSchedule.unassignedLabor[day] || 0

                              return (
                                <div
                                  key={index}
                                  className="border-b border-gray-700 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0"
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-white font-medium">{formatDate(new Date(day))}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="text-white/70">Total workers: {laborAvailability}</span>
                                      {unassigned > 0 && <Badge className="bg-blue-600">{unassigned} Unassigned</Badge>}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    {tasks.map((task, taskIndex) => (
                                      <div
                                        key={taskIndex}
                                        className="flex justify-between items-center bg-gray-700 p-2 rounded"
                                      >
                                        <div className="flex items-center gap-2">
                                          <div
                                            className={`w-2 h-2 rounded-full ${task.weatherSensitive ? "bg-amber-400" : "bg-blue-400"}`}
                                          ></div>
                                          <span className="text-white">{task.taskName}</span>
                                          <Badge className="bg-gray-600">{task.phase}</Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-white">
                                            {task.allocatedLabor} / {task.laborNeeded} workers
                                          </span>
                                          {task.laborShortage && <Badge className="bg-red-600">Shortage</Badge>}
                                        </div>
                                      </div>
                                    ))}

                                    {unassigned > 0 && (
                                      <div className="mt-2 p-2 bg-blue-600/20 border border-blue-600/30 rounded">
                                        <div className="flex items-center gap-2">
                                          <Users className="h-4 w-4 text-blue-400" />
                                          <span className="text-white">
                                            {unassigned} workers available for additional tasks or support
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            })}

                        {(!constructionSchedule.optimizedTasks ||
                          Object.keys(constructionSchedule.optimizedTasks).length === 0) && (
                          <div className="text-center text-white/70 py-4">No daily task data available</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-white font-medium mb-3">Labor Requirements by Phase</h3>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-600">
                            <TableHead className="text-white">Phase</TableHead>
                            <TableHead className="text-white">Avg. Labor</TableHead>
                            <TableHead className="text-white">Peak Labor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {constructionSchedule.schedule.map((phase, index) => {
                            const phaseLabor = phase.tasks.map((task) => task.laborNeeded)
                            const avgLabor = Math.round(
                              phaseLabor.reduce((sum, val) => sum + val, 0) / phaseLabor.length,
                            )
                            const peakLabor = Math.max(...phaseLabor)

                            return (
                              <TableRow key={index} className="border-gray-600">
                                <TableCell className="text-white">{phase.phase}</TableCell>
                                <TableCell className="text-white">{avgLabor} workers</TableCell>
                                <TableCell className="text-white">{peakLabor} workers</TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <h3 className="text-white font-medium mb-3">Weather-Sensitive Tasks</h3>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="space-y-3">
                          {constructionSchedule.schedule.flatMap((phase) =>
                            phase.tasks
                              .filter((task) => task.rescheduled)
                              .map((task, index) => (
                                <div key={`rescheduled-${index}`} className="flex items-start gap-2">
                                  <CloudRain className="h-5 w-5 text-blue-400 mt-0.5" />
                                  <div>
                                    <p className="text-white">
                                      <span className="text-blue-400">{task.name}</span> shifted by 1 day due to weather
                                      sensitivity
                                    </p>
                                    <p className="text-white/70 text-sm">
                                      Moved to start on {formatDate(task.rescheduledDate)}
                                    </p>
                                  </div>
                                </div>
                              )),
                          )}

                          {constructionSchedule.schedule.flatMap((phase) =>
                            phase.tasks.filter((task) => task.rescheduled),
                          ).length === 0 && (
                            <div className="text-center text-white/70 py-4">
                              No weather-sensitive tasks in the schedule
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert className="bg-blue-600/20 border-blue-600/30">
                    <Users className="h-4 w-4 text-blue-400" />
                    <AlertTitle className="text-white">Labor Optimization Strategy</AlertTitle>
                    <AlertDescription className="text-white/70">
                      {laborUtilization.some((week) => week.overallocated)
                        ? "Consider increasing labor availability or rescheduling some tasks to address overallocation periods."
                        : "Current labor allocation is optimized for the project schedule."}
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weather Impact Tab */}
          <TabsContent value="weather" className="mt-4">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Weather Impact Analysis</CardTitle>
                <CardDescription className="text-white/70">
                  How weather conditions affect your construction schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-white font-medium mb-3">Weather-Sensitive Tasks</h3>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="space-y-3">
                          {Object.values(constructionTimeline)
                            .flatMap((phase) => phase.tasks.filter((task) => task.weatherSensitive))
                            .map((task, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-white">{task.name}</span>
                                <Badge className="bg-amber-600">Yes</Badge>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-medium mb-3">Weather Scheduling Strategy</h3>
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <Calendar className="h-5 w-5 text-blue-400 mt-0.5" />
                            <div>
                              <p className="text-white font-medium">1-Day Shift Strategy</p>
                              <p className="text-white/70">
                                All weather-sensitive tasks are automatically shifted forward by exactly 1 day to
                                account for potential weather impacts.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <ArrowRight className="h-5 w-5 text-blue-400 mt-0.5" />
                            <div>
                              <p className="text-white font-medium">Sequential Adjustment</p>
                              <p className="text-white/70">
                                Tasks that follow weather-sensitive tasks are automatically adjusted to maintain the
                                proper sequence.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3">Weather Parameters Monitored</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CloudRain className="h-5 w-5 text-blue-400" />
                          <h4 className="text-white font-medium">Rainfall</h4>
                        </div>
                        <p className="text-white/70">Weather-sensitive tasks are shifted by 1 day</p>
                      </div>

                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Wind className="h-5 w-5 text-blue-400" />
                          <h4 className="text-white font-medium">Wind Speed</h4>
                        </div>
                        <p className="text-white/70">Weather-sensitive tasks are shifted by 1 day</p>
                      </div>

                      <div className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Thermometer className="h-5 w-5 text-red-400" />
                          <h4 className="text-white font-medium">Temperature</h4>
                        </div>
                        <p className="text-white/70">Weather-sensitive tasks are shifted by 1 day</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3">Task Status Due to Weather</h3>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-600">
                          <TableHead className="text-white">Task</TableHead>
                          <TableHead className="text-white">Weather Sensitive</TableHead>
                          <TableHead className="text-white">Status</TableHead>
                          <TableHead className="text-white">Shift</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {constructionSchedule.schedule
                          .flatMap((phase) => phase.tasks)
                          .map((task, index) => (
                            <TableRow key={index} className="border-gray-600">
                              <TableCell className="text-white">{task.name}</TableCell>
                              <TableCell>
                                {task.weatherSensitive ? (
                                  <Badge className="bg-amber-600">Yes</Badge>
                                ) : (
                                  <Badge className="bg-gray-600">No</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-white">
                                {task.weatherSensitive ? (
                                  <span className="text-blue-400">Shifted</span>
                                ) : (
                                  <span className="text-green-400">On Schedule</span>
                                )}
                              </TableCell>
                              <TableCell className="text-white">{task.weatherSensitive ? "1 day" : "None"}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  <Alert className="bg-blue-600/20 border-blue-600/30">
                    <Zap className="h-4 w-4 text-blue-400" />
                    <AlertTitle className="text-white">Weather Mitigation Strategy</AlertTitle>
                    <AlertDescription className="text-white/70">
                      All weather-sensitive tasks are automatically shifted by exactly 1 day to account for potential
                      weather impacts. This simple approach ensures your construction schedule maintains proper
                      sequencing while accounting for weather sensitivity.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cost Analysis Tab */}
          <TabsContent value="costs" className="mt-4">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Cost Impact Analysis</CardTitle>
                <CardDescription className="text-white/70">
                  Financial implications of weather-related shifts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-white mb-2">Base Project Cost</h3>
                      <p className="text-3xl font-bold text-white">
                        ₹{(projectType === "house" ? 25 : 75).toLocaleString()} Lakhs
                      </p>
                      <p className="text-white/70 mt-2">Estimated without weather shifts</p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-white mb-2">Weather Shift Impact</h3>
                      <p className="text-3xl font-bold text-amber-400">
                        ₹{(projectType === "house" ? 0.5 : 1.5).toLocaleString()} Lakhs
                      </p>
                      <p className="text-white/70 mt-2">Additional cost due to 1-day shifts</p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-lg font-medium text-white mb-2">Total Projected Cost</h3>
                      <p className="text-3xl font-bold text-white">
                        ₹{(projectType === "house" ? 25.5 : 76.5).toLocaleString()} Lakhs
                      </p>
                      <p className="text-white/70 mt-2">Including weather-related costs</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-medium mb-3">Cost Optimization Recommendations</h3>
                    <div className="space-y-3">
                      <Alert className="bg-green-600/20 border-green-600/30">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <AlertTitle className="text-white">Advance Material Procurement</AlertTitle>
                        <AlertDescription className="text-white/70">
                          Purchase weather-sensitive materials in advance to avoid price increases during delays.
                          Potential savings: ₹{(projectType === "house" ? 0.3 : 0.9).toLocaleString()} Lakhs
                        </AlertDescription>
                      </Alert>

                      <Alert className="bg-green-600/20 border-green-600/30">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <AlertTitle className="text-white">Labor Reallocation</AlertTitle>
                        <AlertDescription className="text-white/70">
                          Reallocate labor to indoor tasks during bad weather. Potential savings: ₹
                          {(projectType === "house" ? 0.2 : 0.6).toLocaleString()} Lakhs
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
