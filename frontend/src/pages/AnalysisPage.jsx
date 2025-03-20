import { Menu } from "lucide-react"
import HoleScore from "../components/HoleScore"
import HoleMap from "../components/HoleMap"

export default function AnalysisPage() {

  const testRound = {
    "holes": "18",
    "scores": [],
    "finalScore": "77"
  }

  const round = Array(Number(testRound.holes)).fill(null)

  const frontNine = round.slice(0, 9)
  const backNine = round.slice(9, 18)

  return (
    <div className="flex flex-col w-full">
      {/* Title section */}
      <div className="w-full h-16 flex justify-between pr-4.5 items-center border-b-2 border-dashed border-base-200">
        <h1 className="text-4xl font-bold pointer-events-none">
          Round Analysis
        </h1>
        <div className={`btn flex items-center justify-center p-0 bg-transparent border-2 border-base-100 hover:border-base-200`}>
          <Menu size={40} />
        </div>
      </div>
      {/* Content underneath */}
      <div className="card overflow-hidden sm:w-full md:w-3/4 lg:w-[700px] mt-2 mb-2 transition-all duration-300">
        <h1 className="text-xl font-bold pointer-events-none">
          Score
        </h1>
        <div className="card card-border w-full ">
          <div className="grid grid-cols-9 pb-1">
            {frontNine.map((_, idx) => (
              <div key={idx}>
                <HoleScore index={idx} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-9 border-t-2 border-base-200/80 pb-1">
            {backNine.map((_, idx) => (
              <div key={idx}>
                <HoleScore index={idx} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Hole by hole section with map of each hole */}
      <h1 className="text-xl font-bold pointer-events-none mb-1">Hole by hole</h1>
      <div className="h-full w-full">
        <HoleMap />
      </div>

    </div>
  )
}
