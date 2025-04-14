"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  CloudRain,
  Zap,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Thermometer,
  Sun,
  AlertTriangle,
  Building,
  Home,
  Warehouse,
  School,
  ShoppingBag,
  Cloud,
} from "lucide-react"
import { LaborForecastVisualization } from "./labor-forecast-visualization"
import { LaborOptimizationSuggestions } from "./labor-optimization-suggestions"
import { LoadingIndicator } from "./loading-indicator"

// Format number to Indian currency
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

// Location factors (for cost adjustments)
const LOCATION_FACTORS = {
  Mumbai: 1.3,
  Delhi: 1.2,
  Bangalore: 1.25,
  Chennai: 1.15,
  Kolkata: 1.1,
  Hyderabad: 1.2,
  Pune: 1.15,
  Ahmedabad: 1.05,
  Jaipur: 1,
  Lucknow: 0.95,
  Mangalore: 1.18,
}

// Worker types and their base daily wages
const WORKER_TYPES = {
  mason: { title: "Mason", baseWage: 800, skill: "Skilled" },
  helper: { title: "Helper", baseWage: 500, skill: "Unskilled" },
  carpenter: { title: "Carpenter", baseWage: 900, skill: "Skilled" },
  electrician: { title: "Electrician", baseWage: 1000, skill: "Skilled" },
  plumber: { title: "Plumber", baseWage: 950, skill: "Skilled" },
  painter: { title: "Painter", baseWage: 800, skill: "Skilled" },
  welder: { title: "Welder", baseWage: 1100, skill: "Skilled" },
  operator: { title: "Equipment Operator", baseWage: 1200, skill: "Skilled" },
  supervisor: { title: "Supervisor", baseWage: 1500, skill: "Management" },
  laborer: { title: "General Laborer", baseWage: 450, skill: "Unskilled" },
}

