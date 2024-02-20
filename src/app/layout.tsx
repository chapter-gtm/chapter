import { Sidebar } from "@/components/MainSidebar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nectar Console",
  description: "Deep interview-like insights at survey-like speed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="border-t ">
          <div className="bg-background">
            <div className="grid md:grid-cols-8">
              <Sidebar className="hidden lg:block" />
              <div className="col-span-7 lg:col-span-7 lg:border-l">
                <div className="">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
