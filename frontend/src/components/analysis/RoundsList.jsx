import RoundCard from "./RoundCard";
import { useRoundStore } from "../../store/useRoundStore";
import { useEffect } from "react"
import { timeConverter } from "../../utils/utils";


export default function RoundsList() {

  const { getAllRounds, rounds, isRoundsLoading, selectedRound, setSelectedRound, resetShots } = useRoundStore()

  // Fetching rounds on component load
  useEffect(() => {
    getAllRounds()
  }, [getAllRounds])

  if (isRoundsLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  function toggleSelectedRound(round) {
    if (selectedRound !== round) {
      setSelectedRound(round)
      // resetting for now will optimise later
      resetShots()
    }
  }

  return (
    <div className="sm:w-full md:w-3/4 lg:w-[700px] mt-2 mb-2 transition-all duration-300">
      <h1 className="text-xl font-bold pointer-events-none">
        Rounds
      </h1>
      <div
        className="flex overflow-x-auto space-x-2 pb-4"
      >
        {rounds.map((round, index) => (
          <button
            key={index}
            onClick={() => toggleSelectedRound(round)}
            className="text-left"
          >
            <div className="flex-shrink-0 scroll-snap-align-start">
              <RoundCard roundName={round.title} roundTime={timeConverter(round.createdAt)} roundScore={round.score}
              />
            </div>
          </button>

        ))}
      </div>
    </div>
  )
}
