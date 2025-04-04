import { useRoundStore } from "../../store/useRoundStore"
import { haversineDistance, getBorderStyle } from "../../utils/utils"
import { Flag } from "lucide-react"
import HoleMap from "../analysis/holes/HoleMap"
import { useState } from "react"

export default function LargeHoleCard({ hole, selectedShotIndex, setSelectedShotIndex }) {

  const { roundHoles } = useRoundStore()

  const [isSatellite, setIsSatellite] = useState(false)

  const playedHole = roundHoles[hole.num - 1]

  return (
    <div className="card rounded-2xl pt-1 px-2 pb-2 w-[300px] bg-base-100" >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-2xl px-1">Par {hole.par}</p>
          <div className="flex flex-row items-center px-1 gap-2 pb-1">
            <div className="size-6 flex items-center justify-center bg-error/40 rounded-xl">
              <Flag strokeWidth={3} className="size-4 text-error" />
            </div>
            <p className="font-bold text-xl">
              {Math.round(haversineDistance(
                { latitude: hole.tee_lat, longitude: hole.tee_lng },
                { latitude: hole.green_lat, longitude: hole.green_lng }
              ))}m
            </p>
          </div>
        </div>
        <div className={`flex justify-center items-center aspect-square w-[40px] mr-1 
          ${getBorderStyle(playedHole.score, hole.par)}
          ${(playedHole.score !== hole.par + 2 && playedHole.score !== hole.par) ? "outline-3" : ""}`} >
          <h2 className="text-4xl font-medium">
            {playedHole.score}
          </h2>
        </div>
      </div>

      <div className="h-[540px] w-[280px] rounded-lg overflow-hidden">
        <HoleMap
          hole={hole}
          interactive={true}
          selectedShotIndex={selectedShotIndex}
          setSelectedShotIndex={setSelectedShotIndex}
          isSatellite={isSatellite}
          setIsSatellite={setIsSatellite}
          />
      </div>
      <div className="flex flex-col gap-2 mt-2 pl-1">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            className={`toggle toggle-sm text-base-300 ${isSatellite ? 'text-primary' : ''} transition-all duration-300`}
            checked={isSatellite}
            onChange={() => {
              setIsSatellite(!isSatellite)
            }}>
          </input>
          <span className="text-sm font-semibold">
            Satellite
          </span>
        </label>
      </div>
    </div>
  )
}
