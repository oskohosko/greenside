import { MapPin, Menu } from "lucide-react"
import { useRoundStore } from "../store/useRoundStore"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { timeConverter } from "../utils/time"

export default function RoundDetailPage() {

  // Getting params from route
  const { roundId, holeNum } = useParams()

  // And info from our store
  const { selectedRound, selectedCourse, selectedHole, roundHoles, courseHoles, setSelectedHole, getRound } = useRoundStore()

  const [isLoading, setIsLoading] = useState(true)

  // Getting relevant round info
  useEffect(() => {

    // Async function to update the round
    const updateRound = async () => {
      try {
        await getRound(roundId)

        // Ensuring we have the course and hole
        if (courseHoles && courseHoles.length > 0 && holeNum) {
          await setSelectedHole(courseHoles[holeNum - 1])
        }
      } catch (error) {
        console.error("Error loading round:", error)
      } finally {
        setIsLoading(false)
      }
    }

    updateRound()

  }, [roundId, holeNum, getRound, setSelectedHole])

  // Update this to be a skeleton
  if (isLoading) {
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
      <div className="card card-border border-2 rounded-xl w-[400px] h-[110px] bg-base-100 border-base-300 mt-2">
        <div className="flex flex-row h-full">
          {/* Title */}
          <div className="h-full w-5/7 pb-2">
            <div className="flex flex-col justify-between border-r-2 border-base-400 border-dashed h-full pl-2">
              <div className="flex flex-row items-center gap-1 h-full">
                <MapPin className="size-11 text-primary" />
                <div className="text-xl/tight font-bold pointer-events-none">
                  {selectedCourse.name}
                </div>
              </div>
              {/* Time */}
              <p className="text-sm font-medium text-base-content/70 pl-1">{timeConverter(selectedRound.createdAt)}</p>
            </div>
          </div>
          {/* Score */}
          <p className="flex items-center justify-center font-bold text-4xl p-1 w-2/7">{selectedRound.score}</p>
        </div>
      </div>


      {/* Rounds Section */}
      {/* <RoundsList /> */}
      {/* Score section */}
      {/* <ScoreTable /> */}
      {/* Hole by hole section with map of each hole */}
      {/* <HolesList /> */}
    </div>
  )
}
