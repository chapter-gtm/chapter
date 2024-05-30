import Sidebar from "@/components/MainSidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { cookies } from "next/headers";
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
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <div className="bg-zinc-100 h-screen overflow-hidden">
          <div className="grid grid-cols-9 h-screen">
            <Sidebar className="col-span-1" />
            <main className="col-span-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
