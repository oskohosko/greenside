export default function ScoreBoxSkeleton({ index }) {
  return (
    <div className="card rounded-none aspect-square p-1 pointer-events-none">
      <div className={`aspect-square flex flex-col items-center pr-1 border-r border-dashed border-base-40 ${(index === 17 || index === 8) ? "border-none" : "border-r border-dashed border-base-400"}`}>
        {/* Top-left hole number and par */}
        <div className="absolute top-1 left-1">
          <div className="bg-base-200 h-3 w-10 rounded-sm mb-1"></div>
          <div className="bg-base-200 h-2 w-6 rounded-sm"></div>
        </div>

        {/* Placeholder for User's Score */}
        <div className="flex justify-center items-center aspect-square w-3/5 mt-6 bg-base-200 rounded-md">
          <div className="bg-base-200 h-6 w-6 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
