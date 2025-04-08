import { Crosshair, MapPin, Trophy } from "lucide-react";
import { useRoundStore } from "../../store/useRoundStore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function Insights() {

  const { roundId } = useParams()
  const navigate = useNavigate()

  const { getInsights, isInsightsLoading } = useRoundStore()

  const [longestDrive, setLongestDrive] = useState({ distance: 0, hole: null })
  const [bestApproach, setBestApproach] = useState({ ratio: Infinity, distance: 0, prevDistance: 0, hole: null })

  useEffect(() => {
    // Fetching insights when component mounts or when roundId changes
    const fetchInsights = async () => {
      try {
        await getInsights()
      } catch (error) {
        console.error("Error fetching insights:", error)
      } finally {
        // Getting the insights from the store
        setLongestDrive(useRoundStore.getState().longestDrive)
        setBestApproach(useRoundStore.getState().bestApproach)
      }
    }

    fetchInsights()
  }, [getInsights])

  // Function to navigate to the hole detail page
  const goToHole = (holeNum) => {
    navigate(`/round/${roundId}/hole/${holeNum}`)
  }

  if (isInsightsLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className="card rounded-2xl bg-base-100 pt-1 px-3 pb-2 w-[200px] lg:w-[300px] transition-all duration-300 overflow-y-auto max-h-[750px]">
      <div className="flex flex-row items-center gap-1 mb-1">
        <Trophy className="size-5 text-yellow-300" />
        <h2 className="text-xl font-bold ml-1">
          Longest Drive
        </h2>
      </div>
      <div
        className="card bg-base-200 mb-2 p-2 rounded-xl cursor-pointer hover:shadow-lg"
        onClick={() => goToHole(longestDrive.hole)}
      >
        <div className="flex flex-row">
          <div className="p-1 w-3/5">
            <div className="flex flex-col gap-2 border-r-2 border-dashed border-base-400">
              <div className="flex flex-row items-center">
                <MapPin className="size-6 text-primary" />
                <span className="text-lg font-bold px-1">Hole {longestDrive.hole}</span>
              </div>
            </div>
          </div>
          <div className="w-2/5 flex items-center justify-center">
            <span className="text-2xl font-bold px-1">{longestDrive.distance}m</span>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-1 mb-1">
        <Crosshair className="size-5 text-red-300" />
        <h2 className="text-xl font-bold ml-1">
          Best Approach
        </h2>
      </div>
      <div
        className="card bg-base-200 mb-2 p-2 rounded-xl cursor-pointer hover:shadow-lg"
        onClick={() => goToHole(bestApproach.hole)}
      >
        <div className="flex flex-row">
          <div className="p-1 w-1/2">
            <div className="flex flex-col gap-2 border-r-2 border-dashed border-base-400">
              <div className="flex flex-row items-center">
                <MapPin className="size-6 text-primary" />
                <span className="text-lg font-bold px-1">Hole {bestApproach.hole}</span>
              </div>
            </div>
          </div>
          <div className="w-1/2 flex items-center justify-center">
            <span className="text-md font-bold px-1">{bestApproach.distance}m from {bestApproach.prevDistance}m</span>
          </div>
        </div>
      </div>
    </div>
  )
}
