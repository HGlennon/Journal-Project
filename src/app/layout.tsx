import { Metadata } from "next";
import { LayoutDashboard, BarChart3, UserCircle } from "lucide-react";
import Sidebar, { SidebarItem } from '@/components/sidebar';
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./main.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Journal",
  description: "My journal and to-do list application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}){
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex">
          <Sidebar>
            {/* Need to add functionality to add task */}
            <SidebarItem icon={<LayoutDashboard size={20} />} text="Add task" />
            <Link 
              href="/inbox"
              aria-label="Inbox"
              data-tooltip-id="Inbox"
              data-tooltip-content="Inbox"
            >
              <SidebarItem icon={<LayoutDashboard size={20} />} text="Inbox" />
            </Link>
            <Link 
              href="/today"
              aria-label="Add task"
              data-tooltip-id="Today"
              data-tooltip-content="Today"
            >
                <SidebarItem icon={<LayoutDashboard size={20} />} text="Today"/>
            </Link>
            <Link href="/upcoming"
              aria-label="Upcoming"
              data-tooltip-id="Upcoming"
              data-tooltip-content="Upcoming">
              <SidebarItem icon={<BarChart3 size={20} />} text="Upcoming" />
            </Link>
            <Link href="/completed"
              aria-label="Completed"
              data-tooltip-id="Completed"
              data-tooltip-content="Completed"
            >
              <SidebarItem icon={<UserCircle size={20} />} text="Completed" />
            </Link>          
          </Sidebar>
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
