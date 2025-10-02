'use client';

import React, { ReactNode, useState, createContext, useContext, useEffect, useRef } from 'react';
import { Tooltip } from 'react-tooltip';
import { ChevronFirst, ChevronLast, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import SettingsModal from '@/components/settingModal';

// Types

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

type Theme = 'light' | 'dark' | 'pastel';

const getAvatarColors = (theme: Theme) => {
  switch (theme) {
    case 'dark':
      return { background: '334155', color: 'f8fafc' }; // avatar background + text colours
    case 'pastel':
      return { background: 'ffe4e6', color: '9d174d' }; 
    case 'light':
    default:
      return { background: 'afabbd', color: '3b3636' };
  }
};

const SidebarContext = createContext<SidebarContextType>({ expanded: false });

// Components

export default function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const { data: session } = useSession();
  const name = session?.user?.name ?? '';
  const currentUserId = session?.user?.id ?? '';
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Detecting theme
  const detectTheme = (): Theme => {
    const cls = document.documentElement.classList;
    if (cls.contains('theme-dark')) return 'dark';
    if (cls.contains('theme-pastel')) return 'pastel';
    return 'light';
  };

  useEffect(() => {
    // Initial read
    setTheme(detectTheme());

    // React to future changes (e.g., user toggles theme)
    const observer = new MutationObserver(() => setTheme(detectTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const firstLetter = (name?.[0] || 'L').toUpperCase();
  const { background, color } = getAvatarColors(theme);
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    firstLetter
  )}&background=${background}&color=${color}&bold=true`;

  // Resize UX 
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

  const toggleSidebar = () => setExpanded((prev) => !prev);

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
    <div
      ref={dropdownRef}
      className="relative flex items-center justify-between px-3 py-1.5 mt-2"
    >
      {/* Profile button */}
      <button
        onClick={() => {
          if (!currentUserId) return;
          setDropdownOpen(!dropdownOpen);
        }}
        aria-expanded={dropdownOpen && !!currentUserId}
        disabled={!currentUserId}
        className={`flex items-center pl-1 pr-3 py-1.5 rounded-md text-sm
          ${currentUserId 
            ? 'cursor-pointer hover:bg-sidebar-hover aria-expanded:bg-sidebar-hover' 
            : 'cursor-not-allowed opacity-50'}`}
      >
        <Image
          src={avatarUrl}
          alt="User Avatar"
          width={32}
          height={32}
          className="rounded-md w-7 h-7 mr-4 flex-shrink-0"
          unoptimized
        />

        {expanded && (
          <div className="flex items-center gap-1.5 whitespace-nowrap overflow-hidden">
            <h4 className="font-medium truncate text-activeTextColor text-base">
              {name || 'Login'}
            </h4>
            <MoreVertical size={12} />
          </div>
        )}
      </button>

      {/* Dropdown */}
      {dropdownOpen && (
        <div className="absolute left-3 mt-28 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 text-sm">
          <button
            onClick={() => {
              setDropdownOpen(false);
              setSettingsOpen(true);
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-gray-100"
          >
            Settings
          </button>
          <button
            onClick={() => signOut()}
            className="block w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      )}

      {/* Sidebar toggle */}
      <button
        aria-label="Toggle sidebar"
        aria-expanded={expanded}
        onClick={() => setExpanded(!expanded)}
        className="p-1 rounded-md hover:bg-sidebar-hover text-textColor cursor-pointer"
      >
        {expanded ? <ChevronFirst size={20} /> : <ChevronLast size={20} />}
      </button>
    </div>

    <SidebarContext.Provider value={{ expanded }}>
      <ul className="flex-1 flex-col gap-y-1">{children}</ul>
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
          className="relative h-screen shrink-0 transition-all duration-300"
          style={{ width: expanded ? '17rem' : '6rem' }}
        >
          {sidebarContent}
        </aside>
      )}

      {/* Settings modal */}
      {settingsOpen && <SettingsModal onClose={() => setSettingsOpen(false)} />}
    </>
  );
}

// SIdebarItems 

export function SidebarItem({ icon, text, active, alert }: SidebarItemProps) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`group relative flex items-center w-full py-1.5 px-3 font-medium rounded-md cursor-pointer transition-colors
        ${active ? 'bg-sidebar-active text-activeTextColor' : 'hover:bg-sidebar-hover text-gray-600'}`}
    >
      {/* icon color switches with `active` */}
      <div
        className={`flex-shrink-0 flex items-center justify-center w-8 h-8
          ${active ? 'text-activeTextColor' : 'text-inactiveTextColor'}`}
      >
        {icon}
      </div>

      <span
        className={`
          whitespace-nowrap text-base
          ${active ? 'text-activeTextColor' : 'text-inactiveTextColor'}
          transition-all duration-200 ease-in-out
          ${expanded ? 'opacity-100 ml-3 translate-x-0' : 'opacity-0 ml-0 -translate-x-2'}
        `}
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
