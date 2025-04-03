import LazyHoleMap from "./LazyHoleMap"
import { useRoundStore } from "../../../store/useRoundStore"
import { useNavigate } from "react-router-dom"

export default function HoleCard({ hole }) {

  const navigate = useNavigate()

  // Getting score from round store
  const { roundHoles, selectedRound, setSelectedHole } = useRoundStore()

  // Getting the score
  const score = roundHoles.map(hole => hole.score)[hole.num - 1]

  // Score classification object for our badge
  const scoreClassification = {
    "3": { badge: "bg-blue-500/30", score: "Double Bogey+" },
    "2": { badge: "bg-blue-500/40", score: "Double Bogey" },
    "1": { badge: "bg-blue-500/50", score: "Bogey" },
    "0": { badge: "bg-gray-300", score: "Par" },
    "-1": { badge: "bg-red-500/50", score: "Birdie" },
    "-2": { badge: "bg-green-500/50", score: "Eagle" },
    "-3": { badge: "bg-yellow-500/50", score: "Albatross" },
  }

  // Helper function to classify the score
  const classifyScore = (score) => {
    const par = hole.par
    const scoreToPar = score - par

    return scoreClassification[`${scoreToPar}`]
  }

  const { badge, score: scoreLabel } = classifyScore(score)

  const handleClick = (hole) => {
    // Setting selected hole to this one
    setSelectedHole(hole)
    // Navigating to round page
    navigate(`/round/${selectedRound.id}/hole/${hole.num}`);
  };

  return (
    <div
      className="card card-border rounded-2xl border-2 border-base-300 pt-1 px-2 pb-2 w-[180px] bg-base-100 cursor-pointer"
      onClick={() => handleClick(hole)}
      >
      <p className="font-semibold text-lg">Hole {hole.num}</p>
      <p className="font-medium text-sm/2 pb-2">Par {hole.par}</p>
      <div className="h-[300px] w-[160px] rounded-lg overflow-hidden">
        <LazyHoleMap hole={hole} />
      </div>
      <div className="flex flex-row justify-between px-1">
        <p className="font-medium text-xs mt-1">Score: {score}</p>
        {/* Classifying the score for the badge */}
        <div className={`mt-1 badge badge-xs border-none ${badge}`}>{scoreLabel}</div>
      </div>
    </div>
  )
}
