'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaEnvelope, FaCalendarDays } from "react-icons/fa6";
import { SiTicktick } from "react-icons/si";
import { SidebarItem } from "@/components/sidebar";
import CalendarDateIcon from "./calendar-icon";

export default function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <>      
      <Link 
        href="/inbox" 
        aria-label="Inbox"
        data-tooltip-id="Inbox"
        data-tooltip-content="Inbox"
      >
        <SidebarItem icon={<FaEnvelope size={20} className={pathname === "/inbox" ? "text-blue-600" : "text-gray-600"}/>} text="Inbox" active={pathname === "/inbox"} />
      </Link>
      
      <Link 
        href="/today" 
        aria-label="Today"
        data-tooltip-id="Today"
        data-tooltip-content="Today"
      >
        <SidebarItem icon={<CalendarDateIcon />} text="Today" active={pathname === "/today"} />
      </Link>
      
      <Link 
        href="/upcoming" 
        aria-label="Upcoming"
        data-tooltip-id="Upcoming"
        data-tooltip-content="Upcoming"
      >
        <SidebarItem icon={<FaCalendarDays size={20} className={pathname === "/upcoming" ? "text-blue-600" : "text-gray-600"}/>} text="Upcoming" active={pathname === "/upcoming"} />
      </Link>
      
      <Link 
        href="/completed" 
        aria-label="Completed"
        data-tooltip-id="Completed"
        data-tooltip-content="Completed"
      >
        <SidebarItem icon={<SiTicktick size={20} className={pathname === "/completed" ? "text-blue-600" : "text-gray-600"}/>} text="Completed" active={pathname === "/completed"} />
      </Link>
    </>
  );
}
