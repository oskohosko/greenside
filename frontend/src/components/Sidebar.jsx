import { Goal } from "lucide-react";
import { Link } from "react-router-dom";

import ListItem from "./ListItem";


export default function Sidebar() {
  return (
    <div className="bg-base-300 fixed mt-16 h-full sm:w-16 lg:w-40 flex flex-col transition-all duration-300">
      {/* List items */}
      <ListItem name="Item 1" />
    </div>
  )
}
