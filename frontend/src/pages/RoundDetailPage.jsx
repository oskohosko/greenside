import { MapPin, Menu } from "lucide-react"
import { useRoundStore } from "../store/useRoundStore"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { haversineDistance, timeConverter } from "../utils/utils"
import LargeHoleCard from "../components/roundDetail/LargeHoleCard"
import ShotsCard from "../components/roundDetail/ShotsCard"
import { useNavigate } from "react-router-dom"

export default function RoundDetailPage() {

  // Getting params from route
  const { roundId, holeNum } = useParams()

  // And info from our store
  const { selectedRound, selectedCourse, selectedHole, roundHoles, courseHoles, setSelectedHole, getRound, isRoundsLoading, getShotsForHole, shots } = useRoundStore()

  const [isLoading, setIsLoading] = useState(true)

  // State to manage selected shot
  const [selectedShotIndex, setSelectedShotIndex] = useState(null)

  // Getting relevant round info
  useEffect(() => {
    setSelectedShotIndex(null)

    const updateRound = async () => {
      try {
        // Getting round details from ID
        await getRound(roundId)

        // Getting current state and selecting current hole
        const hole = useRoundStore.getState().courseHoles?.[holeNum - 1]
        const userHole = useRoundStore.getState().roundHoles?.[holeNum - 1]
        if (hole) {
          await setSelectedHole(hole)
          await getShotsForHole(userHole)
        }
      } catch (error) {
        console.error("Error loading round:", error)
      } finally {
        setIsLoading(false)
      }
    }

    updateRound()

  }, [roundId, holeNum])

  const navigate = useNavigate()
  const holeIndex = parseInt(holeNum) - 1
  const totalHoles = roundHoles.length

  const goToHole = (index) => {
    if (index >= 0 && index < totalHoles) {
      navigate(`/round/${roundId}/hole/${index + 1}`)
    }
  }



  // Update this to be a skeleton
  if (isLoading || isRoundsLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  const shotsForHole = shots.get(parseInt(holeNum)) || []

  return (
    <div className="flex flex-col w-full h-full pb-6">
      {/* Title section */}
      <div className="w-full sm:h-20 lg:h-16 md:h-16 flex justify-between pr-4.5 items-center border-b-2 border-dashed border-base-400">
        <h1 className="text-4xl font-bold pointer-events-none">
          {selectedRound.title}
        </h1>
        <div className={`btn flex items-center justify-center p-0 bg-transparent border-2 border-base-200 hover:border-base-300`}>
          <Menu size={40} />
        </div>
      </div>
      {/* Card displaying round info */}
      <div className="flex flex-col sm:flex-row justify-between gap-3 px-2 mt-2">
        <div
          className="card rounded-xl w-full sm:w-[300px] lg:w-[400px] h-[110px] bg-base-100 transition-all duration-300">

          <div className="flex flex-row h-full">
            {/* Title */}
            <div className="h-full w-5/7 pb-2 pt-2">
              <div className="flex flex-col justify-between border-r-2 border-base-400 border-dashed h-full pl-2">
                <div className="flex flex-row items-center gap-1 h-full pr-2">
                  <MapPin className="size-11 text-primary" />
                  <h2 className="text-xl/tight font-bold pointer-events-none">
                    {selectedCourse.name}
                  </h2>
                </div>
                {/* Time */}
                <p className="text-sm font-medium text-base-content/70 pl-1">{timeConverter(selectedRound.createdAt)}</p>
              </div>
            </div>
            {/* Score */}
            <h1 className="flex items-center justify-center font-bold text-4xl p-1 w-2/7">{selectedRound.score}</h1>
          </div>
        </div>
        {/* Holes on the round */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-base-content mb-1 pl-1">Jump to hole</h2>
          <div className="flex flex-wrap gap-2">

            {roundHoles.map((_, i) => {
              const holeData = courseHoles[i]
              const holeDist = holeData
                ? Math.round(haversineDistance(
                  { latitude: holeData.tee_lat, longitude: holeData.tee_lng },
                  { latitude: holeData.green_lat, longitude: holeData.green_lng }
                ))
                : null
              return (
                <div
                  key={i}
                  className="relative group">
                  <button
                    onClick={() => goToHole(i)}
                    className={`btn btn-xs rounded-full px-3 py-1 font-bold border border-base-300 ${i === holeIndex ? 'bg-primary text-white border-primary' : 'bg-base-100 hover:bg-base-200'
                      }`}
                  >
                    {i + 1}
                  </button>
                  <div className={`absolute left-1/2 top-full mt-1 -translate-x-1/2 bg-base-200 text-xs px-2 py-1 rounded-2xl shadow-sm border border-base-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 duration-100 pointer-events-none`}>
                    Par {courseHoles[i].par} {holeDist ? `· ${holeDist}m` : ''}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-2 mb-1 px-1 ml-1">
        <button
          disabled={holeIndex === 0}
          className="btn btn-md bg-base-300 border-2 border-base-300 disabled:opacity-30 hover:border-base-content/20"
          onClick={() => goToHole(holeIndex - 1)}
        >
          ← Prev
        </button>
        <button
          disabled={holeIndex === totalHoles - 1}
          className="btn btn-md bg-base-300 border-2 border-base-300 disabled:opacity-30 hover:border-base-content/20"
          onClick={() => goToHole(holeIndex + 1)}
        >
          Next →
        </button>
      </div>
      <div className="flex flex-col lg:flex-row md:flex-row gap-6 lg:gap-10 px-2">

        {/* Hole section */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mt-2 px-1">Hole {holeNum}</h1>
          {/* The hole card */}
          <LargeHoleCard
            hole={selectedHole}
            selectedShotIndex={selectedShotIndex}
            setSelectedShotIndex={setSelectedShotIndex} />
        </div>
        {/* Score section */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mt-2 px-1">Shots</h1>
          {/* Sending the user's shots */}
          <ShotsCard
            hole={roundHoles[holeNum - 1]}
            par={selectedHole.par}
            shots={shotsForHole}
            selectedShotIndex={selectedShotIndex}
            setSelectedShotIndex={setSelectedShotIndex}
          />
        </div>
      </div>
    </div>
  )
}