// Project types and their labor requirements
const PROJECT_TYPES = {
  house: {
    icon: Home,
    variants: {
      "1BHK": {
        duration: 16, // weeks
        baseArea: 600, // sq ft
        labor: {
          mason: 4,
          helper: 8,
          carpenter: 2,
          electrician: 1,
          plumber: 1,
          painter: 2,
          laborer: 4,
          supervisor: 1,
        },
        // Labor allocation by phase (percentages)
        laborAllocation: {
          foundation: { mason: 0.8, helper: 0.7, laborer: 0.8, supervisor: 0.5 },
          framing: {
            mason: 0.6,
            helper: 0.5,
            carpenter: 0.8,
            laborer: 0.6,
            supervisor: 0.7,
          },
          roofing: {
            mason: 0.3,
            helper: 0.4,
            carpenter: 0.5,
            laborer: 0.4,
            supervisor: 0.5,
          },
          electrical: {
            electrician: 0.9,
            helper: 0.3,
            laborer: 0.2,
            supervisor: 0.3,
          },
          plumbing: {
            plumber: 0.9,
            helper: 0.3,
            laborer: 0.2,
            supervisor: 0.3,
          },
          finishes: {
            mason: 0.4,
            painter: 0.9,
            helper: 0.6,
            carpenter: 0.3,
            laborer: 0.5,
            supervisor: 0.6,
          },
        },
      },
      "2BHK": {
        duration: 24, // weeks
        baseArea: 900, // sq ft
        labor: {
          mason: 6,
          helper: 12,
          carpenter: 3,
          electrician: 2,
          plumber: 2,
          painter: 3,
          laborer: 6,
          supervisor: 1,
        },
        laborAllocation: {
          foundation: { mason: 0.8, helper: 0.7, laborer: 0.8, supervisor: 0.5 },
          framing: {
            mason: 0.6,
            helper: 0.5,
            carpenter: 0.8,
            laborer: 0.6,
            supervisor: 0.7,
          },
          roofing: {
            mason: 0.3,
            helper: 0.4,
            carpenter: 0.5,
            laborer: 0.4,
            supervisor: 0.5,
          },
          electrical: {
            electrician: 0.9,
            helper: 0.3,
            laborer: 0.2,
            supervisor: 0.3,
          },
          plumbing: {
            plumber: 0.9,
            helper: 0.3,
            laborer: 0.2,
            supervisor: 0.3,
          },
          finishes: {
            mason: 0.4,
            painter: 0.9,
            helper: 0.6,
            carpenter: 0.3,
            laborer: 0.5,
            supervisor: 0.6,
          },
        },
      },
      "3BHK": {
        duration: 32, // weeks
        baseArea: 1200, // sq ft
        labor: {
          mason: 8,
          helper: 16,
          carpenter: 4,
          electrician: 2,
          plumber: 2,
          painter: 4,
          laborer: 8,
          supervisor: 2,
        },
        laborAllocation: {
          foundation: { mason: 0.8, helper: 0.7, laborer: 0.8, supervisor: 0.5 },
          framing: {
            mason: 0.6,
            helper: 0.5,
            carpenter: 0.8,
            laborer: 0.6,
            supervisor: 0.7,
          },
          roofing: {
            mason: 0.3,
            helper: 0.4,
            carpenter: 0.5,
            laborer: 0.4,
            supervisor: 0.5,
          },
          electrical: {
            electrician: 0.9,
            helper: 0.3,
            laborer: 0.2,
            supervisor: 0.3,
          },
          plumbing: {
            plumber: 0.9,
            helper: 0.3,
            laborer: 0.2,
            supervisor: 0.3,
          },
          finishes: {
            mason: 0.4,
            painter: 0.9,
            helper: 0.6,
            carpenter: 0.3,
            laborer: 0.5,
            supervisor: 0.6,
          },
        },
      },
    },
  },
  building: {
    icon: Building,
    variants: {
      "4-Story": {
        duration: 52, // weeks
        baseArea: 5000, // sq ft
        labor: {
          mason: 20,
          helper: 40,
          carpenter: 10,
          electrician: 5,
          plumber: 5,
          painter: 10,
          welder: 5,
          operator: 3,
          laborer: 15,
          supervisor: 3,
        },
        laborAllocation: {
          foundation: {
            mason: 0.8,
            helper: 0.7,
            operator: 0.9,
            laborer: 0.8,
            supervisor: 0.7,
          },
          structure: {
            mason: 0.7,
            helper: 0.6,
            carpenter: 0.5,
            welder: 0.9,
            operator: 0.8,
            laborer: 0.7,
            supervisor: 0.9,
          },
          roofing: {
            mason: 0.3,
            helper: 0.4,
            carpenter: 0.4,
            laborer: 0.4,
            welder: 0.3,
            supervisor: 0.5,
          },
          electrical: {
            electrician: 0.9,
            helper: 0.4,
            laborer: 0.3,
            supervisor: 0.4,
          },
          plumbing: {
            plumber: 0.9,
            helper: 0.4,
            laborer: 0.3,
            supervisor: 0.4,
          },
          finishes: {
            mason: 0.4,
            painter: 0.9,
            helper: 0.6,
            carpenter: 0.5,
            laborer: 0.6,
            supervisor: 0.7,
          },
        },
      },
      "8-Story": {
        duration: 72, // weeks
        baseArea: 10000, // sq ft
        labor: {
          mason: 30,
          helper: 60,
          carpenter: 15,
          electrician: 8,
          plumber: 8,
          painter: 15,
          welder: 10,
          operator: 5,
          laborer: 25,
          supervisor: 5,
        },
        laborAllocation: {
          foundation: {
            mason: 0.8,
            helper: 0.7,
            operator: 0.9,
            laborer: 0.8,
            supervisor: 0.7,
          },
          structure: {
            mason: 0.7,
            helper: 0.6,
            carpenter: 0.5,
            welder: 0.9,
            operator: 0.8,
            laborer: 0.7,
            supervisor: 0.9,
          },
          roofing: {
            mason: 0.3,
            helper: 0.4,
            carpenter: 0.4,
            laborer: 0.4,
            welder: 0.3,
            supervisor: 0.5,
          },
          electrical: {
            electrician: 0.9,
            helper: 0.4,
            laborer: 0.3,
            supervisor: 0.4,
          },
          plumbing: {
            plumber: 0.9,
            helper: 0.4,
            laborer: 0.3,
            supervisor: 0.4,
          },
          finishes: {
            mason: 0.4,
            painter: 0.9,
            helper: 0.6,
            carpenter: 0.5,
            laborer: 0.6,
            supervisor: 0.7,
          },
        },
      },
    },
  },
  commercial: {
    icon: ShoppingBag,
    variants: {
      Retail: {
        duration: 40, // weeks
        baseArea: 3000, // sq ft
        labor: {
          mason: 12,
          helper: 24,
          carpenter: 8,
          electrician: 5,
          plumber: 4,
          painter: 8,
          welder: 3,
          operator: 2,
          laborer: 10,
          supervisor: 2,
        },
        laborAllocation: {
          foundation: {
            mason: 0.8,
            helper: 0.7,
            operator: 0.9,
            laborer: 0.8,
            supervisor: 0.6,
          },
          structure: {
            mason: 0.7,
            helper: 0.6,
            carpenter: 0.4,
            welder: 0.8,
            operator: 0.7,
            laborer: 0.7,
            supervisor: 0.8,
          },
          roofing: {
            mason: 0.3,
            helper: 0.4,
            carpenter: 0.5,
            laborer: 0.4,
            welder: 0.2,
            supervisor: 0.4,
          },
          electrical: {
            electrician: 0.9,
            helper: 0.4,
            laborer: 0.3,
            supervisor: 0.5,
          },
          plumbing: {
            plumber: 0.9,
            helper: 0.4,
            laborer: 0.3,
            supervisor: 0.4,
          },
          finishes: {
            mason: 0.5,
            painter: 0.9,
            helper: 0.7,
            carpenter: 0.6,
            laborer: 0.6,
            supervisor: 0.7,
          },
        },
      },
      Office: {
        duration: 48, // weeks
        baseArea: 4000, // sq ft
        labor: {
          mason: 15,
          helper: 30,
          carpenter: 10,
          electrician: 8,
          plumber: 5,
          painter: 10,
          welder: 5,
          operator: 3,
          laborer: 12,
          supervisor: 3,
        },
        laborAllocation: {
          foundation: {
            mason: 0.8,
            helper: 0.7,
            operator: 0.9,
            laborer: 0.8,
            supervisor: 0.6,
          },
          structure: {
            mason: 0.7,
            helper: 0.6,
            carpenter: 0.4,
            welder: 0.8,
            operator: 0.7,
            laborer: 0.7,
            supervisor: 0.8,
          },
          roofing: {
            mason: 0.3,
            helper: 0.4,
            carpenter: 0.5,
            laborer: 0.4,
            welder: 0.2,
            supervisor: 0.4,
          },
          electrical: {
            electrician: 0.9,
            helper: 0.4,
            laborer: 0.3,
            supervisor: 0.5,
          },
          plumbing: {
            plumber: 0.9,
            helper: 0.4,
            laborer: 0.3,
            supervisor: 0.4,
          },
          finishes: {
            mason: 0.5,
            painter: 0.9,
            helper: 0.7,
            carpenter: 0.6,
            laborer: 0.6,
            supervisor: 0.7,
          },
        },
      },
    },
  },
  warehouse: {
    icon: Warehouse,
    variants: {
      Storage: {
        duration: 32, // weeks
        baseArea: 8000, // sq ft
        labor: {
          mason: 12,
          helper: 24,
          carpenter: 6,
          electrician: 4,
          plumber: 3,
          painter: 6,
          welder: 8,
          operator: 4,
          laborer: 15,
          supervisor: 2,
        },
        laborAllocation: {
          foundation: {
            mason: 0.8,
            helper: 0.7,
            operator: 0.9,
            laborer: 0.9,
            supervisor: 0.7,
          },
          structure: {
            mason: 0.6,
            helper: 0.5,
            carpenter: 0.3,
            welder: 0.9,
            operator: 0.8,
            laborer: 0.8,
            supervisor: 0.8,
          },
          roofing: {
            mason: 0.2,
            helper: 0.3,
            carpenter: 0.4,
            laborer: 0.5,
            welder: 0.6,
            supervisor: 0.6,
          },
          electrical: {
            electrician: 0.8,
            helper: 0.3,
            laborer: 0.2,
            supervisor: 0.3,
          },
          plumbing: {
            plumber: 0.7,
            helper: 0.2,
            laborer: 0.2,
            supervisor: 0.3,
          },
          finishes: {
            mason: 0.3,
            painter: 0.8,
            helper: 0.5,
            carpenter: 0.4,
            laborer: 0.4,
            supervisor: 0.5,
          },
        },
      },
      "Distribution Center": {
        duration: 40, // weeks
        baseArea: 15000, // sq ft
        labor: {
          mason: 18,
          helper: 36,
          carpenter: 9,
          electrician: 6,
          plumber: 4,
          painter: 8,
          welder: 12,
          operator: 6,
          laborer: 25,
          supervisor: 3,
        },
        laborAllocation: {
          foundation: {
            mason: 0.8,
            helper: 0.7,
            operator: 0.9,
            laborer: 0.9,
            supervisor: 0.7,
          },
          structure: {
            mason: 0.6,
            helper: 0.5,
            carpenter: 0.3,
            welder: 0.9,
            operator: 0.8,
            laborer: 0.8,
            supervisor: 0.8,
          },
          roofing: {
            mason: 0.2,
            helper: 0.3,
            carpenter: 0.4,
            laborer: 0.5,
            welder: 0.6,
            supervisor: 0.6,
          },
          electrical: {
            electrician: 0.8,
            helper: 0.3,
            laborer: 0.2,
            supervisor: 0.3,
          },
          plumbing: {
            plumber: 0.7,
            helper: 0.2,
            laborer: 0.2,
            supervisor: 0.3,
          },
          finishes: {
            mason: 0.3,
            painter: 0.8,
            helper: 0.5,
            carpenter: 0.4,
            laborer: 0.4,
            supervisor: 0.5,
          },
        },
      },
    },
  },
  school: {
    icon: School,
    variants: {
      "Primary School": {
        duration: 48, // weeks
        baseArea: 6000, // sq ft
        labor: {
          mason: 15,
          helper: 30,
          carpenter: 8,
          electrician: 6,
          plumber: 5,
          painter: 10,
          welder: 4,
          operator: 3,
          laborer: 15,
          supervisor: 3,
        },
        laborAllocation: {
          foundation: {
            mason: 0.8,
            helper: 0.7,
            operator: 0.9,
            laborer: 0.8,
            supervisor: 0.7,
          },
          structure: {
            mason: 0.7,
            helper: 0.6,
            carpenter: 0.5,
            welder: 0.8,
            operator: 0.7,
            laborer: 0.7,
            supervisor: 0.9,
          },
          roofing: {
            mason: 0.3,
            helper: 0.4,
            carpenter: 0.5,
            laborer: 0.4,
            welder: 0.3,
            supervisor: 0.5,
          },
          electrical: {
            electrician: 0.9,
            helper: 0.4,
            laborer: 0.3,
            supervisor: 0.5,
          },
          plumbing: {
            plumber: 0.9,
            helper: 0.4,
            laborer: 0.3,
            supervisor: 0.4,
          },
          finishes: {
            mason: 0.4,
            painter: 0.9,
            helper: 0.7,
            carpenter: 0.6,
            laborer: 0.6,
            supervisor: 0.7,
          },
        },
      },
      "High School": {
        duration: 60, // weeks
        baseArea: 10000, // sq ft
        labor: {
          mason: 20,
          helper: 40,
          carpenter: 10,
          electrician: 8,
          plumber: 6,
          painter: 12,
          welder: 6,
          operator: 4,
          laborer: 20,
          supervisor: 4,
        },
        laborAllocation: {
          foundation: {
            mason: 0.8,
            helper: 0.7,
            operator: 0.9,
            laborer: 0.8,
            supervisor: 0.7,
          },
          structure: {
            mason: 0.7,
            helper: 0.6,
            carpenter: 0.5,
            welder: 0.8,
            operator: 0.7,
            laborer: 0.7,
            supervisor: 0.9,
          },
          roofing: {
            mason: 0.3,
            helper: 0.4,
            carpenter: 0.5,
            laborer: 0.4,
            welder: 0.3,
            supervisor: 0.5,
          },
          electrical: {
            electrician: 0.9,
            helper: 0.4,
            laborer: 0.3,
            supervisor: 0.5,
          },
          plumbing: {
            plumber: 0.9,
            helper: 0.4,
            laborer: 0.3,
            supervisor: 0.4,
          },
          finishes: {
            mason: 0.4,
            painter: 0.9,
            helper: 0.7,
            carpenter: 0.6,
            laborer: 0.6,
            supervisor: 0.7,
          },
        },
      },
    },
  },
}

