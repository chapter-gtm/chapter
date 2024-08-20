import "@/app/globals.css";
import { TopNavbar } from "@/components/TopNavbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { UserNav } from "@/components/UserNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nectar Console",
  description: "GTM built for technical founders.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="background relative flex flex-col h-dvh ">
      <div className="flex flex-row h-20 py-3 items-center px-6 border-b border-border background">
        <TopNavbar />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
      {/* Keep the following 'flex', 'flex-1', 'overflow' to extend the full height */}
      <main className="flex flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
