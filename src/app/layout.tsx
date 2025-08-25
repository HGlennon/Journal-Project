// app/layout.tsx (or wherever your RootLayout is)
import { Metadata } from "next";
import { Geist_Mono, Open_Sans } from "next/font/google";
import SessionWrapper from "@/components/sessionWrapper";
import "./main.css";
import { ThemeProvider } from "@/components/themeProvider";
import Script from "next/script";
import AppShell from "@/components/appShell";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"], 
  variable: "--font-open-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Journal",
  description: "My journal and to-do list application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){
            try {
              var key='app:theme';
              var t = localStorage.getItem(key);
              var c = document.documentElement.classList;
              c.remove('theme-dark','theme-pastel');
              if (t && t !== 'default') c.add('theme-'+t);
            } catch(e){}
          })();`}
        </Script>
      </head>
      <body className={`${openSans.className} ${geistMono.variable} antialiased`}>
        <SessionWrapper>
          <ThemeProvider>
            <AppShell>{children}</AppShell>
          </ThemeProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
