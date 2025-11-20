// app/page.tsx (Final Update)
"use client" // KEEP THIS AS WE ARE IMPORTING A CLIENT COMPONENT

import React from "react"
import "./planner.css"
import { PlannerWrapper } from "@/components/PlannerWrapper" // <-- NEW IMPORT

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* USE THE WRAPPER COMPONENT HERE */}
      <PlannerWrapper />
    </main>
  )
}
