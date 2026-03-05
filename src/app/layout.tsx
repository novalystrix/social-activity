import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import ChatSidebar from "@/components/ChatSidebar";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Novalystrix Social Dashboard",
  description: "Review and manage Novalystrix social media activity",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0a] text-zinc-100 min-h-screen`}>
        <SessionWrapper>
          <Nav />
          <main className="ml-56 min-h-screen pr-0 md:pr-[0px]">
            <div className="max-w-6xl mx-auto px-6 py-8">
              {children}
            </div>
          </main>
          <ChatSidebar />
        </SessionWrapper>
      </body>
    </html>
  );
}
