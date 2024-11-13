import "@/app/globals.css";
import { TopNavbar } from "@/components/TopNavbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserNav } from "@/components/UserNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chapter App",
  description: "Lead gen for founders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-dvh flex flex-col relative overflow-hidden">
      <div className="fixed top-0 w-full z-50">
        {/* Navbar start */}
        <div className="flex flex-row h-20 py-3 items-center px-6 border-b border-border/40 bg-card dark:bg-background">
          <TopNavbar />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </div>
      <>{children}</>
    </div>
  );
}
