// app/layout.tsx
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import "./planner.css"        // ← This is crucial

export const metadata: Metadata = {
  title: "Return to Form",
  description: "Tactical 12-Week Fitness Planner",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">     {/* ← THIS LINE FIXES EVERYTHING */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900
