"use client"
import React from "react"
import "./planner.css"
import { PlannerApp } from "@/components/planner/planner-app"
import { PlannerProvider } from "@/hooks/use-planner" // <-- 1. IMPORT THE PROVIDER

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* 2. WRAP THE COMPONENT THAT NEEDS THE CONTEXT */}
      <PlannerProvider>
        <PlannerApp />
      </PlannerProvider>
    </main>
  )
}
