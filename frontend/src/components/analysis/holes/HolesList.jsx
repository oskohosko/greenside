import { useRoundStore } from "../../../store/useRoundStore"
import HoleCardSkeleton from "../../skeletons/HoleCardSkeleton"
import HoleCard from "./HoleCard"

export default function HolesList() {

  const { courseHoles, isHolesLoading, setSelectedHole } = useRoundStore()

  // Presenting a skeleton if it is loading
  if (isHolesLoading) {
    return (
      <HoleCardSkeleton courseHoles={courseHoles} />
    )
  }

  return (
    <div className="w-full mt-2 mb-2 transition-all duration-300">
      <h1 className="text-xl font-bold pointer-events-none mb-1">Hole by hole</h1>
      <div className="flex overflow-x-auto space-x-2 pb-4">
        {/* Mapping every hole to their respective map including their shots */}
        {courseHoles?.map(hole => (
          <HoleCard hole={hole} key={hole.num} />
        ))}
      </div>
    </div>
  )
}
