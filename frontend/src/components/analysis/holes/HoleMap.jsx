import { useEffect, useRef, useCallback, useState } from 'react'
import { haversineDistance, calculateBearing, calculateDelta } from "../../../utils/utils"
import { useRoundStore } from '../../../store/useRoundStore'


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
export default function HoleMap({ hole, interactive, selectedShotIndex, setSelectedShotIndex }) {

  const [isMapLoading, setIsMapLoading] = useState(true)

  // Map references
  const mapRef = useRef(null)
  const mapDivRef = useRef(null)

  // Annotation reference
  const annotationRefs = useRef(new Map())

  const mapKitToken = import.meta.env.VITE_MAPKIT_TOKEN

  const { selectedRound, roundHoles, shots, getShotsForHole } = useRoundStore()

  // Extracting relevant info from the hole
  const teeLat = hole.tee_lat
  const teeLng = hole.tee_lng
  const greenLat = hole.green_lat
  const greenLng = hole.green_lng

  const holeLength = haversineDistance(
    { latitude: teeLat, longitude: teeLng },
    { latitude: greenLat, longitude: greenLng }
  )


  // Cleanup function
  const cleanupMap = useCallback(() => {
    if (mapRef.current) {
      try {
        // Removing all annotations and overlays
        // mapRef.current.removeAnnotations(mapRef.current.annotations)
        // mapRef.current.removeOverlays(mapRef.current.overlays)

        // Destroying the map
        mapRef.current.destroy()

        // Nullifying reference
        mapRef.current = null
        annotationRefs.current.clear()

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
          // Disabling these features for the list unless we flag as interactive
          isScrollEnabled: interactive ? true : false,
          isZoomEnabled: interactive ? true : false
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

  useEffect(() => {
    if (isMapLoading || !mapRef.current) {
      return
    }

    const map = mapRef.current
    const holeShots = (shots.get(hole.num) || []).sort((a, b) => a.time - b.time)

    map.removeAnnotations(map.annotations)

    annotationRefs.current.clear()

    holeShots.forEach((shot, index) => {
      const coordinate = new mapkit.Coordinate(shot.userLat, shot.userLong)
      const annotation = new mapkit.Annotation(
        coordinate,
        (coord, opts) => annotationFactory(coord, opts, selectedShotIndex),
        {
          data: { shot, index },
          calloutEnabled: false
        }
      )
      map.addAnnotation(annotation)
    })
  }, [isMapLoading, shots, selectedShotIndex])

  useEffect(() => {
    annotationRefs.current.forEach(({ div, tooltip }, index) => {
      if (!div || !tooltip) {
        return
      }

      const isSelected = index === selectedShotIndex

      div.classList.toggle("bg-blue-500", isSelected)
      div.classList.toggle("bg-blue-400", !isSelected)

      tooltip.classList.toggle("opacity-100", isSelected)
      tooltip.classList.toggle("visible", isSelected)
      tooltip.classList.toggle("opacity-0", !isSelected)
      tooltip.classList.toggle("invisible", !isSelected)
    })
  }, [selectedShotIndex])


  // Factory function for annotations
  var annotationFactory = function (coordinate, options, selectedShotIndex) {
    // console.log(options.data)
    // What the annotation looks like
    var div = document.createElement("div")
    div.className = `
    rounded-full border-2 cursor-pointer transition-all duration-300 relative
    `
    // If map is interactive (larger) we want bigger annotations
    if (interactive) {
      div.classList.add("size-4")
    } else {
      div.classList.add("size-3")
    }

    // Creating the tooltip
    var tooltip = document.createElement("div");
    tooltip.className = `
    card card-border border-2 rounded-lg w-[45px] bg-base-100 border-base-300 pointer-events-none flex items-center justify-center
    absolute invisible transition-opacity duration-300 opacity-0
    `
    var shotDistDiv = document.createElement("div")
    shotDistDiv.className = `text-xs font-medium pointer-events-none`
    shotDistDiv.innerHTML = `${options.data.shot.distanceToPin}m`

    tooltip.appendChild(shotDistDiv)
    div.appendChild(tooltip)

    div.classList.add("bg-blue-400", "border-blue-500", "hover:bg-blue-500")

    // Distance to pin from the annotation
    const distToPin = options.data.shot.distanceToPin

    // Seeing if we have at least 50% left to the hole
    const distRatio = distToPin / holeLength

    let depth = interactive ? "20px" : "15px"

    // Top / bottom adjustments. Now just need to do left and right
    tooltip.style.top = (distRatio < 0.5) ? depth : ""
    tooltip.style.bottom = (distRatio > 0.5) ? depth : ""
    tooltip.style.transform = 'translateX(-50%)'

    // Hover logic
    div.addEventListener("mouseenter", () => {
      tooltip.classList.remove("opacity-0", "invisible")
      tooltip.classList.add("opacity-100", "visible")
    })
    div.addEventListener("mouseleave", () => {
      // If this div is active, do nothing, otherwise, show the tooltip
      if ((selectedShotIndex === options.data.index) && tooltip.classList.contains("opacity-100", "visible")) {
        // Do nothing
      } else {
        tooltip.classList.remove("opacity-100", "visible")
        tooltip.classList.add("opacity-0", "invisible")
      }
    })

    annotationRefs.current.set(options.data.index, { div, tooltip })

    return div
  }

  return (
    <div
      ref={mapDivRef}
      className="golf-map-container w-full h-full cursor-auto"
      id="golf-map-container"
    />
  )
}