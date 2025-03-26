import HoleMap from "./HoleMap";

// Detail view of the hole including the map and score
export default function HoleDetail() {
  return (
    <div className="card card-border rounded-2xl border-2 border-base-300 pt-1 px-2 pb-2 w-[180px] bg-base-100">
      <p className="font-semibold text-lg">Hole 1</p>
      <p className="font-medium text-sm/2 pb-2">Par 4</p>
      <div className="h-[300px] w-full rounded-lg overflow-hidden">
        <HoleMap />
      </div>
    </div>
  )
}
