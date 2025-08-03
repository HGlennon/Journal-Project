'use client';

import { ReactNode, useState, createContext, useContext, useEffect } from 'react';
import { Tooltip } from 'react-tooltip'
import { ChevronFirst, ChevronLast, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';


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
// lol
const SidebarContext = createContext<SidebarContextType>({ expanded: false });

export default function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();
  const name = session?.user?.name;
  

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 600;
      setIsMobile(mobile);
      setExpanded(!mobile); // collapse on mobile, expand on desktop
    };

    handleResize(); // Initial mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setExpanded(prev => !prev);

  const sidebarContent = (
    <nav className="h-full flex flex-col bg-gray-400 border-r border-gray-400 shadow-sm">
      <div className="p-4 pb-2 flex justify-between items-center">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-3 px-3 py-2 hover:bg-indigo-100 rounded-md cursor-pointer"
        >
          <Image
              src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true"
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-md"
              unoptimized
            />
            {expanded && (
              <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
                <h4 className="font-semibold truncate">{name}</h4>
                <MoreVertical size={14} />
              </div>
            )}
            {dropdownOpen && (
              <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Settings
                </button>
                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                >
                  Logout
                </button>
              </div>
            )}
            </button>
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
  );
  
  return (
    <>
      {/* Mobile open button */}
      {isMobile && !expanded && (
        <button
          aria-label="Open sidebar"
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-gray-200 p-1.5 rounded-lg hover:bg-gray-300 cursor-pointer"
        >
          <ChevronLast size={22} />
        </button>
      )}

      {/* Mobile sidebar (overlay) */}
      {isMobile && expanded && (
        <aside className="fixed top-0 left-0 h-screen w-64 z-50">
          {sidebarContent}
        </aside>
      )}

      {/* Desktop sidebar (always rendered, collapsible width) */}
      {!isMobile && (
        <aside
          className={`relative h-screen shrink-0 transition-all duration-300`}
          style={{ width: expanded ? '20rem' : '8rem' }} // 64px or 256px
        >
          {sidebarContent}
        </aside>
      )}
    </>
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
