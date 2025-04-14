// Carbon footprint calculation service

export async function calculateMaterialFootprint(material, quantity, unit) {
  try {
    const requestData = {
      type: "materials",
      material_type: material,
      quantity: quantity,
      unit: unit,
    }

    const response = await fetch("/api/carbon-footprint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error calculating carbon footprint:", error)
    throw error
  }
}

export async function calculateFuelFootprint(fuelType, quantity, unit) {
  try {
    const requestData = {
      type: "fuel_combustion",
      fuel_source_type: fuelType,
      fuel_source_unit: unit,
      fuel_source_value: quantity,
    }

    const response = await fetch("/api/carbon-footprint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })

    if (!response.ok) {
      throw new Error(`Request failed with status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error calculating fuel carbon footprint:", error)
    throw error
  }
}

export async function calculateConstructionFootprint(materials) {
  try {
    // Calculate footprint for multiple materials in a construction project
    const promises = materials.map((material) =>
      calculateMaterialFootprint(material.type, material.quantity, material.unit),
    )

    const results = await Promise.all(promises)

    // Aggregate results
    const totalCO2 = results.reduce((sum, result) => {
      return sum + (result.data?.attributes?.carbon_kg || 0)
    }, 0)

    return {
      totalCO2,
      detailedResults: results,
    }
  } catch (error) {
    console.error("Error calculating construction footprint:", error)
    throw error
  }
}

export function getMaterialOptions() {
  return [
    { value: "concrete", label: "Concrete" },
    { value: "steel", label: "Steel" },
    { value: "wood", label: "Wood" },
    { value: "glass", label: "Glass" },
    { value: "aluminum", label: "Aluminum" },
    { value: "plastic", label: "Plastic" },
    { value: "insulation", label: "Insulation" },
    { value: "brick", label: "Brick" },
    { value: "asphalt", label: "Asphalt" },
  ]
}

export function getFuelOptions() {
  return [
    { value: "diesel", label: "Diesel" },
    { value: "gasoline", label: "Gasoline" },
    { value: "natural_gas", label: "Natural Gas" },
    { value: "propane", label: "Propane" },
  ]
}
