import { Crosshair, Trophy } from "lucide-react";
import { useRoundStore } from "../../store/useRoundStore";
import { useEffect, useState } from "react";

export default function Insights() {

  const { getInsights, isInsightsLoading, shots, roundHoles } = useRoundStore()

  const [longestDrive, setLongestDrive] = useState({ distance: 0, hole: null })
  const [bestApproach, setBestApproach] = useState({ ratio: Infinity, distance: 0, prevDistance: 0, hole: null })

  useEffect(() => {
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

  if (isInsightsLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className="card rounded-2xl bg-base-100 pt-1 px-3 pb-2 w-[350px] lg:w-[400px] transition-all duration-300 overflow-y-auto max-h-[750px]">
      <div className="flex flex-row items-center gap-1 mb-1">
        <Trophy className="size-5 text-yellow-300" />
        <h2 className="text-xl font-bold ml-1">
          Longest Drive
        </h2>

      </div>
      <div className="card bg-base-200 mb-2 p-2 rounded-xl">
        <div className="flex flex-col">
          <h1>{longestDrive.distance}m</h1>
          <h1>{longestDrive.hole}</h1>
        </div>
      </div>

      <div className="flex flex-row items-center gap-1 mb-1">
        <Crosshair className="size-5 text-red-300" />
        <h2 className="text-xl font-bold ml-1">
          Best Approach
        </h2>
      </div>
      <div className="card bg-base-200 mb-2 p-2 rounded-xl">
        <div className="flex flex-col">
          <h1>{bestApproach.distance}m</h1>
          <h1>{bestApproach.prevDistance}m</h1>
          <h1>{bestApproach.hole}</h1>
        </div>
      </div>
    </div>
  )
}
