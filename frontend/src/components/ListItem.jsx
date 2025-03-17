import { Goal } from "lucide-react";
import { Link } from "react-router-dom"

export default function ListItem({ name }) {
  return (
    <div className="w-full padding-y-3">
      <Link
        to="/"
        className="w-full h-12 bg-base-300 p-3 flex items-center gap-3 hover:bg-base-200 transition-colors"
      >
        {/* Icon */}
        <div className="relative mx-auto lg:mx-0 pt-2 pb-2">
          <div className="size-8 rounded-xl flex items-center justify-center bg-base-100">
            <Goal size={24} color="coral" />
          </div>
          
        </div>
        {/* name */}
        <div className="hidden lg:block text-left min-w-0">
          <div className="text-lg font-medium truncate">{name}</div>
        </div>
      </Link>
    </div>
  )
}