// Define construction phases and their weather sensitivity
const CONSTRUCTION_PHASES = {
  foundation: {
    title: "Foundation",
    durationPercentage: 0.15, // 15% of total project duration
    weatherSensitive: true,
    sensitivity: 0.9, // High sensitivity to weather
    weatherImpact: {
      Rain: { laborChange: 0.4, productivityReduction: 0.6 }, // Rain reduces labor by 40% and productivity by 60%
      Snow: { laborChange: 0.7, productivityReduction: 0.8 },
      Thunderstorm: { laborChange: 0.7, productivityReduction: 0.9 },
      Clear: { laborChange: 0, productivityReduction: 0 },
      Clouds: { laborChange: 0, productivityReduction: 0.1 },
      Extreme_Heat: { laborChange: 0.3, productivityReduction: 0.4 },
      Extreme_Cold: { laborChange: 0.3, productivityReduction: 0.5 },
    },
  },
  structure: {
    title: "Structural Construction",
    durationPercentage: 0.25,
    weatherSensitive: true,
    sensitivity: 0.8,
    weatherImpact: {
      Rain: { laborChange: 0.3, productivityReduction: 0.5 },
      Snow: { laborChange: 0.5, productivityReduction: 0.7 },
      Thunderstorm: { laborChange: 0.6, productivityReduction: 0.8 },
      Clear: { laborChange: 0, productivityReduction: 0 },
      Clouds: { laborChange: 0, productivityReduction: 0.05 },
      Extreme_Heat: { laborChange: 0.2, productivityReduction: 0.3 },
      Extreme_Cold: { laborChange: 0.25, productivityReduction: 0.4 },
    },
  },
  framing: {
    title: "Framing",
    durationPercentage: 0.2,
    weatherSensitive: true,
    sensitivity: 0.7,
    weatherImpact: {
      Rain: { laborChange: 0.25, productivityReduction: 0.45 },
      Snow: { laborChange: 0.45, productivityReduction: 0.65 },
      Thunderstorm: { laborChange: 0.55, productivityReduction: 0.75 },
      Clear: { laborChange: 0, productivityReduction: 0 },
      Clouds: { laborChange: 0, productivityReduction: 0.05 },
      Extreme_Heat: { laborChange: 0.2, productivityReduction: 0.25 },
      Extreme_Cold: { laborChange: 0.25, productivityReduction: 0.35 },
    },
  },
  roofing: {
    title: "Roofing",
    durationPercentage: 0.1,
    weatherSensitive: true,
    sensitivity: 0.9,
    weatherImpact: {
      Rain: { laborChange: 0.5, productivityReduction: 0.8 },
      Snow: { laborChange: 0.7, productivityReduction: 0.9 },
      Thunderstorm: { laborChange: 0.8, productivityReduction: 0.95 },
      Clear: { laborChange: 0, productivityReduction: 0 },
      Clouds: { laborChange: 0, productivityReduction: 0.05 },
      Extreme_Heat: { laborChange: 0.3, productivityReduction: 0.5 },
      Extreme_Cold: { laborChange: 0.4, productivityReduction: 0.6 },
    },
  },
  electrical: {
    title: "Electrical Work",
    durationPercentage: 0.1,
    weatherSensitive: false,
    sensitivity: 0.3,
    weatherImpact: {
      Rain: { laborChange: 0.05, productivityReduction: 0.1 },
      Snow: { laborChange: 0.1, productivityReduction: 0.15 },
      Thunderstorm: { laborChange: 0.2, productivityReduction: 0.3 },
      Clear: { laborChange: 0, productivityReduction: 0 },
      Clouds: { laborChange: 0, productivityReduction: 0 },
      Extreme_Heat: { laborChange: 0.1, productivityReduction: 0.2 },
      Extreme_Cold: { laborChange: 0.15, productivityReduction: 0.25 },
    },
  },
  plumbing: {
    title: "Plumbing Work",
    durationPercentage: 0.1,
    weatherSensitive: false,
    sensitivity: 0.3,
    weatherImpact: {
      Rain: { laborChange: 0.05, productivityReduction: 0.1 },
      Snow: { laborChange: 0.1, productivityReduction: 0.15 },
      Thunderstorm: { laborChange: 0.2, productivityReduction: 0.3 },
      Clear: { laborChange: 0, productivityReduction: 0 },
      Clouds: { laborChange: 0, productivityReduction: 0 },
      Extreme_Heat: { laborChange: 0.1, productivityReduction: 0.2 },
      Extreme_Cold: { laborChange: 0.15, productivityReduction: 0.25 },
    },
  },
  finishes: {
    title: "Finishes & Interior Work",
    durationPercentage: 0.2,
    weatherSensitive: false,
    sensitivity: 0.2,
    weatherImpact: {
      Rain: { laborChange: 0, productivityReduction: 0.05 },
      Snow: { laborChange: 0.05, productivityReduction: 0.1 },
      Thunderstorm: { laborChange: 0.1, productivityReduction: 0.15 },
      Clear: { laborChange: 0, productivityReduction: 0 },
      Clouds: { laborChange: 0, productivityReduction: 0 },
      Extreme_Heat: { laborChange: 0.05, productivityReduction: 0.1 },
      Extreme_Cold: { laborChange: 0.1, productivityReduction: 0.15 },
    },
  },
}

