import RoundCard from "./RoundCard";
import firebaseManager from "../../lib/firebase"
import { useEffect, useState } from "react"


export default function RoundsList() {

  const [rounds, setRounds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetching rounds on component load
  useEffect(() => {
    async function fetchRounds() {
      try {
        const roundData = await firebaseManager.getAllRounds()
        setRounds(roundData)
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchRounds()
  }, [])

  if (loading) {
    return (
      <div>
        Loading Rounds...
      </div>
    )
  }

  if (error) {
    return (
      <div>
        Error: {error}
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

  for (let i = 0; i < rounds.length; i++) {
    console.log(rounds[i].title)
    console.log(timeConverter(rounds[i].createdAt))
    console.log(rounds[i].score)
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
          <div className="flex-shrink-0 scroll-snap-align-start" key={index}>
            <RoundCard roundName={round.title} roundTime={timeConverter(round.createdAt)} roundScore={round.score}
            />
          </div>
        ))}
        {/* <div className="flex-shrink-0 scroll-snap-align-start">
          <RoundCard />
        </div>
        <div className="flex-shrink-0 scroll-snap-align-start">
          <RoundCard />
        </div>
        <div className="flex-shrink-0 scroll-snap-align-start">
          <RoundCard />
        </div>
        <div className="flex-shrink-0 scroll-snap-align-start">
          <RoundCard />
        </div>
        <div className="flex-shrink-0 scroll-snap-align-start">
          <RoundCard />
        </div>
        <div className="flex-shrink-0 scroll-snap-align-start">
          <RoundCard />
        </div> */}
      </div>
    </div>
  )
}
