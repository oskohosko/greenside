import { useRoundStore } from "../../store/useRoundStore"
import ScoreBox from "./ScoreBox"
import ScoreBoxSkeleton from "../skeletons/ScoreBoxSkeleton"

export default function ScoreTable() {

  const { isScoreLoading, roundHoles, courseHoles } = useRoundStore()

  const scores = roundHoles.map(hole => hole.score)

  const frontNine = scores.slice(0, 9)
  const backNine = scores.slice(9, 18)

  // Presenting a skeleton if the scores are loading
  if (isScoreLoading) {
    return (
      <div className="sm:w-full md:w-3/4 lg:w-[700px] mt-2 mb-2 transition-all duration-300">
        <h1 className="text-xl font-bold pointer-events-none">
          Score
        </h1>
        <div className="card card-border w-full bg-base-100 border-2 border-base-300">
          <div className="grid grid-cols-9 pb-1">
            {Array.from({ length: 9 }).map((_, idx) => (
              <ScoreBoxSkeleton key={idx} index={idx} />
            ))}
          </div>
          <div className="grid grid-cols-9 border-t-2 border-base-300 pb-1">
            {Array.from({ length: 9 }).map((_, idx) => (
              <ScoreBoxSkeleton key={idx} index={idx} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="sm:w-full md:w-3/4 lg:w-[700px] mt-2 mb-2 transition-all duration-300">
      <h1 className="text-xl font-bold pointer-events-none">
        Score
      </h1>
      <div className="card card-border w-full bg-base-100 border-2 border-base-300">
        <div className="grid grid-cols-9 pb-1">
          {frontNine.map((_, idx) => (
            <div key={idx}>
              <ScoreBox index={idx} score={scores[idx]} par={courseHoles[idx].par} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-9 border-t-2 border-base-300 pb-1">
          {backNine.map((_, idx) => (
            <div key={idx}>
              <ScoreBox index={idx} score={scores[idx + 9]} par={courseHoles[idx + 9].par} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
