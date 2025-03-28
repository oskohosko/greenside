export default function ScoreBox({ index, score, par }) {

  const getBorderStyle = (holeScore, holePar) => {
    // Without using enums I see no better way to do this
    // Double bogey or worse:
    if (holeScore > holePar + 1) {
      return "rounded-md border-2 border-info outline-2 outline-info outline-offset-1"
    } else if (holeScore === holePar + 1) {
      return "rounded-md outline-2 outline-info"
    } else if (holeScore === holePar - 1) {
      return "rounded-3xl outline-2 outline-accent"
    } else if (holeScore < holePar - 1) {
      return "rounded-3xl border-2 border-error outline-2 outline-error outline-offset-1"
    } else {
      return "border-2 border-base-100"
    }
  }

  return (
    <div className="card rounded-none aspect-square p-1 pointer-events-none">
      <div className={`aspect-square flex flex-col items-center pr-1 ${(index === 17 || index === 8) ? "border-none" : "border-r border-dashed border-base-400"}`}>
        {/* Top-left hole number and par */}
        <div className="absolute top-1 left-1">
          <p className="font-bold text-[9px]">Hole {index + 1}</p>
          <p className="font-medium text-[7px] leading-none">Par {par}</p>
        </div>

        {/* User's Score */}
        <div
          className={`
          flex justify-center items-center aspect-square w-3/5 mt-6
          ${getBorderStyle(score, par)}
        `}>
          <p className="font-medium text-2xl">{score}</p>
        </div>
      </div>
    </div>
  )
}
