import { ArrowRight } from "lucide-react"
import { haversineDistance } from "../../utils/utils"

export default function ShotsCard({ hole, par, shots, selectedShotIndex, setSelectedShotIndex }) {
  const sortedShots = [...shots].sort((a, b) => a.time - b.time)

  return (
    <div className="card rounded-2xl bg-base-100 pt-1 px-3 pb-2 w-[350px] lg:w-[400px] transition-all duration-300 overflow-y-auto max-h-[700px]">
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
          : shot.distanceToPin > 100
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
          if (((distanceToNext < nextShot?.distanceToPin) || (nextShot?.distanceToPin > shot.distanceToPin / 2)) && !isTeeShot) {
            flairs.push({ label: '💥 Mishit', className: 'bg-red-200 text-black' })
          }
        } else {
          // Pick up
          if ((index + 1) < par && (index + 1) !== hole.score) {
            flairs.push({ label: '📦 Packed it in', className: 'bg-[#D4BFA5] text-black' })
          }
          // Hole out / Big putt
          else if (shot.distanceToPin > 10) {
            flairs.push({ label: '💣 Dropped a bomb!', className: 'bg-orange-200 text-black' })
          }
        }

        return (
          <div
            key={index}
            className="mb-2"
          >
            <h1 className="text-xl font-bold ml-1">Shot {index + 1}</h1>
            <div
              className={`card bg-base-200 mb-2 p-2 rounded-xl
              ${index === selectedShotIndex ? "border-base-content" : "border-base-400"}  cursor-pointer hover:shadow-lg
              `}
              onClick={() => setSelectedShotIndex(
                index === selectedShotIndex ? null : index
              )
              }
            >
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
                  <span className="font-semibold">Location: </span>
                  {shot.userLat.toFixed(4)}°, {shot.userLong.toFixed(4)}°
                </div>
                {distanceFromPrevious !== null && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center px-2 py-1 rounded-full bg-base-300 text-sm font-semibold text-base-content">
                      <ArrowRight strokeWidth={3} className="w-4 h-4 mr-1 text-secondary" />
                      Last shot: {distanceFromPrevious}m
                    </div>
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
