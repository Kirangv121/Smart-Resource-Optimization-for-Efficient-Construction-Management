"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, CloudRain, RefreshCw, AlertCircle } from "lucide-react"
import { LoadingIndicator } from "./loading-indicator"

// Sample construction schedule matching the example in the screenshot
const initialConstructionSchedule = [
  {
    id: 1,
    task: "Site Preparation",
    originalStartDate: new Date("2025-09-25"),
    originalEndDate: new Date("2025-10-23"),
    duration: "4 weeks",
    workers: 6,
    weatherSensitive: true,
    status: "Scheduled",
    currentStartDate: new Date("2025-09-25"),
    currentEndDate: new Date("2025-10-23"),
    rescheduleCount: 0,
  },
  {
    id: 2,
    task: "Foundation",
    originalStartDate: new Date("2025-10-24"),
    originalEndDate: new Date("2025-11-21"),
    duration: "4 weeks",
    workers: 8,
    weatherSensitive: true,
    status: "Scheduled",
    currentStartDate: new Date("2025-10-24"),
    currentEndDate: new Date("2025-11-21"),
    rescheduleCount: 0,
  },
  {
    id: 3,
    task: "Concrete Pouring",
    originalStartDate: new Date("2025-11-22"),
    originalEndDate: new Date("2025-12-13"),
    duration: "3 weeks",
    workers: 7,
    weatherSensitive: true,
    status: "Scheduled",
    currentStartDate: new Date("2025-11-22"),
    currentEndDate: new Date("2025-12-13"),
    rescheduleCount: 0,
  },
  {
    id: 4,
    task: "Framing",
    originalStartDate: new Date("2025-12-14"),
    originalEndDate: new Date("2026-01-11"),
    duration: "4 weeks",
    workers: 8,
    weatherSensitive: true,
    status: "Scheduled",
    currentStartDate: new Date("2025-12-14"),
    currentEndDate: new Date("2026-01-11"),
    rescheduleCount: 0,
  },
  {
    id: 5,
    task: "Roofing",
    originalStartDate: new Date("2026-01-12"),
    originalEndDate: new Date("2026-02-09"),
    duration: "4 weeks",
    workers: 6,
    weatherSensitive: true,
    status: "Scheduled",
    currentStartDate: new Date("2026-01-12"),
    currentEndDate: new Date("2026-02-09"),
    rescheduleCount: 0,
  },
  {
    id: 6,
    task: "Lintel Installation",
    originalStartDate: new Date("2026-02-10"),
    originalEndDate: new Date("2026-02-24"),
    duration: "2 weeks",
    workers: 5,
    weatherSensitive: true,
    status: "Scheduled",
    currentStartDate: new Date("2026-02-10"),
    currentEndDate: new Date("2026-02-24"),
    rescheduleCount: 0,
  },
  {
    id: 7,
    task: "Electrical Wiring",
    originalStartDate: new Date("2026-02-25"),
    originalEndDate: new Date("2026-03-25"),
    duration: "4 weeks",
    workers: 4,
    weatherSensitive: false,
    status: "Scheduled",
    currentStartDate: new Date("2026-02-25"),
    currentEndDate: new Date("2026-03-25"),
    rescheduleCount: 0,
  },
  {
    id: 8,
    task: "Plumbing",
    originalStartDate: new Date("2026-03-26"),
    originalEndDate: new Date("2026-04-23"),
    duration: "4 weeks",
    workers: 4,
    weatherSensitive: false,
    status: "Scheduled",
    currentStartDate: new Date("2026-03-26"),
    currentEndDate: new Date("2026-04-23"),
    rescheduleCount: 0,
  },
]

// Format date properly
const formatDate = (date) => {
  const options = { year: "numeric", month: "short", day: "numeric" }
  return date.toLocaleDateString("en-US", options)
}

