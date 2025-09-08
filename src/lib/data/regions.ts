"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

// Fallback regions based on your actual backend data
const FALLBACK_REGIONS: Record<string, HttpTypes.StoreRegion> = {
  mx: {
    id: "reg_01K4HR6SSPD90W98MAA1JF6NQX",
    name: "Mexico",
    currency_code: "mxn",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    metadata: null,
    countries: [
      {
        iso_2: "mx",
        iso_3: "mex",
        num_code: "484",
        name: "MEXICO",
        display_name: "Mexico",
        region_id: "reg_01K4HR6SSPD90W98MAA1JF6NQX",
        metadata: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      }
    ]
  },
  us: {
    id: "reg_01K4HR6SSPKHAXJQ180533WTB8",
    name: "United States", 
    currency_code: "usd",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    metadata: null,
    countries: [
      {
        iso_2: "us",
        iso_3: "usa", 
        num_code: "840",
        name: "UNITED STATES",
        display_name: "United States",
        region_id: "reg_01K4HR6SSPKHAXJQ180533WTB8",
        metadata: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: null,
      }
    ]
  }
}

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  try {
    return await sdk.client
      .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
        method: "GET",
        next,
        cache: "force-cache",
      })
      .then(({ regions }) => regions)
  } catch (error) {
    console.warn("Failed to fetch regions from backend, using fallback:", error)
    // Return fallback regions
    return Object.values(FALLBACK_REGIONS)
  }
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  try {
    return await sdk.client
      .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
        method: "GET",
        next,
        cache: "force-cache",
      })
      .then(({ region }) => region)
  } catch (error) {
    console.warn(`Failed to fetch region ${id}, using fallback:`, error)
    // Find fallback region by ID
    return Object.values(FALLBACK_REGIONS).find(region => region.id === id) || null
  }
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegion = async (countryCode: string) => {
  try {
    if (regionMap.has(countryCode)) {
      return regionMap.get(countryCode)
    }

    const regions = await listRegions()

    if (!regions || regions.length === 0) {
      // Use fallback regions
      console.warn("No regions from backend, using fallback regions")
      Object.entries(FALLBACK_REGIONS).forEach(([code, region]) => {
        regionMap.set(code, region)
      })
    } else {
      // Use live regions
      regions.forEach((region) => {
        region.countries?.forEach((c) => {
          regionMap.set(c?.iso_2 ?? "", region)
        })
      })
    }

    const region = regionMap.get(countryCode) || regionMap.get("us") || FALLBACK_REGIONS.us

    return region
  } catch (e: any) {
    console.warn("Error in getRegion, using fallback:", e)
    return FALLBACK_REGIONS[countryCode] || FALLBACK_REGIONS.us
  }
}
