import { useEffect, useRef, useCallback, useState } from 'react'
import { calculateBearing, calculateDelta } from "../../utils/geometry"

import { useRoundStore } from '../../store/useRoundStore'

// flag to track MapKit initialization
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
export default function HoleMap({ hole }) {

  const [isMapLoading, setIsMapLoading] = useState(true)

  // Map references
  const mapRef = useRef(null)
  const mapDivRef = useRef(null)

  const mapKitToken = import.meta.env.VITE_MAPKIT_TOKEN

  const { selectedRound, roundHoles, shots, getShotsForHole } = useRoundStore()

  // Extracting relevant info from the hole
  const teeLat = hole.tee_lat
  const teeLng = hole.tee_lng
  const greenLat = hole.green_lat
  const greenLng = hole.green_lng


  // Cleanup function
  const cleanupMap = useCallback(() => {
    console.log(`Cleaning hole: ${hole.num}`)
    if (mapRef.current) {
      try {
        // Removing all annotations and overlays
        // mapRef.current.removeAnnotations(mapRef.current.annotations)
        // mapRef.current.removeOverlays(mapRef.current.overlays)

        // Destroying the map
        mapRef.current.destroy()

        // Nullifying reference
        mapRef.current = null
      } catch (error) {
        console.warn('Error during map cleanup:', error)
      }
    }
  }, [])

  useEffect(() => {
    // Cleanup any existing map before creating a new one
    cleanupMap()

    // Initialising map after MapKit is ready
    const setupMap = async () => {
      try {
        setIsMapLoading(true)
        // Waiting for MapKit to be initialized (shared across components)
        await initializeMapKit(mapKitToken)

        // Creating the map instance
        const map = new window.mapkit.Map(mapDivRef.current, {
          showsCompass: mapkit.FeatureVisibility.Hidden,
          showsZoomControl: false,
          showsMapTypeControl: false,
          showsScale: mapkit.FeatureVisibility.Hidden,
          // Disabling these features for the list
          isScrollEnabled: false,
          isZoomEnabled: false
          // mapType: mapkit.Map.MapTypes.Satellite
        })
        mapRef.current = map

        // Creating a region that fits both tee and green
        const midLat = (teeLat + greenLat) / 2
        const midLong = (teeLng + greenLng) / 2

        // Creating a span that's slightly larger than needed to provide some padding
        const delta = calculateDelta(
          { latitude: teeLat, longitude: teeLng },
          { latitude: greenLat, longitude: greenLng }
        );

        // Setting the region to fit both points
        map.region = new window.mapkit.CoordinateRegion(
          new window.mapkit.Coordinate(midLat, midLong),
          new window.mapkit.CoordinateSpan(delta, delta)
        )

        // Getting the bearing and attempting to rotate the map
        const bearing = calculateBearing(teeLat, teeLng, greenLat, greenLng)
        try {
          map.rotation = -bearing
        } catch (error) {
          console.error("Rotation error")
        }

        // Now getting the shots for this hole if they haven't been generated already
        if (!shots.get(hole.num)) {
          console.log(`Getting shots for hole: ${hole.num}`)
          await getShotsForHole(roundHoles[hole.num - 1])
        }

      } catch (error) {
        console.error("Error initializing map:", error)
      } finally {
        setIsMapLoading(false)
      }
    }

    setupMap()

    // Cleanup function
    return () => {
      cleanupMap()
    }
  }, [teeLat, teeLng, greenLat, greenLng, mapKitToken])

  // Waiting until the map has loaded before adding annotations as they are a bit finicky
  if (!isMapLoading) {
    // Going through each shot
    for (let shot of shots.get(hole.num)) {
      // Adding a marker annotation for now
      const annotation = new mapkit.MarkerAnnotation(
        new mapkit.Coordinate(shot.userLat, shot.userLong),
        {
          animates: false,
        }
      )
      mapRef.current.addAnnotation(annotation)
    }
  }

  return (
    <div
      ref={mapDivRef}
      className="golf-map-container w-full h-full"
    />
  )
}