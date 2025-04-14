"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Interactive3DPreview({ projectType, subType }) {
  const canvasRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsLoading(true)

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set background
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 1

    const gridSize = 20
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Drawing functions
    const draw = async () => {
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)

      // Draw different building types
      if (projectType === "house") {
        drawHouse(ctx, subType)
      } else if (projectType === "building") {
        drawBuilding(ctx, subType)
      } else if (projectType === "school") {
        drawSchool(ctx)
      } else if (projectType === "commercial") {
        drawCommercial(ctx)
      } else if (projectType === "warehouse") {
        drawWarehouse(ctx)
      } else {
        // Default
        drawHouse(ctx, "3BHK")
      }

      ctx.restore()
      setIsLoading(false)
    }

    draw()
  }, [projectType, subType])

  // Drawing functions
  const drawHouse = (ctx, type) => {
    const size = type === "1BHK" ? 80 : type === "2BHK" ? 100 : 120
    ctx.fillStyle = "white"
    ctx.fillRect(-size, -size / 2, size * 2, size)
  }

  const drawBuilding = (ctx, type) => {
    const floors = type === "4-Story" ? 4 : type === "8-Story" ? 8 : 12
    const width = 120
    const floorHeight = 20
    const height = floors * floorHeight
    ctx.fillStyle = "white"
    ctx.fillRect(-width / 2, -height, width, height)
  }

  const drawSchool = (ctx) => {
    const width = 120
    const height = 100
    ctx.fillStyle = "white"
    ctx.fillRect(-width / 2, -height, width, height)
  }

  const drawCommercial = (ctx) => {
    const width = 120
    const height = 100
    ctx.fillStyle = "white"
    ctx.fillRect(-width / 2, -height, width, height)
  }

  const drawWarehouse = (ctx) => {
    const width = 120
    const height = 100
    ctx.fillStyle = "white"
    ctx.fillRect(-width / 2, -height, width, height)
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">3D Model Preview</CardTitle>
      </CardHeader>
      <CardContent className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800/80 z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-2"></div>
              <p className="text-white">Loading 3D Preview...</p>
            </div>
          </div>
        )}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg">
          <canvas ref={canvasRef} width={800} height={450} className="w-full h-full object-cover" />
        </div>
      </CardContent>
    </Card>
  )
}
