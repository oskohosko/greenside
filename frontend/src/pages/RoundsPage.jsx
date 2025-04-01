import { Info } from "lucide-react";

export default function RoundsPage() {
  return (

    <div className={`card card-border border-2 rounded-xl w-[150px] h-[80px] bg-base-100 border-base-300 pointer-events-none
      `}>
      <div className="flex flex-row h-full">
        {/* Shot info */}
        <div className="h-full w-2/5 pt-2 pb-2">
          <div className="flex flex-col justify-between border-r-2 border-base-400 border-dashed h-full pl-2">
            <p className="font-bold text-xs text-neutral pt-1">Shot 3</p>
            <div className="ml-2 mb-1 text-primary"><Info /></div>
          </div>
        </div>
        {/* Distances */}
        <div className="flex flex-col w-3/5 p-1">
          <div className="h-1/2 flex flex-col">
            <p className="font-medium text-[10px]">To pin:</p>
            <p className="font-bold text-lg/4 mr-0 ml-3">130m</p>
          </div>
          <div className="h-1/2 flex flex-col">
            <p className="font-medium text-[10px]">Last shot:</p>
            <p className="font-bold text-lg/4 mr-0 ml-3">250m</p>
          </div>
        </div>
      </div>
    </div>


  )
}
