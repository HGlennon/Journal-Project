'use client';

import { ReactNode, useState, createContext, useContext, useEffect } from 'react';
import { Tooltip } from 'react-tooltip'
import { ChevronFirst, ChevronLast, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRef } from 'react';
import SettingsModal from '@/components/settingModal';


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
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { data: session } = useSession();
  const name = session?.user?.name;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const firstLetter = name ? name.charAt(0) : '';  

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 600;
      setIsMobile(mobile);
      setExpanded(!mobile);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setExpanded(prev => !prev);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  if (dropdownOpen) {
    document.addEventListener('mousedown', handleClickOutside);
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
  }

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
  }, [dropdownOpen]);

  const sidebarContent = (
    <nav className="h-full flex flex-col bg-sidebar">
      <div ref={dropdownRef} className="relative p-4 pb-2 flex justify-between items-center">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
          className="flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer hover:bg-sidebar-hover aria-expanded:bg-sidebar-hover"
        >
          <Image
            src={`https://ui-avatars.com/api/?name=${firstLetter}&background=c7d2fe&color=3730a3&bold=true`}
            alt="User Avatar"
            width={32}
            height={32}
            className="rounded-md"
            unoptimized
          />

          {expanded && (
            <div className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
              <h4 className="font-semibold truncate text-activeTextColor">{name}</h4>
              <MoreVertical size={14} />
            </div>
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute left-4 mt-31 w-73 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <button
              onClick={() => {
                setDropdownOpen(false);
                setSettingsOpen(true);
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
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
        <button
          aria-label="Toggle sidebar"
          aria-expanded={expanded}
          onClick={() => setExpanded(!expanded)}
          className="p-1.5 rounded-lg hover:bg-sidebar-hover text-textColor cursor-pointer"
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
          className="fixed top-4 left-4 z-50 p-1.5 rounded-lg hover:bg-sidebar-hover cursor-pointer"
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
          style={{ width: expanded ? '17rem' : '8rem' }} // 64px or 256px
        >
          {sidebarContent}
        </aside>
      )}

      
    {/* Settings modal goes here */}
    {settingsOpen && (
      <SettingsModal onClose={() => setSettingsOpen(false)} />
    )}

    </>
  );
}

export function SidebarItem({ icon, text, active, alert }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`group relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors
        ${active ? 'bg-sidebar-active text-activeTextColor' : 'hover:bg-sidebar-hover text-gray-600'}`}
    >
      {/* color lives here and switches with `active` */}
      <div
        className={`flex-shrink-0 flex items-center justify-center w-8 h-8
          ${active ? 'text-activeTextColor' : 'text-inactiveTextColor'}`}
      >
        {icon}
      </div>

      <span className={`overflow-hidden transition-all duration-300 ease-in-out text-nowrap ${expanded ? 'w-52 ml-3' : 'w-0 ml-0'}`}>
        {text}
      </span>

      {alert && (
        <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? '' : 'top-2'}`} />
      )}

      {!expanded && (
        <Tooltip id={text} place="right" className="tooltip-style" delayShow={300} delayHide={100} />
      )}
    </li>
  );
}

