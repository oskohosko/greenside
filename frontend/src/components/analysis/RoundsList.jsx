import RoundCard from "./RoundCard";
import firebaseManager from "../../lib/firebase"
import { useRoundStore } from "../../store/useRoundStore";
import { useEffect, useState } from "react"


export default function RoundsList() {

  const { getRounds, rounds, isRoundsLoading, selectedRound, setSelectedRound } = useRoundStore()

  // Fetching rounds on component load
  useEffect(() => {
    getRounds()
  }, [getRounds])

  if (isRoundsLoading) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  function timeConverter(timestamp) {
    var a = new Date(timestamp * 1000)
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var month = months[a.getMonth()]
    var date = a.getDate()
    var time = month + ' ' + date
    return time
  }

  function toggleSelectedRound(round) {
    // If we already have a selected round, reset it.
    if (selectedRound === round) {
      setSelectedRound(null)
    } else {
      setSelectedRound(round)
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
