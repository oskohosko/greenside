import { Menu } from "lucide-react"
import HoleScore from "../components/HoleScore"

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
      <div className="w-full h-16 flex justify-between pr-4.5 items-center">
        <h1 className="text-4xl font-bold pointer-events-none">
          Round Analysis
        </h1>
        <div className={`btn flex items-center justify-center p-0 bg-transparent border-2 border-base-100 hover:border-base-200`}>
          <Menu size={40} />
        </div>
      </div>
      {/* Content underneath */}
      <div className="card card-border overflow-hidden px-2 w-1/2">
        <h1 className="text-xl font-bold pointer-events-none border-b border-dashed border-base-200">
          Score
        </h1>
        <div className="p-1">
          <div className="card card-border w-full">
            <div className="grid grid-cols-9">
              {frontNine.map((_, idx) => (
                <div key={idx}>
                  <HoleScore index={idx}/>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-9 border-t-2 border-base-200/80">
              {backNine.map((_, idx) => (
                <div key={idx}>
                  <HoleScore index={idx} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
