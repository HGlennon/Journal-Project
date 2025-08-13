'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaEnvelope, FaCalendarDays } from "react-icons/fa6";
import { SiTicktick } from "react-icons/si";
import { SidebarItem } from "@/components/sidebar/sidebar";
import  CalendarDateIcon from "@/components/CalendarIcon"; // Ensure this import is correct


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
