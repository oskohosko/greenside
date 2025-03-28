import { useRoundStore } from "../../store/useRoundStore"
import HoleMap from "./HoleMap"



export default function HolesList() {

  const { courseHoles, roundHoles, isHolesLoading } = useRoundStore()

  if (isHolesLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className="sm:w-full md:w-3/4 lg:w-[700px] mt-2 mb-2 transition-all duration-300">
      <h1 className="text-xl font-bold pointer-events-none mb-1">Hole by hole</h1>
      <div className="flex overflow-x-auto space-x-2 pb-4">
        {courseHoles?.map(hole => (
          <div className="card card-border rounded-2xl border-2 border-base-300 pt-1 px-2 pb-2 w-[180px] bg-base-100">
            <p className="font-semibold text-lg">Hole {hole.num}</p>
            <p className="font-medium text-sm/2 pb-2">Par {hole.par}</p>
            <div className="h-[300px] w-[160px] rounded-lg overflow-hidden">
              <HoleMap teeLat={hole.tee_lat} teeLng={hole.tee_lng} greenLat={hole.green_lat} greenLng={hole.green_lng} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
