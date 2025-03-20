import { useLoadScript, GoogleMap, Marker } from "@react-google-maps/api"
import { useCallback, useState, useRef, useEffect } from "react"

const libraries = ["places"]

// Test hole - Rosebud North hole 1

const testHole1 = {
  "tee_lat": -38.379010219658866,
  "tee_lng": 144.89908021716354,
  "green_lat": -38.379482481073026,
  "green_lng": 144.89479594419115,
  "num": 1,
  "par": 4,
}

export default function HoleMap() {

  const mapRef = useRef(null)

  useEffect(() => {
    const initMap = async () => {
      try {
        const { Map } = await window.google.maps.importLibrary('maps')

        const bounds = new window.google.maps.LatLngBounds()
        bounds.extend(new window.google.maps.LatLng(testHole1.green_lat, testHole1.green_lng))
        bounds.extend(new window.google.maps.LatLng(testHole1.tee_lat, testHole1.tee_lng))

        // Center of the map will be between tee and green
        const mapCenter = {
          lat: testHole1.tee_lat - (testHole1.green_lat - testHole1.tee_lat) * 0.3,
          lng: (testHole1.tee_lng + testHole1.green_lng) / 2,
        }

        const bearing = calcBearing(
          testHole1.tee_lat,
          testHole1.tee_lng,
          testHole1.green_lat,
          testHole1.green_lng
        )

        const map = new Map(mapRef.current, {
          center: mapCenter,
          zoom: 12,
          mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
          heading: bearing,
          restriction: {
            latLngBounds: bounds,
            strictBounds: false
          },
          disableDefaultUI: true,
          mapTypeId: google.maps.MapTypeId.SATELLITE
        })
        map.fitBounds(bounds, {
          top: 50,
          bottom: 100,
          left: 20,
          right: 20,
        })
      } catch (error) {
        console.error("error intialising map", error)
      }
    }

    if (window.google && window.google.maps) {
      try {
        initMap()
      } catch (error) {
        console.error(error)
      }

    } else {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap&v=weekly`
      script.defer = true
      script.async = true
      document.head.appendChild(script)

      window.initMap = initMap
    }

  }, [])

  return (
    // Our map
    <div className="hole-map-container w-[150px] h-[300px]" ref={mapRef}>
    </div>
  )
}

// Helper function to calc bearing between two coords
const calcBearing = (lat1, lng1, lat2, lng2) => {
  const rad = Math.PI / 180;
  const y = Math.sin((lng2 - lng1) * rad) * Math.cos(lat2 * rad);
  const x =
    Math.cos(lat1 * rad) * Math.sin(lat2 * rad) -
    Math.sin(lat1 * rad) * Math.cos(lat2 * rad) * Math.cos((lng2 - lng1) * rad);
  const theta = Math.atan2(y, x);
  return ((theta * 180) / Math.PI + 360) % 360
}