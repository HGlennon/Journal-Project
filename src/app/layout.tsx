import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from '@/components/sidebar/sidebar';
import "./main.css";
import SessionWrapper from '@/components/SessionWrapper';
import SidebarNavigation from '@/components/sidebar/sidebarNavigation';

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
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionWrapper>
          <div className="flex h-screen w-full">
            <Sidebar>
              <SidebarNavigation />
            </Sidebar>
            <main className="flex-1 overflow-auto px-4 py-8 bg-white">
              {children}
            </main>
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}
