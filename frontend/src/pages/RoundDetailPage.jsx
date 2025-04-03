import { LandPlot, MapPin, Menu } from "lucide-react"
import { useRoundStore } from "../store/useRoundStore"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { timeConverter, haversineDistance, getBorderStyle } from "../utils/utils"
import HoleMap from "../components/analysis/holes/HoleMap"
import LazyHoleMap from "../components/analysis/holes/LazyHoleMap"

export default function RoundDetailPage() {

  // Getting params from route
  const { roundId, holeNum } = useParams()

  // And info from our store
  const { selectedRound, selectedCourse, selectedHole, roundHoles, courseHoles, setSelectedHole, getRound } = useRoundStore()

  const [isLoading, setIsLoading] = useState(true)

  // Getting relevant round info
  useEffect(() => {

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


  // This is the data from the user on the hole.
  const playedHole = roundHoles[holeNum - 1]

  // Update this to be a skeleton
  if (isLoading || !selectedRound || !selectedCourse || !selectedHole) {
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
      {/* Hole section */}
      <h1 className="text-3xl font-bold mt-2 px-1">Hole {holeNum}</h1>

      <div className="card card-border rounded-2xl border-2 border-base-300 pt-1 px-2 pb-2 w-[300px] bg-base-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-2xl px-1">Par {selectedHole.par}</p>
            <div className="flex flex-row items-center px-1 gap-2 pb-1">
              <div className="size-6 flex items-center justify-center bg-error/40 rounded-lg">
                <LandPlot className="size-5 text-error" />
              </div>
              <p className="font-bold text-xl">
                {Math.round(haversineDistance(
                  { latitude: selectedHole.tee_lat, longitude: selectedHole.tee_lng },
                  { latitude: selectedHole.green_lat, longitude: selectedHole.green_lng }
                ))}m
              </p>
            </div>
          </div>
          <div className={`flex justify-center items-center aspect-square w-[40px] mr-1 ${getBorderStyle(playedHole.score, selectedHole.par)} ${playedHole.score !== selectedHole.par ? "outline-3" : ""}`} >
            <h2 className="text-4xl font-medium">
              {playedHole.score}
            </h2>
          </div>
        </div>

        <div className="h-[540px] w-[280px] rounded-lg overflow-hidden">
          <HoleMap hole={selectedHole} interactive={true} />
        </div>
      </div>
    </div>
  )
}
