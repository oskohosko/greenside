import HoleMap from "./HoleMap";

// Detail view of the hole including the map and score
export default function HoleDetail() {
  return (
    <div className="card card-border rounded-lg border-2 w-[200px] h-[450px]">

      <h1 className="font-medium">Hole 1</h1>
      <div className="h-[300px] w-[175px] rounded-lg overflow-hidden">
        <HoleMap />
      </div>
    </div>
  )
}
