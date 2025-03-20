export default function HoleScore({ index }) {
  // test hole for UI purposes
  const testHole = {
    "num": "1",
    "par": 4,
    "distance": "300m",
    "score": 4
  }

  // Design depending on the score
  // 2 borders - double bogey and worse
  // 1 border - bogey
  // No border - Par
  // 1 circle - birdie
  // 2 circles - eagle and better

  const getBorderStyle = (score, par) => {
    // Without using enums I see no better way to do this

    // Double bogey or worse:
    if (score > par + 1) {
      //TODO Add 2 borders
      return "rounded-md border-2 border-base-200"
    } else if (score === par + 1) {
      return "rounded-md border-2 border-base-200"
    } else if (score === par - 1) {
      return "rounded-3xl border-2 border-base-200"
    } else if (score < par - 1) {
      //TODO Add 2 borders
      return "rounded-3xl border-2 border-base-200"
    } else {
      return "border-none"
    }
  }

  return (
    <div className="card rounded-none aspect-square p-1">
      <div className={`aspect-square flex flex-col items-center pr-1 ${(index === 17 || index === 8) ? "border-none" : "border-r border-dashed border-base-200"}`}>
        {/* Top-left hole number & par */}

        <div className="absolute top-1 left-1">
          <p className="font-bold text-[9px]">Hole {testHole.num}</p>
          <p className="font-medium text-[7px] leading-none">Par {testHole.par}</p>
        </div>

        {/* User's Score (Centered) */}
        <div
          className={`
          flex justify-center items-center aspect-square w-3/5 mt-6
          ${getBorderStyle(testHole.score, testHole.par)}
        `}>
          <p className="font-medium text-2xl">{testHole.score}</p>
        </div>
      </div>
    </div>
  )
}
