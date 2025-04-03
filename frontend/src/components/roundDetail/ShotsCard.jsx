import { useEffect, useState } from "react"
import { useRoundStore } from "../../store/useRoundStore"
import { ArrowRight, Flag, FlagTriangleRight } from "lucide-react"
import { haversineDistance } from "../../utils/utils"

export default function ShotsCard({ hole, par }) {

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
      {sortedShots.map((shot, index) => {
        // Getting previous shot info
        const previousShot = sortedShots[index - 1]
        const distanceFromPrevious = previousShot
          ? Math.round(
            haversineDistance(
              { latitude: previousShot.userLat, longitude: previousShot.userLong },
              { latitude: shot.userLat, longitude: shot.userLong }
            )
          )
          : null
        // And also getting next shot info
        const nextShot = sortedShots[index + 1]
        const distanceToNext = nextShot
          ? Math.round(
            haversineDistance(
              { latitude: shot.userLat, longitude: shot.userLong },
              { latitude: nextShot.userLat, longitude: nextShot.userLong }
            )
          )
          : null

        // Determining the category of the shot
        const isTeeShot = index === 0
        const shotType = isTeeShot
          ? '🏌️ Tee Shot'
          : shot.distanceToPin > 120
            ? '🎯 Approach'
            : shot.distanceToPin > 30
              ? '🪁 Pitch'
              : shot.distanceToPin > 10
                ? '⛳ Chip'
                : '🥅 Putt'

        // Adding flairs to the shots for a bit of character
        const flairs = []
        if (distanceToNext !== null) {
          // Big shot
          if (distanceToNext > 200) flairs.push({ label: '⚡ Big move', className: 'bg-yellow-200 text-black' })
          // Close shot
          if (distanceToNext > 50 && nextShot?.distanceToPin < distanceToNext / 10) {
            flairs.push({ label: '🎯 Solid shot', className: 'bg-green-200 text-black' })
          }
          // Short shot
          if (distanceToNext < 30) {
            flairs.push({ label: '🪶 Touch shot', className: 'bg-blue-200 text-black' })
          }
          // Bad shot
          if ((distanceToNext < nextShot?.distanceToPin) && !isTeeShot) {
            flairs.push({ label: '💥 Mishit', className: 'bg-red-200 text-black' })
          }
        } else {
          // Pick up
          if ((index + 1) < par) {
            flairs.push({ label: '📦 Packed it in', className: 'bg-[#D4BFA5] text-black'})
          }
          // Hole out / Big putt
          else if (shot.distanceToPin > 10) {
            flairs.push({ label: '💣 Dropped a bomb!', className: 'bg-orange-200 text-black' })
          }
        }

        return (
          <div key={index} className="mb-4">
            <h1 className="text-xl font-bold">Shot {index + 1}</h1>
            <div className="card card-border border-3 border-base-400 bg-base-200 mb-2 p-2 rounded-xl">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm px-2 py-1 rounded-full bg-accent">{shotType}</span>
                  {flairs.map((flair, i) => (
                    <span
                      key={i}
                      className={`text-sm px-2 py-1 rounded-full ${flair.className}`}
                    >
                      {flair.label}
                    </span>
                  ))}
                </div>
                <div className="text-lg font-bold">{shot.distanceToPin}m to pin</div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Time: </span>
                  {new Date(shot.time * 1000).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Location: </span>
                  {shot.userLat.toFixed(4)}°, {shot.userLong.toFixed(4)}°
                </div>
                {distanceFromPrevious !== null && (
                  <div className="text-sm text-gray-600">
                    <ArrowRight className="text-secondary mr-1 inline" />
                    <span className="font-semibold">Distance from last:</span>{' '}
                    <span className="font-bold">{distanceFromPrevious}m</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
