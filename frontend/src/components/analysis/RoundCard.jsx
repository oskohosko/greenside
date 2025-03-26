export default function RoundCard({ roundName, roundTime, roundScore  }) {

  return (
    <div className="card card-border border-2 border-base-300 rounded-xl w-[200px] h-[110px] bg-base-100 cursor-pointer">
      <div className="flex flex-row h-full">
        {/* Title */}
        <div className="h-full w-3/5 pt-2 pb-2">
          <div className="flex flex-col justify-between border-r-2 border-base-400 border-dashed h-full pl-2">
            <p className="font-medium text-sm">{roundName}</p>
            <p className="font-medium text-xs text-base-600">{roundTime}</p>
          </div>
        </div>
        {/* Score */}
        <p className="flex items-center justify-center font-bold text-4xl p-1 w-2/5">{roundScore}</p>
        {/* Time */}
      </div>


    </div>
  )
}
