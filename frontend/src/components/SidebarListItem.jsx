import { Goal, ChartNoAxesCombined, Map, LandPlot, Settings } from "lucide-react";
import { Link } from "react-router-dom"
import { useState } from "react"

export default function SidebarListItem({ name }) {
  // State for hovering UI changes
  const [hovered, setHovered] = useState(false)

  return (
    <div className="w-full padding-y-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
      // Routing based on what item this sidebar item is
        to={`${
          name === "rounds" ? "/rounds" :
          name === "analysis" ? "/analysis" :
          name === "courses" ? "/courses" :
          name === "plan" ? "/plan" :
          name === "settings" ? "/settings" :
          "/"
          }`}
        className="w-full h-12 bg-base-100 p-3 flex items-center gap-3 hover:bg-base-200 transition-colors duration-300"
      >
        {/* Icon */}
        <div className="relative mx-auto lg:mx-0 pt-2 pb-2">
          <div className={`size-8 rounded-xl flex items-center justify-center transition-colors duration-300 ${hovered ? "bg-base-100" : "bg-base-200"}`}>
            {name === "rounds" ? (
              <Goal size={24} className="text-base-600" />
            ) : name === "analysis" ? (
              <ChartNoAxesCombined size={24} className="text-base-600" />
            ) : name === "courses" ? (
              <Map size={24} className="text-base-600" />
            ) : name === "plan" ? (
              <LandPlot size={24} className="text-base-600" />
            ) : (
              <Settings size={24} className="text-base-600" />
            )
            }
          </div>
        </div>
        {/* name */}
        <div className="hidden lg:block text-left min-w-0">
          <div className="text-lg font-semibold truncate capitalize">{name}</div>
        </div>
      </Link>
    </div>
  )
}
