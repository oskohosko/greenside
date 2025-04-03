import { Menu } from "lucide-react"
import RoundsList from "../components/analysis/RoundsList"
import { useRoundStore } from "../store/useRoundStore"
import HolesList from "../components/analysis/holes/HolesList"
import ScoreTable from "../components/analysis/ScoreTable"

export default function AnalysisPage() {

  const { roundHoles } = useRoundStore()

  const scores = roundHoles.map(hole => hole.score)

  return (
    <div className="flex flex-col w-full h-full">
      {/* Title section */}
      <div className="w-full h-16 flex justify-between pr-4.5 items-center border-b-2 border-dashed border-base-400">
        <h1 className="text-4xl font-bold pointer-events-none">
          Round Analysis
        </h1>
        <div className={`btn flex items-center justify-center p-0 bg-transparent border-2 border-base-200 hover:border-base-300`}>
          <Menu size={40} />
        </div>
      </div>
      {/* Rounds Section */}
      <RoundsList />
      {/* Score section */}
      <ScoreTable />
      {/* Hole by hole section with map of each hole */}
      <HolesList />
    </div>
  )
}
