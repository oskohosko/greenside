import { LandPlot, MapPin, Menu } from "lucide-react"
import { useRoundStore } from "../store/useRoundStore"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { timeConverter, haversineDistance, getBorderStyle } from "../utils/utils"
import HoleMap from "../components/analysis/holes/HoleMap"
import LargeHoleCard from "../components/roundDetail/LargeHoleCard"
import ShotsCard from "../components/roundDetail/ShotsCard"

export default function RoundDetailPage() {

  // Getting params from route
  const { roundId, holeNum } = useParams()

  // And info from our store
  const { selectedRound, selectedCourse, selectedHole, roundHoles, courseHoles, setSelectedHole, getRound, isRoundsLoading } = useRoundStore()

  const [isLoading, setIsLoading] = useState(true)

  // Getting relevant round info
  useEffect(() => {
    console.log(isRoundsLoading)

    const updateRound = async () => {
      try {
        // Getting round details from ID
        await getRound(roundId)

        // Getting current state and selecting current hole
        const hole = useRoundStore.getState().courseHoles?.[holeNum - 1]
        if (hole) {
          await setSelectedHole(hole)
        }
      } catch (error) {
        console.error("Error loading round:", error)
      } finally {
        setIsLoading(false)
      }
    }

    updateRound()

  }, [roundId, holeNum])


  // Update this to be a skeleton
  if (isLoading || isRoundsLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full">
      {/* Title section */}
      <div className="w-full h-16 flex justify-between pr-4.5 items-center border-b-2 border-dashed border-base-400">
        <h1 className="text-4xl font-bold pointer-events-none">
          {selectedRound.title}
        </h1>
        <div className={`btn flex items-center justify-center p-0 bg-transparent border-2 border-base-200 hover:border-base-300`}>
          <Menu size={40} />
        </div>
      </div>
      {/* Card displaying round info */}
      <div className="card card-border border-3 rounded-xl w-[400px] h-[110px] bg-base-100 border-base-300 mt-2">
        <div className="flex flex-row h-full">
          {/* Title */}
          <div className="h-full w-5/7 pb-2">
            <div className="flex flex-col justify-between border-r-2 border-base-400 border-dashed h-full pl-2">
              <div className="flex flex-row items-center gap-1 h-full">
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
      <div className="flex flex-row gap-10">
        {/* Hole section */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mt-2 px-1">Hole {holeNum}</h1>
          {/* The hole card */}
          <LargeHoleCard hole={selectedHole} />
        </div>
        {/* Score section */}
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold mt-2 px-1">Shots</h1>
          {/* Sending the user's shots */}
          <ShotsCard hole={roundHoles[holeNum - 1]} />
        </div>
      </div>
    </div>
  )
}
