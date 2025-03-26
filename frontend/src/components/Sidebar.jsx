import SidebarListItem from "./SidebarListItem";


export default function Sidebar() {
  return (
    <div className="bg-base-100 fixed top-16 bottom-0 sm:w-16 lg:w-40 flex flex-col transition-all duration-300 border-r-2 border-base-300">
      {/* List items */}
      <SidebarListItem name="rounds" />
      <SidebarListItem name="analysis" />
      <SidebarListItem name="courses" />
      <SidebarListItem name="plan" />

      {/* Settings down the bottom */}
      <div className="flex-grow"></div>
      <SidebarListItem name="settings" />
    </div>
  )
}
