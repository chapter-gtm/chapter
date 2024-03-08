import Sidebar from "@/components/MainSidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { cookies } from "next/headers";
import { accounts, mails } from "@/components/project/data";
import {
  ResizableHandle,
  ResizablePanelGroup,
  ResizablePanel,
} from "@/components/ui/resizable";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nectar Console",
  description: "Customer Stories. Opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-background h-screen flex">
          <div className="flex flex-1 overflow-hidden">
            <Sidebar className="w-60 justify-between" />
            <main className="flex flex-1 flex-col">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
