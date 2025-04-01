import { useEffect, useRef, useState } from "react"
import HoleMap from "./HoleMap"

export default function LazyHoleMap(props) {
  // State for which maps are visible or not
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the HoleMap is in the viewport, we want it visible
        setIsVisible(entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={observerRef} className="w-full h-full">
      {/* Only displays the map if it is visible */}
      {isVisible ? <HoleMap {...props} /> : null}
    </div>
  )
}
