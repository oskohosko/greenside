import { useEffect, useState } from "react"
import { useRoundStore } from "../../store/useRoundStore"
import { Flag, FlagTriangleRight } from "lucide-react"

export default function ShotsCard({ hole }) {

  const { shots, getShotsForHole, isShotsLoading } = useRoundStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getShots = async () => {
      setIsLoading(true)
      try {
        await getShotsForHole(hole)
      } catch (error) {
        console.error("Error getting shots:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getShots()
  }, [hole])

  if (isLoading || isShotsLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  // Ensuring loading has finished
  let sortedShots = []
  if (!isShotsLoading && !isLoading) {
    shots.get(hole.holeNum).forEach((shot) => {
      sortedShots.push(shot)
    })
    sortedShots.sort((a, b) => a.time - b.time)
  }

  return (
    <div className="card card-border rounded-2xl border-3 border-base-300 pt-1 px-2 pb-2 w-[400px] bg-base-100">
      {sortedShots.map((shot, index) => (
        <div key={index}>
          <h1 className="text-xl font-bold">Shot {index + 1}</h1>
          <div className="card card-border border-2 border-base-400 bg-base-200 mb-2 p-1">
            <div className="flex flex-row items-center gap-1">
              <div className="flex items-center justify-center bg-primary/30 size-7 rounded-2xl">
                <Flag strokeWidth={3} className="size-4 text-primary" />
              </div>
              <h2 className="text-lg font-bold">{shot.distanceToPin}m</h2>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