export function AutomaticScheduleAdjuster() {
  const [constructionSchedule, setConstructionSchedule] = useState(initialConstructionSchedule)
  const [isLoading, setIsLoading] = useState(false)
  const [phaseName, setPhaseName] = useState("Construction Phase")
  const [phaseStartDate, setPhaseStartDate] = useState(new Date("2025-09-24"))
  const [phaseEndDate, setPhaseEndDate] = useState(new Date("2026-12-21"))
  const [hasAdjusted, setHasAdjusted] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  // Function to calculate the new phase end date based on the last task
  const calculatePhaseEndDate = (tasks) => {
    if (!tasks || tasks.length === 0) return phaseEndDate
    const lastTask = tasks.reduce((latest, task) => {
      const taskEndDate = task.currentEndDate || task.originalEndDate
      return taskEndDate > (latest.currentEndDate || latest.originalEndDate) ? task : latest
    }, tasks[0])

    return lastTask.currentEndDate || lastTask.originalEndDate
  }

  // Automatically adjust weather-sensitive tasks
  const adjustWeatherSensitiveTasks = () => {
    setIsLoading(true)
    setShowAlert(false)

    setTimeout(() => {
      // First pass: Shift all weather-sensitive tasks by one day
      const updatedSchedule = constructionSchedule.map((task) => {
        if (task.weatherSensitive) {
          // Add one day to start and end dates
          const newStartDate = new Date(task.originalStartDate)
          newStartDate.setDate(newStartDate.getDate() + 1)

          const newEndDate = new Date(task.originalEndDate)
          newEndDate.setDate(newEndDate.getDate() + 1)

          return {
            ...task,
            currentStartDate: newStartDate,
            currentEndDate: newEndDate,
            rescheduleCount: 1,
            status: "Shifted by 1 day",
          }
        }
        return {
          ...task,
          currentStartDate: task.originalStartDate,
          currentEndDate: task.originalEndDate,
        }
      })

      // Second pass: Ensure subsequent tasks start after their prerequisites finish
      // (assumes tasks are listed in order of dependency)
      for (let i = 1; i < updatedSchedule.length; i++) {
        const prevTask = updatedSchedule[i - 1]
        const currentTask = updatedSchedule[i]

        // If current task starts before previous task ends, adjust it
        if (currentTask.currentStartDate < prevTask.currentEndDate) {
          // Calculate the time difference to maintain task duration
          const taskDuration = currentTask.originalEndDate - currentTask.originalStartDate

          // Start task right after the previous one ends
          const newStartDate = new Date(prevTask.currentEndDate)
          const newEndDate = new Date(newStartDate.getTime() + taskDuration)

          updatedSchedule[i] = {
            ...currentTask,
            currentStartDate: newStartDate,
            currentEndDate: newEndDate,
            status: currentTask.weatherSensitive ? "Shifted by 1 day" : "Adjusted",
          }
        }
      }

      // Update phase end date based on the last task
      const newPhaseEndDate = calculatePhaseEndDate(updatedSchedule)
      setPhaseEndDate(newPhaseEndDate)

      setConstructionSchedule(updatedSchedule)
      setHasAdjusted(true)
      setShowAlert(true)
      setIsLoading(false)
    }, 1200)
  }

  // Reset schedule to original
  const resetSchedule = () => {
    setIsLoading(true)
    setShowAlert(false)

    setTimeout(() => {
      setConstructionSchedule(initialConstructionSchedule)
      setPhaseEndDate(new Date("2026-12-21"))
      setHasAdjusted(false)
      setIsLoading(false)
    }, 800)
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-white">{phaseName}</CardTitle>
          <div className="text-white/70 text-sm mt-1">
            {formatDate(phaseStartDate)} - {formatDate(phaseEndDate)}
          </div>
          <div className="text-white/70 text-sm">
            Duration: {Math.ceil((phaseEndDate - phaseStartDate) / (7 * 24 * 60 * 60 * 1000))} weeks
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={adjustWeatherSensitiveTasks}
            disabled={isLoading || hasAdjusted}
          >
            <CloudRain className="h-4 w-4 mr-2" />
            Apply Weather Adjustments
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
            onClick={resetSchedule}
            disabled={isLoading || !hasAdjusted}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset Schedule
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {showAlert && (
          <div className="bg-blue-900/30 border border-blue-500 p-4 rounded-lg mb-4 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <div className="font-medium text-white">Schedule Automatically Adjusted</div>
              <p className="text-white/80">
                All weather-sensitive tasks have been shifted by 1 day, and dependent tasks have been adjusted to
                maintain the correct sequence. The project end date has been updated accordingly.
              </p>
            </div>
          </div>
        )}

        {isLoading ? (
          <LoadingIndicator message="Adjusting construction schedule..." />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-700">
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
              {constructionSchedule.map((task) => (
                <TableRow key={task.id} className="border-b border-gray-700">
                  <TableCell className="text-white">{task.task}</TableCell>
                  <TableCell className="text-white">{formatDate(task.currentStartDate)}</TableCell>
                  <TableCell className="text-white">{formatDate(task.currentEndDate)}</TableCell>
                  <TableCell className="text-white">{task.duration}</TableCell>
                  <TableCell className="text-white">{task.workers} workers</TableCell>
                  <TableCell>
                    <Badge className={task.weatherSensitive ? "bg-amber-600" : "bg-gray-600"}>
                      {task.weatherSensitive ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.status === "Shifted by 1 day" ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <span className="text-blue-400">{task.status}</span>
                      </div>
                    ) : task.status === "Adjusted" ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-amber-400" />
                        <span className="text-amber-400">{task.status}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-green-400" />
                        <span className="text-green-400">On Schedule</span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
