"use client"

import type React from "react"
import { usePlanner } from "@/hooks/use-planner"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Download, Trash2, Dumbbell } from "lucide-react"

interface PlannerLayoutProps {
  children: React.ReactNode
}

export const PlannerLayout: React.FC<PlannerLayoutProps> = ({ children }) => {
  const { resetPlanner, exportJSON } = usePlanner()

  const handleExport = () => {
    const json = exportJSON()
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `rtf-planner-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] bg-zinc-900 border-zinc-800">
                <nav className="flex flex-col gap-4 mt-8">
                  <h2 className="text-lg font-semibold text-amber-500 mb-4">Navigation</h2>
                  <Button variant="ghost" className="justify-start text-zinc-300 hover:text-amber-500 hover:bg-zinc-800">
                    Overview
                  </Button>
                  <Button variant="ghost" className="justify-start text-zinc-300 hover:text-amber-500 hover:bg-zinc-800">
                    Weeks 1-4
                  </Button>
                  <Button variant="ghost" className="justify-start text-zinc-300 hover:text-amber-500 hover:bg-zinc-800">
                    Weeks 5-8
                  </Button>
                  <Button variant="ghost" className="justify-start text-zinc-300 hover:text-amber-500 hover:bg-zinc-800">
                    Weeks 9-12
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
            
            <Dumbbell className="h-6 w-6 text-amber-500" />
            <h1 className="font-bold text-xl tracking-tight text-zinc-100">
              Return to <span className="text-amber-500">Form</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExport} 
              className="hidden sm:flex gap-2 bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-amber-500 hover:border-amber-500"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={resetPlanner} 
              className="hidden sm:flex gap-2 bg-red-900/50 border border-red-700 text-red-300 hover:bg-red-900 hover:text-red-100"
            >
              <Trash2 className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-8 px-4 md:px-8 mx-auto max-w-6xl">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-6 bg-zinc-950">
        <div className="container px-4 md:px-8 text-center text-sm text-zinc-500">
          <p>Return to Form - 12 Week Fitness Planner</p>
          <p className="mt-1">Track your progress. Build consistency. Transform yourself.</p>
        </div>
      </footer>
    </div>
  )
}