// Mock weather forecast data (for demonstration purposes)
const MOCK_WEATHER_FORECAST = [
  { date: "2025-07-20", condition: "Clear", temp: 30, impact: "Low" },
  { date: "2025-07-21", condition: "Clear", temp: 32, impact: "Low" },
  { date: "2025-07-22", condition: "Clouds", temp: 29, impact: "Low" },
  { date: "2025-07-23", condition: "Rain", temp: 25, impact: "Moderate" },
  { date: "2025-07-24", condition: "Rain", temp: 24, impact: "Moderate" },
  { date: "2025-07-25", condition: "Thunderstorm", temp: 23, impact: "High" },
  { date: "2025-07-26", condition: "Clouds", temp: 27, impact: "Low" },
  { date: "2025-07-27", condition: "Clear", temp: 30, impact: "Low" },
  { date: "2025-07-28", condition: "Clear", temp: 33, impact: "Low" },
  { date: "2025-07-29", condition: "Extreme_Heat", temp: 38, impact: "Moderate" },
  { date: "2025-07-30", condition: "Extreme_Heat", temp: 40, impact: "High" },
  { date: "2025-07-31", condition: "Clouds", temp: 34, impact: "Low" },
  { date: "2025-08-01", condition: "Rain", temp: 28, impact: "Moderate" },
  { date: "2025-08-02", condition: "Clouds", temp: 29, impact: "Low" },
]

