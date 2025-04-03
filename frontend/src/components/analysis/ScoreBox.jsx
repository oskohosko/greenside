import { getBorderStyle } from "../../utils/utils"

export default function ScoreBox({ index, score, par }) {

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
