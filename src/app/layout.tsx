import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { DevModeBanner } from "@/components/dev-mode-banner";
import { isLocalDevMode } from "@/lib/dev-mode";
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
  title: "Travel Tracker — Count your countries",
  description:
    "Track every country you've visited, lived in, or want to see. Your lifetime travel map and progress to 100.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const devMode = isLocalDevMode();

  const body = (
    <>
      {devMode && <DevModeBanner />}
      {children}
    </>
  );

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        {devMode ? body : <ClerkProvider>{body}</ClerkProvider>}
      </body>
    </html>
  );
}
