import React, { useEffect, useRef } from 'react'

// Global flag to track MapKit initialization
let mapKitInitialized = false
let initializationPromise = null

// Helper function to initialize MapKit once
const initializeMapKit = (token) => {
  if (mapKitInitialized) {
    return Promise.resolve()
  }

  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = new Promise((resolve) => {
    // Loading the MapKit JS Script if it isn't already initialised
    if (!window.mapkit) {
      const script = document.createElement('script')
      script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'
      script.async = true
      script.onload = () => {
        window.mapkit.init({
          authorizationCallback: (done) => done(token)
        })
        mapKitInitialized = true
        resolve()
      }
      document.body.appendChild(script)
    } else {
      // This is if it is loaded but not initialised
      if (!mapKitInitialized) {
        window.mapkit.init({
          authorizationCallback: (done) => done(token)
        })
        mapKitInitialized = true
      }
      resolve()
    }
  })

  return initializationPromise
}

// This is our component
export default function HoleMap() {

  // Map references
  const mapRef = useRef(null)
  const mapDivRef = useRef(null)

  const mapKitToken = import.meta.env.VITE_MAPKIT_TOKEN

  const teeCoordinates = {
    latitude: -38.379010219658866,
    longitude: 144.89908021716354
  }

  const greenCoordinates = {
    latitude: -38.379482481073026,
    longitude: 144.89479594419115
  }

  const padding = 10

  useEffect(() => {
    let cleanup = null

    // Initialize map after MapKit is ready
    const setupMap = async () => {
      try {
        // Wait for MapKit to be initialized (shared across components)
        await initializeMapKit(mapKitToken)

        // Only create the map if it doesn't exist yet
        if (!mapRef.current && mapDivRef.current) {
          // Create the map instance
          const map = new window.mapkit.Map(mapDivRef.current, {
            showsCompass: false,
            showsZoomControl: false,
            showsMapTypeControl: false,
            showsScale: false
          })
          mapRef.current = map

          // Calculate bearing (direction) from tee to green
          const calculateBearing = () => {
            const startLat = teeCoordinates.latitude * Math.PI / 180
            const startLng = teeCoordinates.longitude * Math.PI / 180
            const destLat = greenCoordinates.latitude * Math.PI / 180
            const destLng = greenCoordinates.longitude * Math.PI / 180

            const y = Math.sin(destLng - startLng) * Math.cos(destLat)
            const x = Math.cos(startLat) * Math.sin(destLat) -
              Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng)
            let bearing = Math.atan2(y, x) * 180 / Math.PI

            // Convert to 0-360 degrees
            bearing = (bearing + 360) % 360

            return bearing
          }

          // Get the bearing and rotate the map
          const bearing = calculateBearing()
          map.rotation = -bearing

          // Create a region that fits both tee and green
          const midLat = (teeCoordinates.latitude + greenCoordinates.latitude) / 2
          const midLong = (teeCoordinates.longitude + greenCoordinates.longitude) / 2

          // Create a span that's slightly larger than needed to provide some padding
          const latDelta = Math.abs(teeCoordinates.latitude - greenCoordinates.latitude) * 0.7
          const longDelta = Math.abs(teeCoordinates.longitude - greenCoordinates.longitude) * 0.7

          // Set the region to fit both points
          map.region = new window.mapkit.CoordinateRegion(
            new window.mapkit.Coordinate(midLat, midLong),
            new window.mapkit.CoordinateSpan(latDelta, longDelta)
          )

          // Add window resize handler to maintain the proper view
          const handleResize = () => {
            // Check if map still exists
            if (mapRef.current) {
              // Create the region
              const region = new window.mapkit.CoordinateRegion(
                new window.mapkit.Coordinate(midLat, midLong),
                new window.mapkit.CoordinateSpan(latDelta, longDelta)
              )

              // Use regionThatFits on the map instance, not on the region
              const fittedRegion = mapRef.current.regionThatFits(
                region,
                new window.mapkit.Padding(padding)
              )

              // Set the fitted region to the map
              mapRef.current.region = fittedRegion
            }
          }

          window.addEventListener('resize', handleResize)

          // Set cleanup function
          cleanup = () => {
            window.removeEventListener('resize', handleResize)
            if (mapRef.current) {
              mapRef.current.destroy()
              mapRef.current = null
            }
          }
        }
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    setupMap()

    // Cleanup function
    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [teeCoordinates, greenCoordinates, mapKitToken, padding])

  return (
    <div
      ref={mapDivRef}
      className="golf-map-container w-full h-full"
    />
  )
}