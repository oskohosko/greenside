import { Menu } from "lucide-react"
import ScoreBox from "../components/analysis/ScoreBox"
import HoleDetail from "../components/analysis/HoleDetail"
import RoundsList from "../components/analysis/RoundsList"

export default function AnalysisPage() {

  const testRound = {
    "holes": "18",
    "scores": [5, 6, 3, 2, 5, 4, 3, 4, 4, 3, 3, 4, 5, 4, 4, 5, 6, 5],
    "finalScore": "77"
  }

  const frontNine = testRound.scores.slice(0, 9)
  const backNine = testRound.scores.slice(9, 18)

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
      <div className="sm:w-full md:w-3/4 lg:w-[700px] mt-2 mb-2 transition-all duration-300">
        <h1 className="text-xl font-bold pointer-events-none">
          Score
        </h1>
        <div className="card card-border w-full bg-base-100 border-2 border-base-300">
          <div className="grid grid-cols-9 pb-1">
            {frontNine.map((_, idx) => (
              <div key={idx}>
                <ScoreBox index={idx} score={testRound.scores[idx]} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-9 border-t-2 border-base-300 pb-1">
            {backNine.map((_, idx) => (
              <div key={idx}>
                <ScoreBox index={idx} score={testRound.scores[idx + 9]} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Hole by hole section with map of each hole */}
      <h1 className="text-xl font-bold pointer-events-none mb-1">Hole by hole</h1>
      <HoleDetail />
    </div>
  )
}
