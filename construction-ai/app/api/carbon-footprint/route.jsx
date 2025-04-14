if (!process.env.CARBON_API_KEY) {
  console.error("CARBON_API_KEY environment variable is not set.")
  throw new Error("CARBON_API_KEY environment variable is not set.")
}

import { NextResponse } from "next/server"

// Replace with your actual API key
const CARBON_API_KEY = process.env.CARBON_API_KEY

export async function POST(request) {
  try {
    const requestData = await request.json()

    const response = await fetch("https://www.carboninterface.com/api/v1/estimates", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CARBON_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      throw new Error(`Carbon API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Carbon API error:", error.message)
    return NextResponse.json({ error: "Carbon API request failed", details: error.message }, { status: 500 })
  }
}
