import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import './planner.css'  // ADD THIS

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Return to Form - RTF Planner',
  description: 'Tactical 12-week fitness transformation planner',
  generator: 'v0.app',
  icons: { icon: '/icon.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">  {/* ADD scroll-smooth */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${_geist.className} font-rajdhani antialiased bg-[var(--primary-bg)] text-[var(--text-primary)] dark`}>  {/* FORCE DARK + VARS */}
        {children}
        <Analytics />
      </body>
    </html>
  )
}
