import { Link } from 'react-router-dom'
import { CircleUserRound, Flag, LandPlot } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {

  const [hovered, setHovered] = useState(false)

  return (
    <header
      className="bg-base-300 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-11/80">
      <div className="px-4 h-16">
        <div className="flex items-center h-full w-full">
          <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-10 rounded-2xl bg-primary/30 flex items-center justify-center">
              <Flag className="size-6 text-primary" />
              {/* <LandPlot className="size-7 text-primary" /> */}
            </div>
            <h1 className="text-2xl font-bold">Greenside.</h1>
          </Link>
          {/* Right section of the navbar */}
          <div className="flex items-center h-full w-full">
            {/* Profile Section */}
            <div
              className="ml-auto mr-3"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Link
                to="/profile"
                className={`flex items-center bg-primary/30 rounded-3xl p-1 transition-all duration-100 ${hovered ? "w-48 justify-start pl-3" : "w-12 justify-center"
                  }`}
              >
                {/* User Icon - Stays Centered Initially, Moves Left on Hover */}
                <div className="flex items-center justify-center w-10 h-10">
                  <CircleUserRound className="size-9 text-primary" strokeWidth={1.6} />
                </div>

                {/* Username - Appears with Opacity and Expands */}
                <span
                  className={`text-lg font-medium overflow-hidden whitespace-nowrap transition-all duration-800 ${hovered ? "opacity-100 max-w-full ml-2" : "opacity-0 w-0 ml-0"
                    }`}
                >
                  Oskar Hosken
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}