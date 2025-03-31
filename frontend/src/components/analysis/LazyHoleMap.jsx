import { useEffect, useRef, useState } from "react"
import HoleMap from "./HoleMap"

export default function LazyHoleMap(props) {
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: "100px",
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
      {isVisible ? <HoleMap {...props} /> : null}
    </div>
  )
}
