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
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <TopNavbar />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav className="mx-6" />
          </div>
        </div>
        <main className="col-span-8">{children}</main>
      </div>
    </div>
  );
}
