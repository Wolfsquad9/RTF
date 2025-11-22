"use client"

import type React from "react"
import { usePlanner } from "@/hooks/use-planner"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Download, Trash2 } from "lucide-react"

interface PlannerLayoutProps {
  children: React.ReactNode
}

export const PlannerLayout: React.FC<PlannerLayoutProps> = ({ children }) => {
  const { resetPlanner, state } = usePlanner()

  const handleExport = () => {
    // Placeholder for export functionality
    alert("Export feature coming soon!")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 mt-4">
                  <h2 className="text-lg font-semibold">Navigation</h2>
                  {/* Add navigation links here */}
                  <Button variant="ghost" className="justify-start">
                    Overview
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Weeks 1-4
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Weeks 5-8
                  </Button>
                  <Button variant="ghost" className="justify-start">
                    Weeks 9-12
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="font-bold text-xl tracking-tight">Return to Form</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="hidden sm:flex gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="destructive" size="sm" onClick={resetPlanner} className="hidden sm:flex gap-2">
              <Trash2 className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-6 px-4 md:px-8 mx-auto max-w-5xl">{children}</main>
    </div>
  )
}
