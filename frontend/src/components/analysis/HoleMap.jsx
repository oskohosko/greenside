import React, { useEffect, useRef, useCallback } from 'react'

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

  initializationPromise = new Promise((resolve, reject) => {
    // Loading the MapKit JS Script if it isn't already initialised
    if (!window.mapkit) {
      const script = document.createElement('script')
      script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js'
      script.async = true
      script.onload = () => {
        try {
          window.mapkit.init({
            authorizationCallback: (done) => done(token)
          })
          mapKitInitialized = true
          resolve()
        } catch (error) {
          reject(error)
        }
      }
      script.onerror = reject
      document.body.appendChild(script)
    } else {
      // This is if it is loaded but not initialised
      if (!mapKitInitialized) {
        try {
          window.mapkit.init({
            authorizationCallback: (done) => done(token)
          })
          mapKitInitialized = true
        } catch (error) {
          reject(error)
        }
      }
      resolve()
    }
  })

  return initializationPromise
}

// This is our component
export default function HoleMap({ teeLat, teeLng, greenLat, greenLng }) {
  // Map references
  const mapRef = useRef(null)
  const mapDivRef = useRef(null)

  const mapKitToken = import.meta.env.VITE_MAPKIT_TOKEN

  const teeCoordinates = {
    latitude: teeLat,
    longitude: teeLng
  }

  const greenCoordinates = {
    latitude: greenLat,
    longitude: greenLng
  }

  // Enhanced cleanup function
  const cleanupMap = useCallback(() => {
    if (mapRef.current) {
      try {
        // Remove all annotations and overlays
        mapRef.current.removeAnnotations(mapRef.current.annotations)
        mapRef.current.removeOverlays(mapRef.current.overlays)

        // Destroy the map
        mapRef.current.destroy()

        // Nullify references to help garbage collection
        mapRef.current = null
      } catch (error) {
        console.warn('Error during map cleanup:', error)
      }
    }

    // Additional cleanup for WebGL context
    if (mapDivRef.current) {
      const canvas = mapDivRef.current.querySelector('canvas')
      if (canvas) {
        canvas.width = 0
        canvas.height = 0
      }
    }
  }, [])

  useEffect(() => {
    // Cleanup any existing map before creating a new one
    cleanupMap()

    // Initialising map after MapKit is ready
    const setupMap = async () => {
      try {
        // Waiting for MapKit to be initialized (shared across components)
        await initializeMapKit(mapKitToken)

        // Creating the map instance
        const map = new window.mapkit.Map(mapDivRef.current, {
          showsCompass: mapkit.FeatureVisibility.Hidden,
          showsZoomControl: false,
          showsMapTypeControl: false,
          showsScale: mapkit.FeatureVisibility.Hidden,
          // mapType: mapkit.Map.MapTypes.Satellite
        })
        mapRef.current = map

        // Calculating the bearing from tee to green for orientation
        const calculateBearing = () => {
          const startLat = teeCoordinates.latitude * Math.PI / 180
          const startLng = teeCoordinates.longitude * Math.PI / 180
          const destLat = greenCoordinates.latitude * Math.PI / 180
          const destLng = greenCoordinates.longitude * Math.PI / 180

          const y = Math.sin(destLng - startLng) * Math.cos(destLat)
          const x = Math.cos(startLat) * Math.sin(destLat) -
            Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng)
          let bearing = Math.atan2(y, x) * 180 / Math.PI

          // Converting to degrees
          bearing = (bearing + 360) % 360

          return bearing
        }

        function haversineDistance(coord1, coord2) {
          const toRadians = (degrees) => degrees * (Math.PI / 180);

          const R = 6371000;

          const lat1 = toRadians(coord1.latitude);
          const lon1 = toRadians(coord1.longitude);
          const lat2 = toRadians(coord2.latitude);
          const lon2 = toRadians(coord2.longitude);

          const dLat = lat2 - lat1;
          const dLon = lon2 - lon1;

          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

          return R * c;
        }

        function calculateDelta(coord1, coord2) {

          const holeDist = haversineDistance(coord1, coord2);

          const delta = Math.max(0.0007, Math.min(0.005, 0.0007 * holeDist / 90.0))

          return delta;
        }

        // Creating a region that fits both tee and green
        const midLat = (teeCoordinates.latitude + greenCoordinates.latitude) / 2
        const midLong = (teeCoordinates.longitude + greenCoordinates.longitude) / 2

        // Creating a span that's slightly larger than needed to provide some padding
        const delta = calculateDelta(teeCoordinates, greenCoordinates);

        // Setting the region to fit both points
        map.region = new window.mapkit.CoordinateRegion(
          new window.mapkit.Coordinate(midLat, midLong),
          new window.mapkit.CoordinateSpan(delta, delta)
        )

        // Getting the bearing and attempting to rotate the map
        const bearing = calculateBearing()

        // Trying to set rotation
        try {
          map.rotation = -bearing
        } catch (rotationError) {
          console.warn('Could not set map rotation:', rotationError)
        }

      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    setupMap()

    // Cleanup function
    return () => {
      cleanupMap()
    }
  }, [teeLat, teeLng, greenLat, greenLng, mapKitToken])

  return (
    <div
      ref={mapDivRef}
      className="golf-map-container w-full h-full"
    />
  )
}