export function WeatherAdjustedLaborPlanner() {
  // State variables
  const [projectType, setProjectType] = useState("")
  const [projectVariant, setProjectVariant] = useState("")
  const [projectArea, setProjectArea] = useState("")
  const [location, setLocation] = useState("Mumbai")
  const [projectDuration, setProjectDuration] = useState("") // in weeks
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0])
  const [laborPlan, setLaborPlan] = useState(null)
  const [weatherAdjustedPlan, setWeatherAdjustedPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [weatherForecast, setWeatherForecast] = useState(MOCK_WEATHER_FORECAST)
  const [activeTab, setActiveTab] = useState("labor-plan")
  const [optimizationSuggestions, setOptimizationSuggestions] = useState([])
  const [showAlert, setShowAlert] = useState(false)

  // Helper function to calculate project end date
  const calculateEndDate = (startDateString, durationInWeeks) => {
    const startDate = new Date(startDateString)
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + durationInWeeks * 7)
    return endDate.toISOString().split("T")[0]
  }

  // Generate labor forecast when inputs change
  useEffect(() => {
    if (projectType && projectVariant && projectArea && location) {
      const isValid = validateInputs()
      if (isValid) {
        generateLaborPlan()
      }
    }
  }, [projectType, projectVariant, projectArea, location, startDate])

  // Validate inputs
  const validateInputs = () => {
    const areaNum = Number(projectArea)
    if (isNaN(areaNum) || areaNum <= 0) {
      return false
    }
    return true
  }

  // Generate initial labor plan
  const generateLaborPlan = () => {
    setIsLoading(true)
    setShowAlert(false)

    setTimeout(() => {
      try {
        // Get project base data
        const projectData = PROJECT_TYPES[projectType].variants[projectVariant]
        const areaRatio = Number(projectArea) / projectData.baseArea

        // Calculate adjusted duration based on area
        const calculatedDuration = Math.ceil(projectData.duration * Math.sqrt(areaRatio))
        setProjectDuration(calculatedDuration)

        // Calculate end date
        const endDate = calculateEndDate(startDate, calculatedDuration)

        // Adjust labor requirements based on area
        const adjustedLabor = {}
        const locationFactor = LOCATION_FACTORS[location] || 1

        // Scale labor requirements based on area and location
        Object.keys(projectData.labor).forEach((workerType) => {
          adjustedLabor[workerType] = Math.ceil(projectData.labor[workerType] * Math.sqrt(areaRatio) * locationFactor)
        })

        // Calculate labor costs
        const laborCosts = {}
        let totalLaborCost = 0

        Object.keys(adjustedLabor).forEach((workerType) => {
          const workerCount = adjustedLabor[workerType]
          const dailyRate = WORKER_TYPES[workerType].baseWage * locationFactor
          const totalCost = workerCount * dailyRate * calculatedDuration * 7 // 7 days per week
          laborCosts[workerType] = totalCost
          totalLaborCost += totalCost
        })

        // Generate phase-by-phase plan
        const phases = []
        let currentDate = new Date(startDate)

        Object.keys(CONSTRUCTION_PHASES).forEach((phaseKey) => {
          const phase = CONSTRUCTION_PHASES[phaseKey]
          const phaseDuration = Math.ceil(calculatedDuration * phase.durationPercentage)

          // Calculate phase end date
          const phaseStartDate = new Date(currentDate)
          const phaseEndDate = new Date(currentDate)
          phaseEndDate.setDate(phaseEndDate.getDate() + phaseDuration * 7)

          // Calculate labor allocation for this phase
          const phaseLabor = {}
          const laborAllocation = projectData.laborAllocation[phaseKey] || {}

          Object.keys(laborAllocation).forEach((workerType) => {
            if (adjustedLabor[workerType]) {
              phaseLabor[workerType] = Math.ceil(adjustedLabor[workerType] * laborAllocation[workerType])
            }
          })

          // Add phase to phases array
          phases.push({
            phase: phase.title,
            key: phaseKey,
            startDate: phaseStartDate.toISOString().split("T")[0],
            endDate: phaseEndDate.toISOString().split("T")[0],
            duration: phaseDuration,
            weatherSensitive: phase.weatherSensitive,
            sensitivity: phase.sensitivity,
            labor: phaseLabor,
          })

          // Update current date for next phase
          currentDate = new Date(phaseEndDate)
        })

        // Create initial labor plan
        const plan = {
          projectType,
          projectVariant,
          projectArea: Number(projectArea),
          location,
          startDate,
          endDate: calculateEndDate(startDate, calculatedDuration),
          duration: calculatedDuration,
          labor: adjustedLabor,
          laborCosts,
          totalLaborCost,
          phases,
        }

        setLaborPlan(plan)

        // Generate weather-adjusted plan
        generateWeatherAdjustedPlan(plan)
      } catch (error) {
        console.error("Error generating labor plan:", error)
        setShowAlert(true)
      } finally {
        setIsLoading(false)
      }
    }, 1500)
  }

  // Generate weather-adjusted labor plan
  const generateWeatherAdjustedPlan = (originalPlan) => {
    if (!originalPlan) return

    try {
      // Create a deep copy of the original plan
      const adjustedPlan = JSON.parse(JSON.stringify(originalPlan))
      const adjustedPhases = []

      // Keep track of optimization suggestions
      const suggestions = []

      // Process each phase
      originalPlan.phases.forEach((phase) => {
        const phaseKey = phase.key
        const phaseConfig = CONSTRUCTION_PHASES[phaseKey]

        // Create adjusted phase
        const adjustedPhase = { ...phase }
        const adjustedLabor = { ...phase.labor }
        const laborChanges = {}

        // If phase is weather sensitive, adjust for weather
        if (phase.weatherSensitive) {
          // Get relevant weather forecast for this phase's timeline
          const phaseStartDate = new Date(phase.startDate)
          const phaseEndDate = new Date(phase.endDate)

          const relevantForecast = weatherForecast.filter((day) => {
            const forecastDate = new Date(day.date)
            return forecastDate >= phaseStartDate && forecastDate <= phaseEndDate
          })

          // If we have weather data for this phase
          if (relevantForecast.length > 0) {
            // Track total labor changes due to weather
            let totalLaborChangePercentage = 0
            let badWeatherDays = 0

            relevantForecast.forEach((day) => {
              const weatherCondition = day.condition
              const impact = phaseConfig.weatherImpact[weatherCondition] || { laborChange: 0, productivityReduction: 0 }

              // Sum up labor changes
              totalLaborChangePercentage += impact.laborChange

              // Count bad weather days
              if (impact.laborChange > 0.2 || impact.productivityReduction > 0.3) {
                badWeatherDays++
              }
            })

            // Calculate average labor change percentage
            const avgLaborChangePercentage = totalLaborChangePercentage / relevantForecast.length

            // If significant weather impact, suggest adjustments
            if (avgLaborChangePercentage > 0.1) {
              Object.keys(adjustedLabor).forEach((workerType) => {
                // Calculate adjusted workforce
                const originalCount = adjustedLabor[workerType]
                const additionalWorkers = Math.ceil(originalCount * avgLaborChangePercentage * phase.sensitivity)

                // Track changes for reporting
                if (additionalWorkers > 0) {
                  laborChanges[workerType] = additionalWorkers
                  adjustedLabor[workerType] = originalCount + additionalWorkers
                }
              })

              // Create suggestion if bad weather expected
              if (badWeatherDays > 0) {
                suggestions.push({
                  type: "labor-adjustment",
                  phase: phase.phase,
                  description: `Increase workforce during ${phase.phase} phase due to expected ${badWeatherDays} days of adverse weather.`,
                  impact: "Prevents project delays by compensating for reduced productivity.",
                  changes: laborChanges,
                })
              }
            }
          }
        }

        // Update adjusted phase
        adjustedPhase.labor = adjustedLabor
        adjustedPhase.laborChanges = laborChanges
        adjustedPhases.push(adjustedPhase)

        // Suggest indoor work rescheduling if bad weather
        if (phase.weatherSensitive && Object.keys(laborChanges).length > 0) {
          suggestions.push({
            type: "schedule-adjustment",
            phase: phase.phase,
            description: `Consider rescheduling non-weather-sensitive work during ${phase.phase} phase to coincide with forecasted bad weather days.`,
            impact: "Maintains productivity by shifting focus to indoor tasks during inclement weather.",
          })
        }
      })

      // Calculate total adjusted labor and costs
      const adjustedLabor = {}
      const adjustedLaborCosts = {}
      let adjustedTotalLaborCost = 0

      // Sum up labor across all phases
      adjustedPhases.forEach((phase) => {
        Object.keys(phase.labor).forEach((workerType) => {
          adjustedLabor[workerType] = Math.max(adjustedLabor[workerType] || 0, phase.labor[workerType])
        })
      })

      // Calculate adjusted labor costs
      Object.keys(adjustedLabor).forEach((workerType) => {
        const workerCount = adjustedLabor[workerType]
        const dailyRate = WORKER_TYPES[workerType].baseWage * (LOCATION_FACTORS[location] || 1)
        const totalCost = workerCount * dailyRate * adjustedPlan.duration * 7 // 7 days per week
        adjustedLaborCosts[workerType] = totalCost
        adjustedTotalLaborCost += totalCost
      })

      // Update plan with adjusted values
      adjustedPlan.labor = adjustedLabor
      adjustedPlan.laborCosts = adjustedLaborCosts
      adjustedPlan.totalLaborCost = adjustedTotalLaborCost
      adjustedPlan.phases = adjustedPhases

      // Add labor cross-training suggestion if skilled labor needed
      const skilledWorkerTypes = Object.keys(adjustedLabor).filter(
        (workerType) => WORKER_TYPES[workerType].skill === "Skilled",
      )

      if (skilledWorkerTypes.length > 0) {
        suggestions.push({
          type: "cross-training",
          description: "Implement cross-training program for workers to handle multiple skilled tasks.",
          impact:
            "Increases workforce flexibility during weather disruptions and reduces dependency on specialized workers.",
          workerTypes: skilledWorkerTypes,
        })
      }

      // Add stand-by labor suggestion
      suggestions.push({
        type: "standby-labor",
        description: "Maintain a pool of on-call workers for weather-sensitive phases.",
        impact: "Provides quick workforce scaling during good weather windows to accelerate progress.",
      })

      // Update state
      setWeatherAdjustedPlan(adjustedPlan)
      setOptimizationSuggestions(suggestions)
    } catch (error) {
      console.error("Error generating weather-adjusted plan:", error)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Render weather impact badge
  const renderWeatherImpactBadge = (impact) => {
    let color
    switch (impact) {
      case "High":
        color = "bg-red-600"
        break
      case "Moderate":
        color = "bg-amber-600"
        break
      default:
        color = "bg-green-600"
    }
    return <Badge className={color}>{impact} Impact</Badge>
  }

  // Get weather condition icon
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Rain":
        return <CloudRain className="h-5 w-5 text-blue-400" />
      case "Thunderstorm":
        return <AlertCircle className="h-5 w-5 text-purple-400" />
      case "Extreme_Heat":
        return <Thermometer className="h-5 w-5 text-red-400" />
      case "Extreme_Cold":
        return <Thermometer className="h-5 w-5 text-blue-400" />
      case "Snow":
        return <CloudRain className="h-5 w-5 text-white" />
      case "Clouds":
        return <Cloud className="h-5 w-5 text-gray-400" />
      default:
        return <Sun className="h-5 w-5 text-yellow-400" />
    }
  }

  // Render weather forecast for a specific phase
  const renderPhaseForecast = (phase) => {
    const phaseStartDate = new Date(phase.startDate)
    const phaseEndDate = new Date(phase.endDate)

    const relevantForecast = weatherForecast.filter((day) => {
      const forecastDate = new Date(day.date)
      return forecastDate >= phaseStartDate && forecastDate <= phaseEndDate
    })

    if (relevantForecast.length === 0) {
      return <div className="text-white/70">No forecast data available for this phase</div>
    }

    return (
      <div className="flex flex-wrap gap-2">
        {relevantForecast.slice(0, 5).map((day, index) => (
          <div key={index} className="bg-gray-700 p-2 rounded-lg text-center">
            <div className="text-white/70 text-xs">{formatDate(day.date)}</div>
            <div className="flex justify-center my-1">{getWeatherIcon(day.condition)}</div>
            <div className="text-white text-xs">{day.condition.replace("_", " ")}</div>
            <div className="mt-1">{renderWeatherImpactBadge(day.impact)}</div>
          </div>
        ))}
        {relevantForecast.length > 5 && (
          <div className="flex items-center justify-center text-white/70">+{relevantForecast.length - 5} more days</div>
        )}
      </div>
    )
  }

  // Calculate the difference between original and adjusted plans for a given worker type
  const getLaborDifference = (workerType) => {
    if (!laborPlan || !weatherAdjustedPlan) return 0

    const original = laborPlan.labor[workerType] || 0
    const adjusted = weatherAdjustedPlan.labor[workerType] || 0

    return adjusted - original
  }

  return (
    <div className="space-y-6">
      {/* Input Card */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Project Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Project Type */}
            <div className="space-y-2">
              <Label htmlFor="project-type" className="text-white">
                Project Type
              </Label>
              <Select
                value={projectType}
                onValueChange={(value) => {
                  setProjectType(value)
                  setProjectVariant("")
                }}
              >
                <SelectTrigger id="project-type" className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {Object.keys(PROJECT_TYPES).map(
                    (type) =>
                      (
                        <SelectItem key={type} value={type} className="focus:bg-gray-600 focus:text-white">
                      <div className="flex items-center gap-2">\
                        <PROJECT_TYPES[type].icon className="h-4 w-4" />
                        <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                      </div>
                    </SelectItem>
                      ),
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Project Variant */}
            <div className="space-y-2">
              <Label htmlFor="project-variant" className="text-white">
                Project Subtype
              </Label>
              <Select value={projectVariant} onValueChange={setProjectVariant} disabled={!projectType}>
                <SelectTrigger id="project-variant" className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder={projectType ? "Select subtype" : "Select project type first"} />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  {projectType &&
                    Object.keys(PROJECT_TYPES[projectType].variants).map((variant) => (
                      <SelectItem key={variant} value={variant} className="focus:bg-gray-600 focus:text-white">
                        {variant}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project Area */}
            <div className="space-y-2">
              <Label htmlFor="project-area" className="text-white">
                Project Area (sq ft)
              </Label>
              <Input
                id="project-area"
                type="number"
                placeholder="e.g., 2000"
                value={projectArea}
                onChange={(e) => setProjectArea(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-white">
                Location
              </Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger id="location" className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-white">
                  <SelectItem value="Mumbai" className="focus:bg-gray-600 focus:text-white">
                    Mumbai
                  </SelectItem>
                  <SelectItem value="Delhi" className="focus:bg-gray-600 focus:text-white">
                    Delhi
                  </SelectItem>
                  <SelectItem value="Bangalore" className="focus:bg-gray-600 focus:text-white">
                    Bangalore
                  </SelectItem>
                  <SelectItem value="Chennai" className="focus:bg-gray-600 focus:text-white">
                    Chennai
                  </SelectItem>
                  <SelectItem value="Kolkata" className="focus:bg-gray-600 focus:text-white">
                    Kolkata
                  </SelectItem>
                  <SelectItem value="Hyderabad" className="focus:bg-gray-600 focus:text-white">
                    Hyderabad
                  </SelectItem>
                  <SelectItem value="Pune" className="focus:bg-gray-600 focus:text-white">
                    Pune
                  </SelectItem>
                  <SelectItem value="Ahmedabad" className="focus:bg-gray-600 focus:text-white">
                    Ahmedabad
                  </SelectItem>
                  <SelectItem value="Jaipur" className="focus:bg-gray-600 focus:text-white">
                    Jaipur
                  </SelectItem>
                  <SelectItem value="Lucknow" className="focus:bg-gray-600 focus:text-white">
                    Lucknow
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="start-date" className="text-white">
                Start Date
              </Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Generate Button */}
            <div className="flex items-end">
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                onClick={generateLaborPlan}
                disabled={isLoading || !projectType || !projectVariant || !projectArea || !location}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Labor Plan
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {showAlert && (
        <Alert className="bg-red-900/30 border-red-500 text-white">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error generating the labor plan. Please check your inputs and try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Results Area */}
      {isLoading ? (
        <LoadingIndicator message="Analyzing project and weather data..." />
      ) : laborPlan && weatherAdjustedPlan ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Duration:</span>
                    <span className="text-white font-semibold">{laborPlan.duration} weeks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Start Date:</span>
                    <span className="text-white">{formatDate(laborPlan.startDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">End Date:</span>
                    <span className="text-white">{formatDate(laborPlan.endDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Standard Labor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-white text-2xl font-bold mb-1">
                  {Object.values(laborPlan.labor).reduce((sum, count) => sum + count, 0)} Workers
                </div>
                <div className="text-white/70">₹{formatIndianCurrency(Math.round(laborPlan.totalLaborCost))}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Users className="h-4 w-4 text-blue-400" />
                  <span className="text-white/70 text-sm">Based on standard project requirements</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Weather-Adjusted Labor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-white text-2xl font-bold mb-1">
                  {Object.values(weatherAdjustedPlan.labor).reduce((sum, count) => sum + count, 0)} Workers
                </div>
                <div className="text-white/70">
                  ₹{formatIndianCurrency(Math.round(weatherAdjustedPlan.totalLaborCost))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CloudRain className="h-4 w-4 text-blue-400" />
                  <span className="text-white/70 text-sm">Adjusted based on weather forecast</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-700">
              <TabsTrigger value="labor-plan" className="data-[state=active]:bg-blue-600 text-white">
                <Users className="h-4 w-4 mr-2" />
                Labor Planning
              </TabsTrigger>
              <TabsTrigger value="weather-impact" className="data-[state=active]:bg-blue-600 text-white">
                <CloudRain className="h-4 w-4 mr-2" />
                Weather Impact
              </TabsTrigger>
              <TabsTrigger value="optimization" className="data-[state=active]:bg-blue-600 text-white">
                <TrendingUp className="h-4 w-4 mr-2" />
                Optimization Suggestions
              </TabsTrigger>
            </TabsList>

            {/* Labor Planning Tab */}
            <TabsContent value="labor-plan" className="mt-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Project Labor Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Labor comparison table */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Labor Allocation Overview</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-gray-700">
                            <TableHead className="text-white">Worker Type</TableHead>
                            <TableHead className="text-white">Skill Level</TableHead>
                            <TableHead className="text-white">Standard Count</TableHead>
                            <TableHead className="text-white">Weather-Adjusted</TableHead>
                            <TableHead className="text-white">Difference</TableHead>
                            <TableHead className="text-white">Daily Rate</TableHead>
                            <TableHead className="text-white">Total Cost (Adjusted)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.keys(weatherAdjustedPlan.labor).map((workerType) => (
                            <TableRow key={workerType} className="border-gray-700">
                              <TableCell className="text-white">{WORKER_TYPES[workerType].title}</TableCell>
                              <TableCell className="text-white">{WORKER_TYPES[workerType].skill}</TableCell>
                              <TableCell className="text-white">{laborPlan.labor[workerType] || 0}</TableCell>
                              <TableCell className="text-white">{weatherAdjustedPlan.labor[workerType]}</TableCell>
                              <TableCell>
                                {getLaborDifference(workerType) > 0 ? (
                                  <span className="text-green-400">+{getLaborDifference(workerType)}</span>
                                ) : getLaborDifference(workerType) < 0 ? (
                                  <span className="text-red-400">{getLaborDifference(workerType)}</span>
                                ) : (
                                  <span className="text-white">0</span>
                                )}
                              </TableCell>
                              <TableCell className="text-white">
                                ₹
                                {formatIndianCurrency(
                                  Math.round(WORKER_TYPES[workerType].baseWage * (LOCATION_FACTORS[location] || 1)),
                                )}
                              </TableCell>
                              <TableCell className="text-white">
                                ₹{formatIndianCurrency(Math.round(weatherAdjustedPlan.laborCosts[workerType]))}
                              </TableCell>
                            </TableRow>
                          ))}
                          <TableRow className="border-gray-700 bg-gray-700/50">
                            <TableCell className="text-white font-semibold" colSpan={6}>
                              Total Labor Cost
                            </TableCell>
                            <TableCell className="text-white font-semibold">
                              ₹{formatIndianCurrency(Math.round(weatherAdjustedPlan.totalLaborCost))}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Labor visualization */}
                  <LaborForecastVisualization
                    originalPlan={laborPlan}
                    adjustedPlan={weatherAdjustedPlan}
                    workerTypes={WORKER_TYPES}
                  />

                  {/* Phase breakdown table */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Labor Requirements by Phase</h3>
                    <div className="grid gap-4">
                      {weatherAdjustedPlan.phases.map((phase, index) => (
                        <Card key={index} className="bg-gray-700 border-gray-600">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-white text-lg">{phase.phase}</CardTitle>
                              <Badge className={phase.weatherSensitive ? "bg-amber-600" : "bg-blue-600"}>
                                {phase.weatherSensitive ? "Weather Sensitive" : "Weather Resistant"}
                              </Badge>
                            </div>
                            <div className="text-white/70 text-sm">
                              {formatDate(phase.startDate)} - {formatDate(phase.endDate)} ({phase.duration} weeks)
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {Object.entries(phase.labor).map(([workerType, count], i) => (
                                  <div key={i} className="bg-gray-800 p-3 rounded-lg">
                                    <div className="text-white/70 text-xs">{WORKER_TYPES[workerType].title}</div>
                                    <div className="flex justify-between items-center mt-1">
                                      <span className="text-white text-lg font-semibold">{count}</span>
                                      {phase.laborChanges && phase.laborChanges[workerType] > 0 && (
                                        <Badge className="bg-green-600">+{phase.laborChanges[workerType]}</Badge>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Weather Impact Tab */}
            <TabsContent value="weather-impact" className="mt-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Weather Impact Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Weather forecast summary */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Weather Forecast for Project Timeline</h3>
                    <div className="grid grid-cols-7 gap-2">
                      {weatherForecast.slice(0, 14).map((day, index) => (
                        <div key={index} className="bg-gray-700 p-2 rounded-lg text-center">
                          <div className="text-white/70 text-xs">{formatDate(day.date)}</div>
                          <div className="flex justify-center my-1">{getWeatherIcon(day.condition)}</div>
                          <div className="text-white text-xs">{day.condition.replace("_", " ")}</div>
                          <div className="mt-1">{renderWeatherImpactBadge(day.impact)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Weather impact on phases */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Weather Impact on Construction Phases</h3>
                    <div className="space-y-4">
                      {weatherAdjustedPlan.phases
                        .filter((phase) => phase.weatherSensitive)
                        .map((phase, index) => (
                          <Card key={index} className="bg-gray-700 border-gray-600">
                            <CardHeader className="pb-2">
                              <div className="flex justify-between items-center">
                                <CardTitle className="text-white text-lg">{phase.phase}</CardTitle>
                                <Badge className="bg-amber-600">
                                  Weather Sensitivity: {Math.round(phase.sensitivity * 100)}%
                                </Badge>
                              </div>
                              <div className="text-white/70 text-sm">
                                {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="bg-gray-800 p-3 rounded-lg">
                                  <h4 className="text-white font-medium mb-2">Weather Forecast During Phase</h4>
                                  {renderPhaseForecast(phase)}
                                </div>
                                {Object.keys(phase.laborChanges).length > 0 && (
                                  <div className="bg-blue-900/30 border border-blue-500 p-3 rounded-lg">
                                    <h4 className="text-white font-medium mb-2">Workforce Adjustments</h4>
                                    <div className="space-y-2">
                                      {Object.entries(phase.laborChanges).map(([workerType, change], i) => (
                                        <div key={i} className="flex justify-between items-center">
                                          <span className="text-white">{WORKER_TYPES[workerType].title}:</span>
                                          <span className="text-green-400">+{change} workers</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                      {/* Show non-weather sensitive phases as well */}
                      <Card className="bg-gray-700 border-gray-600">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">Weather-Resistant Phases</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {weatherAdjustedPlan.phases
                              .filter((phase) => !phase.weatherSensitive)
                              .map((phase, index) => (
                                <div key={index} className="bg-gray-800 p-3 rounded-lg">
                                  <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-white font-medium">{phase.phase}</h4>
                                    <Badge className="bg-blue-600">Weather Resistant</Badge>
                                  </div>
                                  <div className="text-white/70 text-sm">
                                    {formatDate(phase.startDate)} - {formatDate(phase.endDate)}
                                  </div>
                                  <div className="text-white/70 text-sm mt-2">
                                    These phases can be accelerated during adverse weather periods
                                  </div>
                                </div>
                              ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Weather impact summary */}
                  <Alert className="bg-blue-600/20 border-blue-600/30">
                    <CloudRain className="h-4 w-4 text-blue-400" />
                    <AlertTitle className="text-white">Weather Impact Summary</AlertTitle>
                    <AlertDescription className="text-white/70">
                      Weather conditions during the project timeline are expected to have a
                      {weatherAdjustedPlan.totalLaborCost > laborPlan.totalLaborCost ? " substantial " : " minimal "}
                      impact on labor requirements. The adjusted plan accounts for
                      {Math.round(
                        ((weatherAdjustedPlan.totalLaborCost - laborPlan.totalLaborCost) / laborPlan.totalLaborCost) *
                          100,
                      )}
                      % additional workforce to maintain the project timeline.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Optimization Suggestions Tab */}
            <TabsContent value="optimization" className="mt-4">
              <LaborOptimizationSuggestions
                suggestions={optimizationSuggestions}
                workerTypes={WORKER_TYPES}
                originalPlan={laborPlan}
                adjustedPlan={weatherAdjustedPlan}
              />
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </div>
  )
}
