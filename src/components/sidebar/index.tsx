'use client';

import { ReactNode, useState, createContext, useContext } from 'react';
import { Tooltip } from 'react-tooltip'
import { ChevronFirst, ChevronLast, MoreVertical } from 'lucide-react';

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
}

interface SidebarProps {
  children: ReactNode;
}

interface SidebarContextType {
  expanded: boolean;
}

const SidebarContext = createContext<SidebarContextType>({ expanded: false });

export default function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r border-indigo-500 shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
<div className="flex items-center space-x-3 px-3 py-2 hover:bg-indigo-100 rounded-md cursor-pointer">
  <img
    src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
    alt="User Avatar"
    className="w-8 h-8 rounded-md"
  />
  {expanded && (
    <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
      <h4 className="font-semibold truncate">Harrison Glennon</h4>
      <MoreVertical size={14} />
    </div>
  )}
</div>
          <button
            aria-label="Toggle sidebar"
            aria-expanded={expanded}
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
          >
            {expanded ? <ChevronFirst size={22} /> : <ChevronLast size={22} />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, active, alert }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`group relative flex items-center py-2 px-3 my-1 
        font-medium rounded-md cursor-pointer 
        transition-colors 
        ${
          active
            ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
            : 'hover:bg-indigo-50 text-gray-600'
        }`}
    >
      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 text-indigo-600">
        {icon}
      </div>
<span
  className={`overflow-hidden transition-all duration-300 ease-in-out text-nowrap ${
    expanded ? 'w-52 ml-3' : 'w-0 ml-0'
  }`}
>
  {text}
</span>


      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? '' : 'top-2'
          }`}
        />
      )}
      {/* Use google tooltips instead */}
      {!expanded && (
        <Tooltip 
          id={text} 
          place="right" 
          className="tooltip-style"
          delayShow={300}
          delayHide={100}
        />
      )}
    </li>
  );
}
