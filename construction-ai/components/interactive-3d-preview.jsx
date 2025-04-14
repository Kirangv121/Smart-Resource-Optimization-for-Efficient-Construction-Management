"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CuboidIcon as Cube, Maximize2, Minimize2, RotateCcw } from "lucide-react"

const HOUSE_IMAGE_URL =
  "https://www.bhg.com/thmb/0Fg9z0iU1t9clXIjFz0iQ1UQ0DQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/small-white-house-100744189-4x3-77d43ad2c41c4132b9296b9399944165.jpg"
const BUILDING_IMAGE_URL =
  "https://5.imimg.com/data5/SELLER/Default/2023/4/302647737/JL/TH/TW/117496598/residential-building-elevation-design-service.jpg"
const SCHOOL_IMAGE_URL =
  "https://www.shutterstock.com/image-photo/modern-school-building-exterior-sunny-260nw-2244987747.jpg"
const COMMERCIAL_IMAGE_URL =
  "https://media.istockphoto.com/id/1408997889/photo/modern-office-building-in-the-city.webp?b=1&s=612x612&w=0&k=20&c=y_t-5jS0c9wFo5-9-Zz9G-eclm3wA1n3-9I-G-Y0g0="
const WAREHOUSE_IMAGE_URL =
  "https://media.istockphoto.com/id/183732499/photo/warehouse-interior.jpg?s=612x612&w=0&k=20&c=t1a9vLg6b-m-n93-Tf-m3LgV3Ww_i8GqXmXN60E-o="

export function Interactive3DPreview({ projectType, subType }) {
  const canvasRef = useRef(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
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
        await drawHouse(ctx, subType)
      } else if (projectType === "building") {
        await drawBuilding(ctx, subType)
      } else if (projectType === "school") {
        await drawSchool(ctx)
      } else if (projectType === "commercial") {
        await drawCommercial(ctx)
      } else if (projectType === "warehouse") {
        await drawWarehouse(ctx)
      } else {
        // Default
        await drawHouse(ctx, "3BHK")
      }

      ctx.restore()
      setIsLoading(false)
    }

    draw()
  }, [projectType, subType])

  const toggleFullscreen = () => {
    if (!canvasRef.current) return

    if (!isFullscreen) {
      if (canvasRef.current.requestFullscreen) {
        canvasRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }

    setIsFullscreen(!isFullscreen)
  }

  // Drawing functions
  const drawHouse = (ctx, type) => {
    return new Promise((resolve) => {
      const size = type === "1BHK" ? 80 : type === "2BHK" ? 100 : 120

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.drawImage(img, -size, -size / 2, size * 2, size)
        resolve()
      }
      img.onerror = () => {
        console.error("Error loading house image")
        resolve()
      }
      img.src = HOUSE_IMAGE_URL
    })
  }

  const drawBuilding = (ctx, type) => {
    return new Promise((resolve) => {
      const floors = type === "4-Story" ? 4 : type === "8-Story" ? 8 : 12
      const width = 120
      const floorHeight = 20
      const height = floors * floorHeight

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.drawImage(img, -width / 2, -height, width, height)
        resolve()
      }
      img.onerror = () => {
        console.error("Error loading building image")
        resolve()
      }
      img.src = BUILDING_IMAGE_URL
    })
  }

  const drawSchool = (ctx) => {
    return new Promise((resolve) => {
      const width = 120
      const height = 100

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.drawImage(img, -width / 2, -height, width, height)
        resolve()
      }
      img.onerror = () => {
        console.error("Error loading school image")
        resolve()
      }
      img.src = SCHOOL_IMAGE_URL
    })
  }

  const drawCommercial = (ctx) => {
    return new Promise((resolve) => {
      const width = 120
      const height = 100

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.drawImage(img, -width / 2, -height, width, height)
        resolve()
      }
      img.onerror = () => {
        console.error("Error loading commercial image")
        resolve()
      }
      img.src = COMMERCIAL_IMAGE_URL
    })
  }

  const drawWarehouse = (ctx) => {
    return new Promise((resolve) => {
      const width = 120
      const height = 100

      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        ctx.drawImage(img, -width / 2, -height, width, height)
        resolve()
      }
      img.onerror = () => {
        console.error("Error loading warehouse image")
        resolve()
      }
      img.src = WAREHOUSE_IMAGE_URL
    })
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-white">3D Model Preview</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="text-white">
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </Button>
          <Cube className="h-5 w-5 text-blue-400" />
        </div>
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
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            className="text-white border-blue-600 hover:bg-blue-600/20"
            onClick={() => {
              if (canvasRef.current) {
                const ctx = canvasRef.current.getContext("2d")
                if (ctx) {
                  // Redraw the canvas
                  setIsLoading(true)
                  setTimeout(() => setIsLoading(false), 500)
                }
              }
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Rotate View
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
