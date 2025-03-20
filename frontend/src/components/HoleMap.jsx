import { useLoadScript, GoogleMap } from "@react-google-maps/api"
import { useCallback, useState } from "react"

const libraries = ["places"]

export default function HoleMap() {
  const mapCenter = { lat: -37.8136, lng: 144.9631 }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const [map, setMap] = useState(null)
  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  if (!isLoaded) {
    return (
      <p>Loading Map...</p>
    )
  }

  return (
    <div className="hole-map-container w-full h-[400px]">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%"}}
        center={mapCenter}
        zoom={16}
        onLoad={onLoad}
        onUnmount={onUnmount}
      />
    </div>
  )
}
